import { Navigate } from "react-router-dom";
import { isLogin } from "../api/islogin";
import 'F:/Practical/snappy/src/Cssfiles/login.css';
function Login() {
  let isLoggedin = isLogin;
  let isformopen = true;
  if (isLoggedin) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
    <div>Welcome to loginpage</div>
    </>
  );
}

export default Login;
