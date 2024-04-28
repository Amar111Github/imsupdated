import React, {useEffect, useState} from 'react';
import "../component/suplierForm.css";
import { IoCloseOutline } from "react-icons/io5";

import { base_Url } from '../pages/api';
import axios from 'axios';
const TaxForm = ({ setFormToggle,allTax, editData, setEditData}) => {
    
    const [data, setData] = useState({
     
        taxName: "",
        taxPer: ""
    })
 useEffect(()=>{
    setData(editData)
 },[editData]);
 const addTax = async () => {

    if(editData){
        try {
     
          
            const response = await axios.patch(`http://localhost:8000/tax/update_tax/${editData._id}`, data);
            console.log(response);
            setFormToggle(false);
            setData({
     
                taxName: "",
                taxPer: ""
            });
            alert("successfully edited tax")
            allTax();
          
          } catch (error) {
            console.error('Error adding category:', error.response.data.message);
            alert(error.response.data.message)
  
          } 
    }else{
        try {
        
       
            const response = await axios.post("http://localhost:8000/tax/create_tax", data);
            console.log(response);
            
            setFormToggle(false);
           
            setData({
     
                taxName: "",
                taxPer: ""
            });
           
            allTax();
            alert("successfully added tax")
          
          } catch (error) {
            console.error('Error adding category:', error.response.data.message);
            alert(error.response.data.message)
  
          }
    }
    
  };

 const submitHandler = () => {
    
        
      
    if (
      data.taxName && data.taxPer
    ) {
        addTax();
      
     
    } else if(  data.taxName) {
     
        alert('Please enter the Tax name.');
      
    } else if(data.taxPer){
        alert('Please enter the tax percentage');
    }
    setData({
     
        taxName: "",
        taxPer: ""
    });
  setEditData("");
  setFormToggle(false)
}

  return (
    <div className='suplierform-container'>
        <div className='suplierform'>
            <div className='suplierform-heading'>
                <h4>Add  Tax</h4>
                <div className='suplierform-closing'>
                    <IoCloseOutline onClick={()=>{setEditData("") ;setFormToggle(false) }}/>
                </div>
            </div>
            <div className='suplierform-form'>
                <input type='text' placeholder='Tax Name' value={data.taxName} onChange={(e)=>{setData((prev)=>({...prev, taxName: e.target.value}))}}/>
                <input type='text' placeholder='Tax Per' value={data.taxPer} onChange={(e)=>{setData((prev)=>({...prev, taxPer: e.target.value}))}}/>
                <button onClick={submitHandler}>Add Tax</button>
            </div>
        </div>
      
    </div>
  )
}

export default TaxForm
