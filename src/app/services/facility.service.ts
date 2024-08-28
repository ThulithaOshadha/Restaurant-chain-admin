import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { FacilitiesRoutes } from "../routes/facilities-routes";

const getAllURL = FacilitiesRoutes.getAllURL;
const createURL = FacilitiesRoutes.createURL;
const detailsURL = FacilitiesRoutes.detailsURL;
const updateURL = FacilitiesRoutes.updateURL;
const deleteURL = FacilitiesRoutes.deleteURL;

@Injectable({
  providedIn: "root",
})
export class FacilitiesService {

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
    return this.http.put<ApiResponse>(updateURL +'/'+ id, data);
  }

  delete(id:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(deleteURL +'/'+ id);
  }

}
