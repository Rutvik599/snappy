import { useNavigate, Outlet } from "react-router-dom";
import { getValue } from "../api/islogin";
import "../style/Homepage.css";
import { useEffect} from "react";
import Header from "../Component/Header";
import Headerbottom from "../Component/Headerbottom";
import Slider from "../Component/Slider";
import Footer from "../Component/Footer";


function Homepage() {
  const navigate = useNavigate();
  const value = getValue();

  
  useEffect(() => {
    if (!value) {
      navigate("/login");
    }
  }, [navigate, value]);

  useEffect(() => {
    // Redirect to '/category/allcategories' if the current URL is '/'
    if (window.location.pathname === '/') {
      navigate('/category/allcategories');
    }
  }, [navigate]);

  if(!<Outlet/>){
    return navigate("/category/allcategories");
  }
  return (
    <>
      <Header  />
      <Headerbottom class="All Categories" />
      <Slider/>
      <Outlet/>
      <Footer/>
    </>
  );
}
export default Homepage;
