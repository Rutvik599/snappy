import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import Product from "F:/Practical/snappy/src/Component/Product.jsx";
import '@radix-ui/themes/styles.css';
import Searchcard from "./Component/Searchcard";
import Otherpage from "./Pages/Otherpage";
import Chatbot from "./Pages/Chatbot";
import Teamsnappy from "./Pages/Teamsnappy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Homepage/>}>
        <Route path="category/:categoryname" element={<Product />} />
        <Route path="searchResult/:searchParam" element={<Searchcard />} />
        <Route path="/teamsnappy" element={<Teamsnappy/>} />
        </Route>
        <Route path="/login" element={<Login />} />
       <Route path="/feature/*" element={<Otherpage/>} />
       <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
