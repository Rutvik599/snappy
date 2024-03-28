import { Navigate, useNavigate } from "react-router-dom";
import { isLogin, toggleLoginStatus,getValue,setCust} from "../api/islogin";
import "../style/Homepage.css";
import { useEffect, useState } from "react";
import { validate } from "uuid";
import Header from "../Component/Header";

function Homepage(props) {
  let isLoggedin = isLogin;
  const navigate = useNavigate();
  const [name,setname] = useState("");
  const value = getValue();
 
  if(!value){
    return navigate("/login");
  }

  return (
    <Header name={props.name} address={props.address}/>
  );
}
export default Homepage;
