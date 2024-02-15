import { Navigate } from "react-router-dom";
import { isLogin } from "../api/islogin";

function Homepage(){
   let isLoggedin = isLogin;
   if(!isLoggedin){
       return <Navigate to={"/login"}/>
    }
    return(
        <div>Homepage</div>
    )
}
export default Homepage;