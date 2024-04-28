import React, { useState } from 'react';
import "./header.css";
import logo from "../images/logo.png";
import profile from "../images/employee.jpg";
import Profile from './Profile';

const Header = () => {
  const [profileToggle, setProfileToggle] = useState(false);
  

  return (
    <>
      <Profile profileToggle={profileToggle} />
  
      <div className="navbar-container">
    <div className='navbar'>
     <div className='logo'>
       <img src={logo} alt='kasper'/>
     </div>
     <div className="profile-icon" onClick={()=>setProfileToggle(!profileToggle)}>
       <img src={profile} alt="profile"/>
     </div>
    </div>
    </div>
    </>
  )
}

export default Header
