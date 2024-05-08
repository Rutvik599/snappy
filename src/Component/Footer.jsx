import React  from 'react'
import '../style/Footer.css';
import logo from "../Products-Images/logo.png";
import { ArrowDownLeft, Bird, CircleHelp, Copyright, Github, Headset, Mail, UserRoundCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <>
    <div className="line"></div>
    <div className='mainfooter'>
      <img src={logo} alt="" className="headerlogo" onClick={()=>window.location.reload()}/>
      <div className="links">
      <a><UserRoundCheck size={20}/><span className="text">AboutUs</span></a>
<a><Headset size={20}/><span className="text">ContactUs</span></a>
<a className='faq'><CircleHelp size={20}/><span className="text">FAQ's</span></a>
<a><ArrowDownLeft size={20}/><span className="text">Feedback</span></a>
<a href="https://github.com/Rutvik599/snappy" target='_blank'><Github size={20} /><span className="text">Sourcode</span></a>
<a><Mail size={20}/><span className="text">Gmail</span></a>
<Link to='/teamsnappy'><Bird size={20}/><span className="text">Team Snappy</span></Link>
      </div>
    </div>
<div className="line"></div>
    <div className="copyright">
      <h2>This project is created by Team Snappy. Copyright <Copyright size={20} style={{ margin: '0px 5px 0px 5px' }}/> 2024 Snappy Contributors. All rights reserved  2024 Snappy Contributers.</h2>
      </div>
    </>
  )
}
