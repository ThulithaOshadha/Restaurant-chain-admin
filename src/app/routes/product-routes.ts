import { environment } from "src/environments/environment";


const apiURL = environment.apiURL;
    

export const ProductRoutes = {

    //categories routes
    getAllCategoriesURL : `${apiURL}/admin/category/find-all-category`,
    createCategoryURL : `${apiURL}/admin/category`,
    categoryDetailsURL : `${apiURL}/admin/category/find-one-category`,
    categoryUpdateURL : `${apiURL}/admin/category`,
    categoryDeleteURL : `${apiURL}/admin/category`,

    // product
    createProductURL : `${apiURL}/product`,
    getAllProductsURL : `${apiURL}product`,
    deleteProductURL : `${apiURL}/product`,
    productDetailsURL : `${apiURL}/product`,
    productUpdateURL : `${apiURL}/product`
}