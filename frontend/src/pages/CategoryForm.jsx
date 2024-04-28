import React, {useEffect, useState} from 'react';
import "../component/suplierForm.css";
import { IoCloseOutline } from "react-icons/io5";

import { base_Url } from '../pages/api';
import axios from 'axios';


const CategoryForm = ({ setFormToggle,allCategory, editData, setEditData}) => {


    const [data, setData] = useState({
     
        category: "",
        
    })
 useEffect(()=>{
    setData(editData)
 },[editData])
 
    const addCategory = async () => {

        if(editData){
            try {
         
              
                const response = await axios.patch(`http://localhost:8000/category/update_catdelete_categoryegory/${editData._id}`, data);
                console.log(response);
                setFormToggle(false);
                setData({
                    category: "",
              
                });
                alert("successfully edited Category")
                allCategory();
              
              } catch (error) {
                console.error('Error adding category:', error.response.data.message);
                alert(error.response.data.message)
      
              } 
        }else{
            try {
            
           
                const response = await axios.post("http://localhost:8000/category/create_category", data);
                console.log(response);
                
                setFormToggle(false);
               
                setData({
                    category: "",
                  
                });
               
                allCategory();
                alert("successfully added category")
              
              } catch (error) {
                console.error('Error adding category:', error.response.data.message);
                alert(error.response.data.message)
      
              }
        }
        
      };

   
    const submitHandler = () => {
    
        
      
        if (
          data.category 
        ) {
            addCategory();
          
         
        } else {
            console.log(data.category)
          if (!data.category) {
            alert('Please enter the category name.');
          } 
        } 
        setData({
          category: "",
      });
      setEditData("");
      setFormToggle(false)
    }
   
       
   
  
  return (
    <div className='suplierform-container'>
        <div className='suplierform'>
            <div className='suplierform-heading'>
                <h4>Add  Category</h4>
                <div className='suplierform-closing'>
                    <IoCloseOutline onClick={()=>{setEditData("") ;setFormToggle(false) }}/>
                </div>
            </div>
            <div className='suplierform-form'>
                <input type='text' placeholder='Category Name' value={data.category} onChange={(e)=>{setData((prev)=>({...prev, category: e.target.value}))}}/>
               
                <button onClick={submitHandler}>Add Category</button>
            </div>
        </div>
      
    </div>
  )
}

export default CategoryForm

