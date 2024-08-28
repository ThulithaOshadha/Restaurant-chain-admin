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
import { QueryComponent } from './queries/query.component';
import { AllStaffComponent } from './user-management/staff-management/all-staff/staff-management.component';
import { AddStaffComponent } from './user-management/staff-management/add-staff/add-staff-management.component';
import { UpdateStaffComponent } from './user-management/staff-management/update-staff/update-staff-management.component';
import { CustomerAllDetailsComponent } from './user-management/customer-management/customer-management.component';
import { FacilitiesDetailsComponent } from './facilities/all-facilities/all-facility.component';
import { AddFacilityComponent } from './facilities/add-facility/add-facility.component';

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
  },
  {
    path: "query",
    component: QueryComponent
  },
  {
    path: "all-staff",
    component: AllStaffComponent,

  },
  {
    path: "all-staff/add",
    component: AddStaffComponent,
  },
  {
    path: "all-staff/update/:id",
    component: UpdateStaffComponent
  }
  ,
  {
    path: "customer",
    component: CustomerAllDetailsComponent
  }
  ,
  {
    path: "facilities",
    component: FacilitiesDetailsComponent
  },
  {
    path: "facilities/add",
    component: AddFacilityComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
