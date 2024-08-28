import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralUtilityService } from 'src/app/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response.model';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { hasPermission } from 'src/app/store';
import { FacilitiesService } from 'src/app/services/facility.service';

@Component({
  selector: 'app-all-facilities',
  standalone: true,
  imports: [CommonModule, NgbPagination, SharedModule, ReactiveFormsModule, RouterModule, NgxUiLoaderModule],
  templateUrl: './all-facility.component.html',
  styleUrl: './all-facility.component.scss'
})
export class FacilitiesDetailsComponent {
  facilities: any;
  role: any;
  breadCrumbItems!: Array<{}>;
  currentPage: number = 1;
  totalCount: number = 0;
  pageSize: number = 10;
  isSubmitted: boolean = false;

  private generalUtilityService = inject(GeneralUtilityService);
  private toastr = inject(ToastrService);
  private facilityService = inject(FacilitiesService);
  private ngxLoader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Facilities", active: true },
    ];

    this.getAllStaff();
  }

  hasPermissionForUser(permission: string) {
    return hasPermission(permission);
  }


  getAllStaff(pageNumber?: number, pageSize?: number) {
    this.ngxLoader.start();
    this.facilityService.getAllURL(pageNumber, pageSize).subscribe((response) => {
      this.facilities = response.data.records;
      this.totalCount = response.data.totalRecords;
    });
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
    this.getAllStaff(pageNumber, this.pageSize);
  }

  deleteStaff(id: any) {
    Swal.fire({
      title: "Oops...",
      text: "Are you sure you want to delete this user ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(13, 109, 164)",
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {

        this.facilityService.delete(id).subscribe({
          next: (response: ApiResponse) => {
            Swal.fire({
              title: "Success!",
              text: "User deleted successfully",
              confirmButtonColor: "rgb(3, 142, 220)",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                this.getAllStaff();
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
