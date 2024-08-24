import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { BranchRoutes } from "../routes/branch-routes";

const getAllBranchURL = BranchRoutes.getAllBranchURL;
const createBranchURL = BranchRoutes.createBranchURL;
const branchDetailsURL = BranchRoutes.branchDetailsURL;
const branchUpdateURL = BranchRoutes.branchUpdateURL;
const branchDeleteURL = BranchRoutes.branchDeleteURL;

@Injectable({
  providedIn: "root",
})
export class BranchService {

  private http = inject(HttpClient);

  getAllBranch(pageNumber?:number,pageSize?:number) : Observable<any> {
    let endpoint = `${getAllBranchURL}`;
    if(pageNumber) {
      endpoint += `?pages=${pageNumber}&limit=${pageSize}`;
    }
    return this.http.get<ApiResponse>(endpoint);
  }

  createBranch(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(createBranchURL, data);
  }

  getBranchDetails(branch_id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${branchDetailsURL}/${branch_id}`);
  }

  updateBranch(id:any,data: any): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(branchUpdateURL +'/'+ id, data);
  }

  deleteBranch(id:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(branchDeleteURL +'/'+ id);
  }

}
