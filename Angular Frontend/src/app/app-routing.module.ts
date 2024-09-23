import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';

import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin.guard';
import { StartQuizComponent } from './start-quiz/start-quiz.component';
import { AdminloginComponent } from './admin/adminlogin/adminlogin.component';

const routes: Routes = [  
  { path: 'home', component: HomeComponent },
  { path: 'signupform', component: RegisterComponent },
  { path: 'loginform', component: LoginComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'startquiz', component: StartQuizComponent },
  { path: 'adminlogin', component: AdminloginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: '', redirectTo: '/loginform', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
