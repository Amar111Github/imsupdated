

import React from 'react';
import { NavLink } from 'react-router-dom';
import {BiSolidDashboard} from "react-icons/bi";
import { BiPurchaseTag } from "react-icons/bi";
import { TbFileInvoice } from "react-icons/tb";
import { LiaProductHunt } from "react-icons/lia";
import { TbUsers } from "react-icons/tb";
import { LiaTruckLoadingSolid } from "react-icons/lia";
import { TbShoppingBagSearch } from "react-icons/tb";
import { TbPackages } from "react-icons/tb";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { AiOutlineFieldNumber } from "react-icons/ai";

import './sidebar.css'


export const Sidebar = () => {
    

  


    return (
        <div className="sideboard">
        <NavLink   to="/home" activeclassname="active" className="navlinks" >
          <BiSolidDashboard className="sideIcons" /> <p>Dashboard</p>
        </NavLink>
        <NavLink  to="/purchase" activeclassname="active" className="navlinks">
          <BiPurchaseTag className="sideIcons" /> <p>Purchase</p>
        </NavLink>
        <NavLink to="/invoice" activeclassname="active" className="navlinks">
          <TbFileInvoice className="sideIcons" /> <p>Invoice</p>
        </NavLink>
        <NavLink to="/product" activeclassname="active" className="navlinks">
          <LiaProductHunt className="sideIcons" /> <p>Product</p>
        </NavLink>
        <NavLink to="/customer" activeclassname="active" className="navlinks">
          <TbUsers className="sideIcons" /> <p>Customer</p>
        </NavLink>
        <NavLink to="/supplier" activeclassname="active" className="navlinks">
          <LiaTruckLoadingSolid className="sideIcons" /> <p>Supplier</p>
        </NavLink>
        <NavLink to="/category" activeclassname="active" className="navlinks">
          <TbShoppingBagSearch className="sideIcons" /> <p>Category</p>
        </NavLink>
     
        <NavLink to="/unit" activeclassname="active" className="navlinks">
          <TbPackages className="sideIcons" /> <p>Units</p>
        </NavLink>
        <NavLink to="/taxes" activeclassname="active" className="navlinks">
          <HiOutlineReceiptTax className="sideIcons" /> <p>Tax</p>
        </NavLink>
        <NavLink to="/hsn" activeclassname="active" className="navlinks">
          <AiOutlineFieldNumber className="sideIcons" /> <p>HSN/SAC</p>
        </NavLink>
        </div>
    )
}