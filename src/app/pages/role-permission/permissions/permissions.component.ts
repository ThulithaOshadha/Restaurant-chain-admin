import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RoleService } from 'src/app/services/role.service';
import { RolePermissionService } from 'src/app/services/role-permission.service';
import { Role } from 'src/app/models/role-permission/role.model';
import { Permission } from 'src/app/models/role-permission/permission.model';
import { ApiResponse } from 'src/app/models/api-response.model';
import { lastValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { GeneralUtilityService } from 'src/app/services/util.service';
import { result } from 'lodash';
import { hasPermission } from 'src/app/store';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule,NgbPagination,SharedModule,FormsModule,NgxUiLoaderModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent {

  breadCrumbItems!: Array<{}>;
  roles!: Array<Role>;
  role!: Array<Role>;
  permissions!: Array<Permission>;
  selectedPermissions: Array<Permission> = [];
  rolePermissions:Array<any> = [];
  roleChange:boolean = false;
  selectedRole!:Role;
  isSubmitted:boolean = false;
  currentPage: number = 1;
  totalCount: number = 0;
  pageSize: number = 10;

  private roleService = inject(RoleService);
  private generalUtilityService = inject(GeneralUtilityService);
  private rolePermissionService = inject(RolePermissionService);
  private toastr = inject(ToastrService);
  private ngxLoader =  inject(NgxUiLoaderService);

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Role Permissions", active: true },
    ];
    this.ngxLoader.start();
    this.getAllRoles(this.currentPage,this.pageSize);
    this.getAllPermissions();
    this.ngxLoader.stop();
    console.log("teeee",this.selectedPermissions);
  }

  hasPermissionForPermissionTasks(permission: string) {
    return hasPermission(permission);
  }

  getAllRoles(pageNumber?: number,pageSize?: number) {
    this.roleService.getAllRoles().subscribe((response) => {
      this.roles = response.data.records;
    });
  }

  getAllPermissions(pageNumber?: number,pageSize?: number) {
    this.rolePermissionService.getAllPermissions(pageNumber,pageSize).subscribe((response) => {
      this.permissions = response.data.records;
      // this.totalCount = response.data.totalRecords;
    });
  }

  async getRolePermissionDetails(roleId:any) {
    this.ngxLoader.start();
    const roleDetailRes$ = this.rolePermissionService.getRolePermissionDetails(roleId);
    const roleDetailRes = lastValueFrom(roleDetailRes$);
    await roleDetailRes.then((response: ApiResponse) => {
      // console.log("teeee",response.data.map((item:any) => item.permission.id));
      this.selectedPermissions = response.data.map((item:any) => item.permission.id);
   
    });
    this.ngxLoader.stop();
  }

  onRoleChange() {
    this.roleChange = true;
    console.log("role is here",this.selectedRole);
    
    this.getRolePermissionDetails(this.selectedRole);
  }
  
  loadPage(pageNumber: number) {
    this.getAllPermissions(pageNumber);
  }

  // calculateEntryRange(): string {
  //   return this.generalUtilityService.getTblPaginationEntryRange(
  //     this.currentPage,
  //     this.pageSize,
  //     this.totalCount
  //   );
  // }

  isSelected(itemId: any): boolean {
    return this.selectedPermissions.includes(itemId);
  }

  // addToSelectedItems(item: any) {
  //   let index = -1;
  //   console.log("Item",item);
  //   for (let i = 0; i < this.selectedPermissions.length; i++) {
  //     if (this.selectedPermissions[i].id === item.id) {
  //       index = i;
  //       break;
  //     }
  //   }
  //   if (index === -1) {
  //     this.selectedPermissions.push(item.id);
  //   } else {
  //     this.selectedPermissions.splice(index, 1);
  //   }
  //   console.log("selected Items",this.selectedPermissions);
  // }
  addToSelectedItems(item: any) {
    console.log("Item", item);

    
 
      // Add the item if it's not already in the selectedPermissions
      if (!this.selectedPermissions.includes(item.id)) {
        this.selectedPermissions.push(item.id);
      }
      else {
        // Remove the item if it exists in the selectedPermissions
        const index = this.selectedPermissions.indexOf(item.id);
        if (index !== -1) {
          this.selectedPermissions.splice(index, 1);
        }
      }
    
    

    console.log("selected Items", this.selectedPermissions);
  }

  saveRolePermissions() {
    this.isSubmitted = true;
    //this.ngxLoader.start();
    const data = {
      role: {"id": this.selectedRole},
      permission: this.selectedPermissions
    }
    /*  */
    Swal.fire({
      title: "Oops...",
      text: "Are you sure you want to update this role permission?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(13, 109, 164)",
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Yes",
    }).then((result)=>{
      this.ngxLoader.start();
      if(result.value){
        this.rolePermissionService.assignRolePermission(data).subscribe({
          next: (res:any) => {
            this.isSubmitted = false;
            this.toastr.success("Role permission updated successfully", "Success!");
            this.ngxLoader.stop();
          },
          error: (e) => {
            this.isSubmitted = false;
          },
        });
       
      }
      
    });
    /* this.rolePermissionService.assignRolePermission(data).subscribe({
      next: (res:any) => {
        this.isSubmitted = false;
        this.toastr.success("Role Permission Updated", "Success!");
      },
      error: (e) => {
        this.isSubmitted = false;
      },
    });
    this.ngxLoader.stop(); */
  }
}
