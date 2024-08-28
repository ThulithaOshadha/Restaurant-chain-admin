import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { StaffRoutes } from "../routes/staff-routes";

const getAllURL = StaffRoutes.getAllURL;
const createURL = StaffRoutes.createURL;
const detailsURL = StaffRoutes.detailsURL;
const updateURL = StaffRoutes.updateURL;
const deleteURL = StaffRoutes.deleteURL;

@Injectable({
  providedIn: "root",
})
export class StaffManageService {

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
