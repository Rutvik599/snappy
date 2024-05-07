let isLogin = false;
let custId ;
let cust



const toggleLoginStatus = ()=>{
  isLogin = !isLogin;
}

const setCust =(value)=>{
  cust = value;
}
const getValue = () =>{
  return [cust];
}

export { isLogin, toggleLoginStatus,getValue,setCust ,cust};