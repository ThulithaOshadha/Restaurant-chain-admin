import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { RoleRoutes } from "../routes/role-routes";

const getAllRolesURL = RoleRoutes.getAllRolesURL;
const createRoleURL = RoleRoutes.createRoleURL;
const roleDetailsURL = RoleRoutes.roleDetailsURL;
const roleUpdateURL = RoleRoutes.roleUpdateURL;
const roleDeleteURL = RoleRoutes.roleDeleteURL;

@Injectable({
  providedIn: "root",
})
export class RoleService {

  private http = inject(HttpClient);

  getAllRoles(pageNumber?:number,pageSize?:number) : Observable<any> {
    let endpoint = `${getAllRolesURL}`;
    if(pageNumber) {
      endpoint += `?pages=${pageNumber}&limit=${pageSize}`;
    }    
    return this.http.get<ApiResponse>(endpoint);
  }

  createRole(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(createRoleURL, data);
  }

  getRoleDetails(role_id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${roleDetailsURL}/${role_id}`);
  }

  updateRole(id:any,data: any): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(roleUpdateURL +'/'+ id, data);
  }

  deleteRole(id:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(roleDeleteURL +'/'+ id);
  }

}
