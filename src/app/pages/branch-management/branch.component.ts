import { Component, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/app/shared/shared.module";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { lastValueFrom } from "rxjs";
import { ApiResponse } from "src/app/models/api-response.model";
import Swal from "sweetalert2";
import { GeneralUtilityService } from "src/app/services/util.service";
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { hasPermission } from "src/app/store";
import { BranchService } from "src/app/services/branch.service";

@Component({
    selector: "app-branch",
    standalone: true,
    imports: [CommonModule, NgbPagination, SharedModule, ReactiveFormsModule, NgxUiLoaderModule],
    templateUrl: "./branch.component.html",
    styleUrl: "./branch.component.scss",
})
export class BranchComponent {
    branches: any;
    branch: any;
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
    private branchService = inject(BranchService);
    private ngxLoader = inject(NgxUiLoaderService);

    ngOnInit(): void {
        this.breadCrumbItems = [
            { label: "Dashboard" },
            { label: "Roles", active: true },
        ];

        this.getAllBranch(this.currentPage, this.pageSize);
        this.roleAddForm = new FormGroup({
            roleName: new FormControl("", [Validators.required, Validators.pattern(`^[a-zA-Z\\s'-]+$`)]),
            branchDesc: new FormControl("")  // Add the description field here
        });
        this.roleUpdateForm = new FormGroup({
            roleName: new FormControl("", [Validators.required, Validators.pattern(`^[a-zA-Z\\s'-]+$`)]),
            branchDesc: new FormControl("")
        });
    }

    hasPermissionForRoles(permission: string) {
        return hasPermission(permission);
    }

    getAllBranch(pageNumber?: number, pageSize?: number) {
        this.ngxLoader.start();
        this.branchService.getAllBranch(pageNumber, pageSize).subscribe((response) => {
            this.branches = response.data.records;
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

    createNewBranch() {
        this.isSubmitted = true;
        this.ngxLoader.start();

        if (this.roleAddForm.valid) {
            const data = {
                name: this.roleAddForm.value.roleName,
                description: this.roleAddForm.value.branchDesc
            };

            this.branchService.createBranch(data).subscribe({
                next: (res) => {
                    this.isSubmitted = false;
                    this.roleAddForm.reset();
                    this.modalService.dismissAll("close");
                    this.toastr.success('Role created successfully', 'success');
                    this.getAllBranch();
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

    async getBranchDetails(content: any, roleId: any) {
        this.ngxLoader.start();
        const roleDetailRes$ = this.branchService.getBranchDetails(roleId);
        const roleDetailRes = lastValueFrom(roleDetailRes$);
        await roleDetailRes.then((response: ApiResponse) => {
            this.branch = response.data;
            this.roleUpdateForm.patchValue({
                roleName: this.branch.name,
                branchDesc: this.branch.description
            });
            this.modalService.open(content);
        });
        this.ngxLoader.stop();
    }

    openEditModal(content: any, roleId: number) {
        this.getBranchDetails(content, roleId);
    }

    updateBranch() {
        this.isSubmitted = true;
        this.ngxLoader.start();
        if (this.roleUpdateForm.valid) {
            const data = {
                name: this.roleUpdateForm.value.roleName,
                description: this.roleUpdateForm.value.branchDesc,
            };

            this.branchService.updateBranch(this.branch.id, data).subscribe({
                next: (res) => {
                    this.isSubmitted = false;
                    this.toastr.success("Role Updated successfully", "Success!");
                    this.roleUpdateForm.reset();
                    this.modalService.dismissAll("close");
                    this.getAllBranch();
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
        this.getAllBranch(pageNumber, this.pageSize);
    }

    deleteBranch(branchId: number) {
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

                this.branchService.deleteBranch(branchId).subscribe({
                    next: (response: ApiResponse) => {
                        Swal.fire({
                            title: "Success!",
                            text: "Role Deleted",
                            confirmButtonColor: "rgb(3, 142, 220)",
                            icon: "success",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.getAllBranch();
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
