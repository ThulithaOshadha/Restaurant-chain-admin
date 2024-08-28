import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { RoleService } from 'src/app/services/role.service';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { hasPermission } from 'src/app/store';
import { StaffManageService } from 'src/app/services/staff-manage.service';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxUiLoaderModule
  ],
  templateUrl: './add-staff-management.component.html',
  styleUrl: './add-staff-management.component.scss'
})
export class AddStaffComponent {  

  breadCrumbItems!: Array<{}>;
  roles: any;
  parentCategory: any;
  isSubmitted: boolean = false;
  staffAddForm!: FormGroup;

  private toastr = inject(ToastrService);
  private router = inject(Router);
  private roleService = inject(RoleService);
  private staffService = inject(StaffManageService);
  private ngxLoader =  inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Staff Management", link: "/staff" },
      { label: "Add", active: true },
    ];
  
    this.getAllRoles(); 
    this.staffAddForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      contactNo: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      role: new FormControl("", [Validators.required]),
    });

  }

  hasPermissionForUser(permission: string) {
    return hasPermission(permission);
  }

  getAllRoles(pageNumber?: number) {
    this.ngxLoader.start();
    this.roleService.getAllRoles(pageNumber).subscribe((response) => {
      this.roles = response.data.records;
    });
    this.ngxLoader.stop();
  }

  createStaff(){
    
    this.isSubmitted = true;
    this.ngxLoader.start();
    if (this.staffAddForm.valid) {
      const data = {
        firstName: this.staffAddForm.value.firstName,
        lastName: this.staffAddForm.value.lastName,
        contactNo: this.staffAddForm.value.contactNo,
        email: this.staffAddForm.value.email,
        role: this.staffAddForm.value.role,
      };

      this.staffService.create(data).subscribe({
        next: (res) => {
          this.isSubmitted = false;
          this.router.navigate(['/all-staff']);
        },
        error: (e) => {
          this.isSubmitted = false;
        },
      });
    }
    else {
      console.log("not valid");
      
    }
    this.ngxLoader.stop();
  }
}
