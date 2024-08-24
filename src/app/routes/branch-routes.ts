import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const BranchRoutes = {

    getAllBranchURL : `${apiURL}/branches`,
    createBranchURL : `${apiURL}/branches`,
    branchDetailsURL : `${apiURL}/branches`,
    branchUpdateURL : `${apiURL}/branches`,
    branchDeleteURL : `${apiURL}/branches`,
}