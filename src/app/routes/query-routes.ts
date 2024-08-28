import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const QueryRoutes = {

    getAllURL : `${apiURL}/queries`,
    createURL : `${apiURL}/queries`,
    detailsURL : `${apiURL}/queries`,
    updateURL : `${apiURL}/queries`,
    deleteURL : `${apiURL}/queries`,
}