import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralUtilityService } from 'src/app/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
import { ApiResponse } from 'src/app/models/api-response.model';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { hasPermission } from 'src/app/store';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, NgbPagination, SharedModule, RouterModule, NgxUiLoaderModule],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss'
})
export class AllProductsComponent {

  products: any;
  product:any;
  breadCrumbItems!: Array<{}>;
  currentPage: number = 1;
  totalCount: number = 0;
  pageSize: number = 10;


  private generalUtilityService = inject(GeneralUtilityService);
  private toastr = inject(ToastrService);
  private productService = inject(ProductService);
  private ngxLoader =  inject(NgxUiLoaderService);


  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Products", active: true },
    ];

    this.getAllProducts(this.currentPage,this.pageSize);
  }

  hasPermissionForProduct(permission: string) {
    return hasPermission(permission);
  }

  getAllProducts(pageNumber?: number,pageSize?:number) {
    this.ngxLoader.start();
    this.productService.getAllProducts(pageNumber,pageSize).subscribe((response) => {
      this.products = response.data.records;
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
    this.getAllProducts(pageNumber,this.pageSize);
  }

  deleteProduct(productId:number) {
    Swal.fire({
      title: "Oops...",
      text: "Are you sure you want to delete this product ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgb(13, 109, 164)",
      cancelButtonColor: "rgb(243, 78, 78)",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {

        this.productService.deleteProduct(productId).subscribe({
          next: (response: ApiResponse) => {
            Swal.fire({
              title: "Success!",
              text: "Product deleted successfully",
              confirmButtonColor: "rgb(3, 142, 220)",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                this.getAllProducts();
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
