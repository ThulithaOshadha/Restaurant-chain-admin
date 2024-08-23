import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const RolePermissionRoutes = {

    getAllPermissionsURL : `${apiURL}/permissions/get-all-permissions`,
    assignRolePermissionURL : `${apiURL}/admin/role-permission`,
    getRolePermissionURL : `${apiURL}/role-permission`,
}