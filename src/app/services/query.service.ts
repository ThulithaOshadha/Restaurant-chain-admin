import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { QueryRoutes } from "../routes/query-routes";

const getAllURL = QueryRoutes.getAllURL;
const createURL = QueryRoutes.createURL;
const detailsURL = QueryRoutes.detailsURL;
const updateURL = QueryRoutes.updateURL;
const deleteURL = QueryRoutes.deleteURL;

@Injectable({
  providedIn: "root",
})
export class QueryService {

  private http = inject(HttpClient);

  getAll(pageNumber?:number,pageSize?:number) : Observable<any> {
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
    console.log('data =========== ',data);
    
    return this.http.put<ApiResponse>(updateURL +'/'+ id, data);
  }

  delete(id:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(deleteURL +'/'+ id);
  }

}
