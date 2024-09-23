import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from '../admin.guard';
const routes: Routes = [
  { path: '/admin', component: AdminDashboardComponent, canActivate: [AdminGuard] }, // Admin dashboard route
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
