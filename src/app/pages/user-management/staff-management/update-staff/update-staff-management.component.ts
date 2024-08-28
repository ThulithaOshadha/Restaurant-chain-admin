import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/services/role.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response.model';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { hasPermission } from 'src/app/store';
import { StaffManageService } from 'src/app/services/staff-manage.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
    , NgxUiLoaderModule],
  templateUrl: './update-staff-management.component.html',
  styleUrl: './update-staff-management.component.scss'
})
export class UpdateStaffComponent {
  breadCrumbItems!: Array<{}>;
  roles: any;
  user: any;
  parentCategory: any;
  isSubmitted: boolean = false;
  staffUpdateForm!: FormGroup;
  userId: any;

  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private roleService = inject(RoleService);
  private staffService = inject(StaffManageService);
  private ngxLoader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "User Management", link: "/all-staff" },
      { label: "Edit", active: true },
    ];
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getAllRoles();
    this.getStaffDetails(this.userId);
    this.staffUpdateForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      contactNo: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      role: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
    });

  }

  hasPermissionForUser(permission: string) {
    return hasPermission(permission);
  }

  getAllRoles(pageNumber?: number) {
    this.roleService.getAllRoles(pageNumber).subscribe((response) => {
      this.roles = response.data.records;
    });
  }

  async getStaffDetails(userId: any) {
    this.ngxLoader.start();
    const roleDetailRes$ = this.staffService.getDetails(userId);
    const roleDetailRes = lastValueFrom(roleDetailRes$);
    await roleDetailRes.then((response: ApiResponse) => {
      this.user = response.data;
      this.staffUpdateForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        contactNo: this.user.contactNo,
        email: this.user.email,
        role: this.user.role,
        status: this.user.status,
      });
    });
    this.ngxLoader.stop();
  }

  updateStaff() {
    console.log(this.staffUpdateForm.value);

    this.isSubmitted = true;
    this.ngxLoader.start();
    if (this.staffUpdateForm.valid) {
      const data = {
        firstName: this.staffUpdateForm.value.firstName,
        lastName: this.staffUpdateForm.value.lastName,
        contactNo: this.staffUpdateForm.value.contactNo,
        email: this.staffUpdateForm.value.email,
        role: this.staffUpdateForm.value.role,
        status: this.staffUpdateForm.value.status,
      };

      // console.log(data);

      this.staffService.update(this.userId, data).subscribe({
        next: (res) => {
          this.isSubmitted = false;
          this.router.navigate(['/all-staff']);
        },
        error: (e) => {
          this.isSubmitted = false;
          this.ngxLoader.stop();
        },
      });
      this.ngxLoader.stop();
    }
    else {
      this.ngxLoader.stop();
      console.log("not valid");

    }
  }
}
