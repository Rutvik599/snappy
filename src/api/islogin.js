let isLogin = false;
let custId = "";
let cust



const toggleLoginStatus = ()=>{
  isLogin = !isLogin;
}

const setCust =(value)=>{
  cust = value;
}
const getValue = () =>{
  return [custId,cust];
}

export { isLogin, toggleLoginStatus,getValue,setCust};
