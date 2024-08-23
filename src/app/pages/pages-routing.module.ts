import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RolesComponent } from './role-permission/roles/roles.component';
import { PermissionsComponent } from './role-permission/permissions/permissions.component';

// Component pages

const routes: Routes = [
    {
        path: "",
        component: DashboardComponent
    },
    {
      path: "roles",
      component: RolesComponent
    },
    {
      path: "permissions",
      component: PermissionsComponent
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
