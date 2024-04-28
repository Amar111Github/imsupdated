import React from 'react';
import "./profile.css";
import profile from "../images/employee.jpg";
import { IoIosLogOut } from "react-icons/io";
import { Link } from 'react-router-dom';

const Profile = ({profileToggle}) => {
  return (
    <div className={profileToggle?'profile': "profile-show"}>
    <div className='profile-inner-container'>

    <p className='editer'>Edit</p>
      <div className='profile-image'>
        <img src={profile} alt='profile'/>
      </div>
      <div className='profile-details-container'>

      
      <div className='profile-details'>
        <h6>Name: </h6> <p> Abhay Pratap Singh</p>
      </div>
      <div className='profile-details'>
        <h6>Email: </h6> <p> abhay@gmail.com</p>
      </div>
      <div className='profile-details'>
        <h6>Mobile No.: </h6> <p> 9517539526</p>
      </div>
      <div className='profile-details-logout'>
        <Link to="/"> <IoIosLogOut/>Logout</Link>
       
      </div>
      </div>
      </div>
    </div>
  )
}

export default Profile
