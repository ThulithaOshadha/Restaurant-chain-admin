import { Component, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/app/shared/shared.module";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import Swal from "sweetalert2";
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { hasPermission } from "src/app/store";
import { RoleService } from "src/app/services/role.service";
import { GeneralUtilityService } from "src/app/services/util.service";
import { ApiResponse } from "src/app/models/api-response.model";

@Component({
  selector: "app-roles",
  standalone: true,
  imports: [CommonModule, NgbPagination, SharedModule, ReactiveFormsModule, NgxUiLoaderModule],
  templateUrl: "./roles.component.html",
  styleUrl: "./roles.component.scss",
})
export class RolesComponent {
  roles: any;
  role: any;
  breadCrumbItems!: Array<{}>;
  currentPage: number = 1;
  totalCount: number = 0;
  pageSize: number = 10;
  roleAddForm!: FormGroup;
  roleUpdateForm!: FormGroup;
  isSubmitted: boolean = false;
  @ViewChild("roleUpdateModal") editDataModal: any;

  private generalUtilityService = inject(GeneralUtilityService);
  private modalService = inject(NgbModal);
  private toastr = inject(ToastrService);
  private roleService = inject(RoleService);
  private ngxLoader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Roles", active: true },
    ];

    this.getAllRoles(this.currentPage, this.pageSize);
    this.roleAddForm = new FormGroup({
      roleName: new FormControl("", [Validators.required, Validators.pattern(`^[a-zA-Z\\s'-]+$`)]),
    });
    this.roleUpdateForm = new FormGroup({
      roleName: new FormControl("", [Validators.required, Validators.pattern(`^[a-zA-Z\\s'-]+$`)]),
    });
  }

  hasPermissionForRoles(permission: string) {
    return hasPermission(permission);
  }

  getAllRoles(pageNumber?: number, pageSize?: number) {
    this.ngxLoader.start();
    this.roleService.getAllRoles(pageNumber, pageSize).subscribe((response) => {
      this.roles = response.data.records;
      this.totalCount = response.data.totalRecords;
    });
    this.ngxLoader.stop();
  }

  openRoleModal(content: any) {
    this.modalService.open(content);
  }

  onCloseModal() {
    this.isSubmitted = false;
  }

  createNewRole() {
    this.isSubmitted = true;
    this.ngxLoader.start();
    if (this.roleAddForm.valid) {
      const data = {
        name: this.roleAddForm.value.roleName,
      };

      this.roleService.createRole(data).subscribe({
        next: (res) => {
          this.isSubmitted = false;
          this.roleAddForm.reset();
          this.modalService.dismissAll("close");
          this.toastr.success('Role created successfully', 'success');
          this.getAllRoles();
        },
        error: (e) => {
          this.isSubmitted = false;
        },
      });
    } else {
      this.toastr.warning('Role name is invalid !', 'warning');
    }

    this.ngxLoader.stop();
  }

  async getRoleDetails(content: any, roleId: any) {
    this.ngxLoader.start();
    const roleDetailRes$ = this.roleService.getRoleDetails(roleId);
    const roleDetailRes = lastValueFrom(roleDetailRes$);
    await roleDetailRes.then((response: ApiResponse) => {
      this.role = response.data;
      this.roleUpdateForm.patchValue({
        roleName: this.role.name,
      });
      this.modalService.open(content);
    });
    this.ngxLoader.stop();
  }

  openEditModal(content: any, roleId: number) {
    this.getRoleDetails(content, roleId);
  }

  updateRole() {
    this.isSubmitted = true;
    this.ngxLoader.start();
    if (this.roleUpdateForm.valid) {
      const data = {
        name: this.roleUpdateForm.value.roleName,
      };

      this.roleService.updateRole(this.role.id, data).subscribe({
        next: (res) => {
          this.isSubmitted = false;
          this.toastr.success("Role Updated successfully", "Success!");
          this.roleUpdateForm.reset();
          this.modalService.dismissAll("close");
          this.getAllRoles();
        },
        error: (e) => {
          this.isSubmitted = false;
        },
      });
    } else {
      this.toastr.warning('Role name is invalid !', 'warning');
    }
    this.ngxLoader.stop();
  }

  calculateEntryRange(): string {
    return this.generalUtilityService.getTblPaginationEntryRange(
      this.currentPage,
      this.pageSize,
      this.totalCount
    );
  }

  loadPage(pageNumber: number) {
    this.getAllRoles(pageNumber, this.pageSize);
  }

  deleteRole(roleId: number) {
    Swal.fire({
      title: "Oops...",
      text: "Are you sure you want to delete this role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(13, 109, 164)",
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {

        this.roleService.deleteRole(roleId).subscribe({
          next: (response: ApiResponse) => {
            Swal.fire({
              title: "Success!",
              text: "Role Deleted",
              confirmButtonColor: "rgb(3, 142, 220)",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                this.getAllRoles();
              }
            });
          },
          error: (e) => {
            // this.getAllFiles(this.parent_id, this.category_name);
          },
        });
      }
    });
  }

}
