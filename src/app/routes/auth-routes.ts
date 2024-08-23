import { environment } from "src/environments/environment";

const apiURL = environment.apiURL;

export const AuthRoutes = {

    loginApi:`${apiURL}/auth/email/login`,
    refreshTokenApi:`${apiURL}/auth/refresh`,

}