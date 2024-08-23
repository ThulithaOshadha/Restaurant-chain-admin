import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const RoleRoutes = {

    getAllRolesURL : `${apiURL}/roles/get-all-role`,
    createRoleURL : `${apiURL}/roles`,
    roleDetailsURL : `${apiURL}/roles`,
    roleUpdateURL : `${apiURL}/roles`,
    roleDeleteURL : `${apiURL}/roles`,
}