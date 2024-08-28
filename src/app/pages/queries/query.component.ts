import { Component, TemplateRef, ViewChild, inject } from "@angular/core";
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
import { QueryService } from "src/app/services/query.service";

@Component({
  selector: "app-query",
  standalone: true,
  imports: [CommonModule, NgbPagination, SharedModule, ReactiveFormsModule, NgxUiLoaderModule],
  templateUrl: "./query.component.html",
  styleUrls: ["./query.component.scss"],
})
export class QueryComponent {
  queries: any[] = []; // Adjusted the name from roles to queries
  selectedQuery: any; 
  breadCrumbItems!: Array<{}>;
  currentPage: number = 1;
  totalCount: number = 0;
  pageSize: number = 10;
  addForm!: FormGroup;
  updateForm!: FormGroup;
  replyForm!: FormGroup;
  isSubmitted: boolean = false;
  @ViewChild("replyModal") replyModal?: TemplateRef<any>;

  private generalUtilityService = inject(GeneralUtilityService);
  private modalService = inject(NgbModal);
  private toastr = inject(ToastrService);
  private queryService = inject(QueryService);
  private ngxLoader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Customer Queries", active: true },
    ];

    this.getAll(this.currentPage, this.pageSize);

    this.replyForm = new FormGroup({
      message: new FormControl("", [Validators.required]),
    });
    
  }

  hasPermissionForRoles(permission: string) {
    return hasPermission(permission);
  }

  getAll(pageNumber?: number, pageSize?: number) {
    this.ngxLoader.start();
    this.queryService.getAll(pageNumber, pageSize).subscribe((response) => {
      this.queries = response.data.records; // Adjusted the name from roles to queries
      this.totalCount = response.data.totalRecords;
    });
    this.ngxLoader.stop();
  }

  openReplyModal(query: any) {
    this.selectedQuery = query;
    this.modalService.open(this.replyModal, { ariaLabelledBy: 'reply-modal-title' });
  }

  sendReply() {
    this.isSubmitted = true;
    if (this.replyForm.valid) {
      const data = {
        queryId: this.selectedQuery.id,
        response: this.replyForm.value.message,
      };

      this.ngxLoader.start();
      this.queryService.update(data.queryId, data).subscribe({
        next: (res) => {
          this.isSubmitted = false;
          this.modalService.dismissAll("close");
          this.toastr.success('Reply sent successfully', 'Success');
          this.getAll();
        },
        error: (e) => {
          this.isSubmitted = false;
          this.toastr.error('Failed to send reply. Please try again.', 'Error');
          console.error('Error sending reply:', e);
        },
        complete: () => this.ngxLoader.stop(),
      });
    } else {
      this.toastr.warning('Reply message is required!', 'Warning');
    }
  }

  calculateEntryRange(): string {
    return this.generalUtilityService.getTblPaginationEntryRange(
      this.currentPage,
      this.pageSize,
      this.totalCount
    );
  }

  loadPage(pageNumber: number) {
    this.getAll(pageNumber, this.pageSize);
  }

  delete(queryId: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.queryService.delete(queryId).subscribe({
          next: (response: ApiResponse) => {
            Swal.fire(
              "Deleted!",
              "The query has been deleted.",
              "success"
            );
            this.getAll();
          },
          error: (e) => {
            Swal.fire(
              "Error!",
              "There was a problem deleting the query.",
              "error"
            );
          },
        });
      }
    });
  }
}
