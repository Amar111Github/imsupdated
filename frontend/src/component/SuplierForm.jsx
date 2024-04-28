import React, {useEffect, useState} from 'react';
import "./suplierForm.css";
import { IoCloseOutline } from "react-icons/io5";

import { base_Url } from '../pages/api';
import axios from 'axios';


const SuplierForm = ({ data1, setFormToggle,allSupplier, editData, setEditData}) => {


    const [data, setData] = useState({
      suplierName: "",
      suplierContact: "",
      suplierEmail: "",
      suplierGST: "",
      suplierAddress: "",
    })
 useEffect(()=>{
    setData(editData)
 },[editData])
 console.log(editData.suplierEmail);
 console.log(data1)
    const addSupplier = async () => {

        if(editData){
            try {
         
              let copyMail = null;
            copyMail =      data1.filter((val)=>{
                 return data.suplierEmail === val.suplierEmail
                });
         
                
                if(copyMail.length>0 && copyMail[0]._id!==editData._id){
                  alert("mail already exist");
                  return;
                }
                const response = await axios.patch(`http://localhost:8000/supplier/update_supplire/${editData._id}`, data);
                console.log(response);
                setFormToggle(false);
                setData({
                  suplierName: "",
                  suplierContact: "",
                  suplierEmail: "",
                  suplierGST: "",
                  suplierAddress: "",
                });
                alert("successfully edited suplier")
                allSupplier();
              
              } catch (error) {
                console.error('Error adding supplier:', error);
      
              } 
        }else{
            try {
            
              let copyMail = null;
                
                copyMail =      data1.filter((val)=>{
                  return data.suplierEmail === val.suplierEmail
                    });
                    if(copyMail.length>0){
                      alert("mail already exist");
                      return;
                    }
                const response = await axios.post("http://localhost:8000/supplier/create_supplier", data);
                console.log(response);
                
                setFormToggle(false);
               
                setData({
                  suplierName: "",
                  suplierContact: "",
                  suplierEmail: "",
                  suplierGST: "",
                  suplierAddress: "",
                });
               
                allSupplier();
                alert("successfully added suplier")
              
              } catch (error) {
                console.error('Error adding supplier:', error);
      
              }
        }
        
      };

   
    const submitHandler = () => {
    
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.suplierEmail);
      
      
        const isValidPhoneNumber = /^\d{10}$/.test(data.suplierContact);
      
        if (
          data.suplierName &&
          isValidPhoneNumber &&
          isValidEmail &&
          data.suplierAddress
        ) {
          addSupplier();
          
         
        } else {
          if (!data.suplierName) {
            alert('Please enter the supplier name.');
          } else if (!isValidPhoneNumber) {
            alert('Please enter a valid 10-digit phone number.');
          } else if (!isValidEmail) {
            alert('Please enter a valid email address.');
          } else if (!data.suplierAddress) {
            alert('Please enter the supplier address.');
          }
        } 
        setData({
          suplierName: "",
          suplierContact: "",
          suplierEmail: "",
          suplierGST: "",
          suplierAddress: "",
        });
        setEditData(" ")
    }
   
       
   
  
  return (
    <div className='suplierform-container'>
        <div className='suplierform'>
            <div className='suplierform-heading'>
                <h4>Add  Supplier</h4>
                <div className='suplierform-closing'>
                    <IoCloseOutline onClick={()=>{setFormToggle(false); setEditData("")}}/>
                </div>
            </div>
            <div className='suplierform-form'>
                <input type='text' placeholder='Supplier Name' value={data.suplierName} onChange={(e)=>{setData((prev)=>({...prev, suplierName: e.target.value}))}}/>
                <input type='number' placeholder='Mobile No.'  value={data.suplierContact} onChange={(e)=>{setData((prev)=>({...prev, suplierContact: e.target.value}))}}/>
                <input type='text' placeholder='GST'  value={data.suplierGST} onChange={(e)=>{setData((prev)=>({...prev, suplierGST: e.target.value}))}}/>
                <input type='email' placeholder='Email' value={data.suplierEmail } onChange={(e) => setData((prev) => ({ ...prev, suplierEmail: e.target.value }))} />
                <input type='text' placeholder='Address'  value={data.suplierAddress} onChange={(e)=>{setData((prev)=>({...prev, suplierAddress: e.target.value}))}}/>
                <button onClick={submitHandler}>Add Supplier</button>
            </div>
        </div>
      
    </div>
  )
}

export default SuplierForm
