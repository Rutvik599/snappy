import React from "react";
import Header from "../Component/Header";
import Chatbot from "./Chatbot";
import { Navigate, Route, Routes } from "react-router-dom";
import Cart from "./Cart";
import ShowOrder from "../Component/ShowOrder";

export default function Otherpage() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="chatbot/:chatid" element={<Chatbot />} />
        <Route path="cart/:cartid" element={<Cart />} />
        <Route path="myorders/:userId" element={<ShowOrder />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
