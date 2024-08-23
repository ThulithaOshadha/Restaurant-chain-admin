import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const UtilRoutes = {

    //file upload
    fileUploadURL : `${apiURL}/v1/files/upload`,
    fileUploadMultipleURL : `${apiURL}/v1/files/uploadMultiple`,
}