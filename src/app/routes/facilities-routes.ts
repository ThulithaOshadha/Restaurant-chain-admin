import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const FacilitiesRoutes = {

    getAllURL : `${apiURL}/facilities`,
    createURL : `${apiURL}/facilities`,
    detailsURL : `${apiURL}/facilities`,
    updateURL : `${apiURL}/facilities`,
    deleteURL : `${apiURL}/facilities`,
}