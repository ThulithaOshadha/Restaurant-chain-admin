import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const CustomerRoutes = {

    getAllURL : `${apiURL}/user/customer/find-all`,
    createURL : `${apiURL}/user`,
    detailsURL : `${apiURL}/user`,
    updateURL : `${apiURL}/user`,
    deleteURL : `${apiURL}/user`,
}