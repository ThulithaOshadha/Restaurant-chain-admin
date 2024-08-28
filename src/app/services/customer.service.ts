import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { CustomerRoutes } from "../routes/customer-routes";

const getAllURL = CustomerRoutes.getAllURL;
const createURL = CustomerRoutes.createURL;
const detailsURL = CustomerRoutes.detailsURL;
const updateURL = CustomerRoutes.updateURL;
const deleteURL = CustomerRoutes.deleteURL;

@Injectable({
  providedIn: "root",
})
export class CustomerManageService {

  private http = inject(HttpClient);

  getAllURL(pageNumber?:number,pageSize?:number) : Observable<any> {
    let endpoint = `${getAllURL}`;
    if(pageNumber) {
      endpoint += `?pages=${pageNumber}&limit=${pageSize}`;
    }
    return this.http.get<ApiResponse>(endpoint);
  }

  create(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(createURL, data);
  }

  getDetails(role_id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${detailsURL}/${role_id}`);
  }

  update(id:any,data: any): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(updateURL +'/'+ id, data);
  }

  delete(id:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(deleteURL +'/'+ id);
  }

}
