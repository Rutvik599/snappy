import React from 'react'
import '../style/Footer.css';
import logo from "../Products-Images/logo.png";
import { ArrowDownLeft, Bird, CircleHelp, Copyright, Github, Headset, Mail, UserRoundCheck } from 'lucide-react';
export default function Footer() {
  return (
    <>
    <div className="line"><div></div></div>
    <div className='mainfooter'>
      <img src={logo} alt="" className="headerlogo" onClick={()=>window.location.reload()}/>
      <div className="links">
      <button><UserRoundCheck size={20}/><span className="text">AboutUs</span></button>
<button><Headset size={20}/><span className="text">ContactUs</span></button>
<button className='faq'><CircleHelp size={20}/><span className="text">FAQ's</span></button>
<button><ArrowDownLeft size={20}/><span className="text">Feedback</span></button>
<button><Github size={20}/><span className="text">Sourcode</span></button>
<button><Mail size={20}/><span className="text">Gmail</span></button>
<button><Bird size={20}/><span className="text">Team Snappy</span></button>

      </div>
    </div>
    <div className="copyright">
      <h2>This project is created by Team Snappy. Copyright <Copyright size={20} style={{ margin: '0px 5px 0px 5px' }}/> 2024 Snappy Contributors. All rights reserved  2024 Snappy Contributers</h2>
      </div>
    </>
  )
}
