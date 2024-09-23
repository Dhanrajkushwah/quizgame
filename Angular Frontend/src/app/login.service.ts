import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private socket: Socket;
  constructor(private _http: HttpClient) { 
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
    this.socket = io('http://localhost:5000');
  }
    // Register User
  signup(obj: any): Observable<any> {
    return this._http.post<any>(`${environment._api}/api/user/signup`, obj);
  }

  // Log in user
  login(obj: any): Observable<any> {
    return this._http.post<any>(`${environment._api}/api/user/login`, obj).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          // Update the authentication state
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  Adminlogin(obj: any): Observable<any> {
    return this._http.post<any>(`${environment._api}/api/user/admin`, obj);
  }

 // Log out user
 logout(): void {
  localStorage.removeItem('token');
  this.isAuthenticatedSubject.next(false);
}

// Get current authentication state
isLoggedIn(): boolean {
  return this.isAuthenticatedSubject.getValue();
}

// Get authorization headers
getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}

// Get token from local storage
getToken(): string | null {
  return localStorage.getItem('token');
}

  // Common options for HTTP requests, e.g., headers
  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`  // Adjust the token retrieval logic as needed
      })
    };
  }
 // Get the current user ID from the token
 getUserId(): string | null {
  const token = this.getToken();

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token); 
      return decodedToken.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  } else {
    console.error('No token found!');
    return null;
  }
}
// Fetch the user's role from the token (assuming it is stored in the JWT)
getUserRole(): string | null {
  const token = this.getToken();
  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role; // Assuming role is stored in the token
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
}

// Get questions from the API
getQuestions(): Observable<any[]> {
  return this._http.get<any[]>(`${environment._api}/api/user/quiz/questions`, { headers: this.getAuthHeaders() });
}
 // Create question via API
 createQuestion(question: any): void {
  this._http.post(`${environment._api}/api/user/quiz/create`, question, { headers: this.getAuthHeaders() })
    .subscribe(() => {
      this.socket.emit('create-question', question);
    }, (error) => {
      console.error('Error creating question:', error);
    });
}


// Update question via API
updateQuestion(question: any): void {
  this._http.put(`${environment._api}/api/user/quiz/update/${question._id}`, question, { headers: this.getAuthHeaders() }).subscribe(() => {
    this.socket.emit('update-question', question);
  });
}

// Delete question via API
deleteQuestion(questionId: string): void {
  this._http.delete(`${environment._api}/api/user/quiz/delete/${questionId}`, { headers: this.getAuthHeaders() }).subscribe(() => {
    this.socket.emit('delete-question', questionId);
  });
}

// Socket event listeners for real-time updates
onQuestionAdded(): Observable<any> {
  return new Observable((observer) => {
    this.socket.on('question-added', (question) => {
      observer.next(question);
    });
  });
}

onQuestionUpdated(): Observable<any> {
  return new Observable((observer) => {
    this.socket.on('question-updated', (question) => {
      observer.next(question);
    });
  });
}

onQuestionDeleted(): Observable<any> {
  return new Observable((observer) => {
    this.socket.on('question-deleted', (questionId) => {
      observer.next(questionId);
    });
  });
}
}