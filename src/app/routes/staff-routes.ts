import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const StaffRoutes = {

    getAllURL : `${apiURL}/user`,
    createURL : `${apiURL}/user`,
    detailsURL : `${apiURL}/user`,
    updateURL : `${apiURL}/user`,
    deleteURL : `${apiURL}/user`,
}