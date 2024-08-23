import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const RoleRoutes = {

    getAllRolesURL : `${apiURL}/admin/roles/get-all-role`,
    createRoleURL : `${apiURL}/admin/roles`,
    roleDetailsURL : `${apiURL}/admin/roles`,
    roleUpdateURL : `${apiURL}/admin/roles`,
    roleDeleteURL : `${apiURL}/admin/roles`,
}