import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  questions: any[] = [];
  newQuestion: string = '';
  newOptions: string[] = ['', '', '', '']; // Initialize with four empty options
  correctAnswer: string = ''; // Define the correctAnswer property
  selectedQuestionId: string | null = null; // Track the selected question for updating

  constructor(private loginService: LoginService) {
    this.loadQuestions();
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.loginService.onQuestionAdded().subscribe((question) => {
      this.questions.push(question);
    });
  
    this.loginService.onQuestionUpdated().subscribe((updatedQuestion) => {
      const index = this.questions.findIndex(q => q._id === updatedQuestion._id);
      if (index !== -1) {
        this.questions[index] = updatedQuestion;
      }
    });
  
    this.loginService.onQuestionDeleted().subscribe((questionId) => {
      this.questions = this.questions.filter(q => q._id !== questionId);
    });
  }
  
  loadQuestions() {
    this.loginService.getQuestions().subscribe((data: any) => {
      this.questions = data.data;
    });
  }

  addQuestion() {
    if (!this.newQuestion || !this.correctAnswer || this.newOptions.some(option => !option)) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    const correctAnswerIndex = this.newOptions.indexOf(this.correctAnswer);

    const questionData = {
      question: this.newQuestion,
      options: this.newOptions,
      correctAnswer: correctAnswerIndex
    };

    if (this.selectedQuestionId) {
      // If we're updating a question, show confirmation
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to update this question.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loginService.updateQuestion({ ...questionData, _id: this.selectedQuestionId });
          Swal.fire('Updated!', 'Your question has been updated.', 'success');
          this.resetForm();
          this.loadQuestions();
        }
      });
    } else {
      // If we're adding a new question
      this.loginService.createQuestion(questionData);
      this.resetForm();
      this.loadQuestions();
      Swal.fire('Success', 'New question added successfully!', 'success');
    }

    this.loadQuestions(); // Reload questions after adding or updating
  }

  resetForm() {
    this.newQuestion = '';
    this.newOptions = ['', '', '', ''];
    this.correctAnswer = ''; // Reset correctAnswer after form submission
    this.selectedQuestionId = null; // Reset selected question ID
  }

  editQuestion(question: any) {
    this.newQuestion = question.question;
    this.newOptions = question.options;
    this.correctAnswer = question.options[question.correctAnswer]; // Set the correct answer based on the index
    this.selectedQuestionId = question._id; // Set the ID for updating
  }

  deleteQuestion(id: string) {
    // Confirm delete action
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginService.deleteQuestion(id);
        Swal.fire('Deleted!', 'The question has been deleted.', 'success');
        this.loadQuestions(); // Reload questions after deletion
      }
    });
  }
}
