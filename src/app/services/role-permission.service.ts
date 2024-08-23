import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { RoleRoutes } from "../routes/role-routes";
import { ApiResponse } from "../models/api-response.model";
import { RolePermissionRoutes } from "../routes/role-permission-routes";

const getAllPermissionsURL = RolePermissionRoutes.getAllPermissionsURL;
const createRoleURL = RoleRoutes.createRoleURL;
const assignRolePermissionURL = RolePermissionRoutes.assignRolePermissionURL;
const getRolePermissionURL = RolePermissionRoutes.getRolePermissionURL;

@Injectable({
  providedIn: "root",
})
export class RolePermissionService {

  private http = inject(HttpClient);

  getAllPermissions(pageNumber?:number,pageSize?:number) : Observable<any> {
    let endpoint = `${getAllPermissionsURL}`;
    if(pageNumber) {
      endpoint += `?pages=${pageNumber}&limit=${pageSize}`;
    }
    return this.http.get<ApiResponse>(endpoint);
  }

  assignRolePermission(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(assignRolePermissionURL, data);
  }

  getRolePermissionDetails(role_id: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${getRolePermissionURL}?roleId=${role_id}`);
  }
  // createRole(data: any): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(createRoleURL, data);
  // }

  // getRoleDetails(file_id: any): Observable<ApiResponse> {
  //   return this.http.get<ApiResponse>(`${roleDetailsURL}/${file_id}`);
  // }

  // updateRole(id:any,data: any): Observable<ApiResponse> {
  //   return this.http.patch<ApiResponse>(roleUpdateURL +'/'+ id, data);
  // }

  // deleteRole(id:any): Observable<ApiResponse> {
  //   return this.http.delete<ApiResponse>(roleDeleteURL +'/'+ id);
  // }

}
