import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { ProductRoutes } from "../routes/product-routes";

const getAllCategoriesURL = ProductRoutes.getAllCategoriesURL;
const createCategoryURL = ProductRoutes.createCategoryURL;
const categoryDetailsURL = ProductRoutes.categoryDetailsURL;
const categoryUpdateURL = ProductRoutes.categoryUpdateURL;
const categoryDeleteURL = ProductRoutes.categoryDeleteURL;

const createProductURL = ProductRoutes.createProductURL;
const getAllProductsURL = ProductRoutes.getAllProductsURL;
const deleteProductURL = ProductRoutes.deleteProductURL;
const productDetailsURL = ProductRoutes.productDetailsURL;
const productUpdateURL = ProductRoutes.productUpdateURL;

@Injectable({
  providedIn: "root",
})
export class ProductService {

  private http = inject(HttpClient);

    //category service
  getAllCategories(pageNumber?:number,pageSize?:number) : Observable<any> {
    let endpoint = `${getAllCategoriesURL}`;
    if(pageNumber) {
      endpoint += `?pages=${pageNumber}&limit=${pageSize}`;
    }
    return this.http.get<ApiResponse>(endpoint);
  }

  createCategory(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(createCategoryURL, data);
  }

  getCategoryDetails(category_id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${categoryDetailsURL}/${category_id}`);
  }

  updateCategory(id:any,data: any): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(categoryUpdateURL +'/'+ id, data);
  }

  deleteCategory(id:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(categoryDeleteURL +'/'+ id);
  }

  //products

  getAllProducts(pageNumber?:number,pageSize?:number) : Observable<any> {
    let endpoint = `${getAllProductsURL}`;
    if(pageNumber) {
      endpoint += `?pages=${pageNumber}&limit=${pageSize}`;
    }
    return this.http.get<ApiResponse>(endpoint);
  }

  createProduct(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(createProductURL, data);
  }

  deleteProduct(id:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(deleteProductURL +'/'+ id);
  }

  getProductDetails(productId: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${productDetailsURL}/${productId}`);
  }

  updateProduct(id:any,data: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(productUpdateURL +'/'+ id, data);
  }

}
