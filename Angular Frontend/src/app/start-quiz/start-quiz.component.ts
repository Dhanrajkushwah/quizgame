import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-start-quiz',
  templateUrl: './start-quiz.component.html',
  styleUrls: ['./start-quiz.component.css']
})
export class StartQuizComponent implements OnInit {

  questions: any[] = [];
  quizStarted: boolean = false;
  quizCompleted: boolean = false;
  currentQuestionIndex: number = 0;
  selectedOption: number | null = null;
  isAnswerChecked: boolean = false;
  answerStatus: string = '';
  score: number = 0;

  timer: number = 60; // Timer set for 60 seconds
  timerSubscription: Subscription | null = null; // Subscription to manage the timer

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.loginService.getQuestions().subscribe((data: any) => {
      this.questions = data.data; // Adjust according to your API response
    });
  }

  startQuiz() {
    this.quizStarted = true;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.startTimer(); // Start the timer when the quiz starts
  }

  startTimer() {
    this.timer = 60;
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.nextQuestion();
        } else {
          this.completeQuiz();  // End quiz if it's the last question
        }
      }
    });
  }
  
  selectOption(index: number) {
    this.selectedOption = index;
  }

  checkAnswer() {
    if (this.selectedOption !== null) {
      this.isAnswerChecked = true;
      const correctAnswer = this.questions[this.currentQuestionIndex].correctAnswer;

      if (this.selectedOption === correctAnswer) {
        this.answerStatus = 'Correct!';
        this.score++;
      } else {
        this.answerStatus = 'Incorrect!';
      }
    }
  }

  nextQuestion() {
    if (this.isAnswerChecked) {
      this.isAnswerChecked = false;
      this.answerStatus = '';
      this.selectedOption = null;
 
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.resetTimer();  // Reset timer for each new question
      } else {
        this.completeQuiz();
      }
    }
 }
 
 resetTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();  // Ensure we stop the previous timer
    }
    this.startTimer();  // Restart the timer for the next question
 }
 

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.isAnswerChecked = false;
      this.answerStatus = '';
      this.selectedOption = null;
      this.timer = 60; // Reset timer when going back
    }
  }

  completeQuiz() {
    this.quizCompleted = true;
    this.quizStarted = false;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Unsubscribe from the timer when quiz is completed
    }
  }

  restartQuiz() {
    this.quizCompleted = false;
    this.startQuiz();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe(); // Clean up timer subscription
    }
  }
}