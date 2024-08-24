import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RolesComponent } from './role-permission/roles/roles.component';
import { PermissionsComponent } from './role-permission/permissions/permissions.component';
import { CategoriesComponent } from '../shared/landing/nft/categories/categories.component';
import { AllProductsComponent } from './product-management/product/all-products/all-products.component';
import { AddProductComponent } from './product-management/product/add-product/add-product.component';
import { EditProductComponent } from './product-management/product/edit-product/edit-product.component';
import { BranchComponent } from './branch-management/branch.component';

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
    {
      path: "product",
      children: [
        {
          path: "categories",
          component: CategoriesComponent,
        },
        {
          path: "",
          component: AllProductsComponent,
        },
        {
          path: "add",
          component: AddProductComponent,
        },
        {
          path: "edit/:id",
          component: EditProductComponent,
        },
      ]
    },
    {
      path: "branch",
      component: BranchComponent
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
