import React, {useEffect, useState} from 'react';
import "./suplierForm.css";
import { IoCloseOutline } from "react-icons/io5";

import { base_Url } from '../pages/api';
import axios from 'axios';

const ProductForm = ({setFormToggle,allProduct, editData, setEditData}) => {
    const [supplierDetails, setSupplierDetails] =useState("");
    const [categoryDetails, setCategoryDetails] = useState("")
    const [tax, setTax] =useState(null);
    const [hsnDetails, setHsnDetails] = useState(null)
    const [data, setData] = useState({
      product_Name: "",
      suplire_Email : "",
      unit_Name: "",
      category_name: "",
      taxName: "",
      taxPer: "",
      hsn:""
    });
    const allTax = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tax/find_tax");
        setTax(response.data.product);
      } catch (error) {
        console.log(error);
      }
    };
    
    const hsnDetailsHandler = async()=>{
      try{
        const response = await axios.get("http://localhost:8000/hsn/findall_hsn", data);
     setHsnDetails(response.data.data)
    
      }catch(error){
        console.log(error)
      }
    
     
     
    }
    useEffect(()=>{
      allTax();
      hsnDetailsHandler();
    },[])
  const supplierDetailsHandler = async()=>{
   
    try{
      const response = await axios.get("http://localhost:8000/product/category_Supplire");
      setCategoryDetails(response.data.category);
      setSupplierDetails(response.data.suppliers);
    }catch(error){
        console.log(error)
    }
  }
 useEffect(()=>{
    setData(editData);
    supplierDetailsHandler();
 },[editData])
console.log(editData, supplierDetails)
console.log(editData, categoryDetails)

    const addProduct = async () => {

        if(editData){
            try {
         
                const response = await axios.patch(`http://localhost:8000/product/update_product/${editData._id}`, data);
                console.log(response);
               
                setData({
                  product_Name: "",
                  suplire_Email : "",
                  unit_Name: "",
                  category_name: "",
                  taxName: "",
                  taxPer: "",
                  hsn:""
                });
                setFormToggle(false);
                console.log(data)
                alert("successfully edited product")
                allProduct();
              
              } catch (error) {
                alert(error.response.data.message);
              } 
        }else{
            try {
            
              
                const response = await axios.post("http://localhost:8000/product/add", data);
                console.log(response);
                
                setFormToggle(false);
               
                setData({
                  product_Name: "",
                  suplire_Email : "",
                  unit_Name: "",
                  category_name: "",
                  taxName: "",
                  taxPer: "",
                  hsn:""
                });
               console.log(data)
                allProduct();
                alert("successfully added product")
              
              } catch (error) {
                alert(error.response.data.message);
      
              }
        }
        
      };
      const taxHandler =(val)=>{
        if(val){
          const detail = tax.filter((item)=>{
            return val=== item.taxName
          });
  
   
         setData((prev)=>({...prev, taxPer:detail[0].taxPer}))
        }
         
         }
   
    const submitHandler = () => {
    
       
      console.log(data)
        if (
          data.product_Name &&
          data.suplire_Email &&
          data.unit_Name &&
          data.category_name
        ) {
          addProduct();
          
         
        } else {
          if (!data.product_Name) {
            alert('Please enter the product name.');
          } else if (!data.
            suplire_Email) {
            alert('Please enter the supplier Email.');
          } else if (!data.unit_Name) {
            alert('Please enter a unit Name');
          } else if (!data.category_name) {
            alert('Please enter the category Name');
          }
        } 
         
        setData({
          product_Name: "",
          suplire_Email : "",
          unit_Name: "",
          category_name: "",
          taxName: "",
          taxPer: "",
          hsn:""
      });
      setEditData("")
    }
   
       
   

  return (
    <div className='suplierform-container'>
        <div className='suplierform'>
            <div className='suplierform-heading'>
                <h4>Add  Product</h4>
                <div className='suplierform-closing'>
                    <IoCloseOutline onClick={()=>{setFormToggle(false); setEditData("")}}/>
                </div>
            </div>
            <div className='suplierform-form'>
                <input type='text' placeholder='Product Name' value={data.product_Name} onChange={(e)=>{setData((prev)=>({...prev, product_Name: e.target.value}))}}/>
                
                <select  value={data.
suplire_Email} onChange={(e)=>{setData((prev)=>({...prev, 
  suplire_Email:e.target.value}))}}>
                <option value="" disabled>Select Supplier</option>
                  {supplierDetails && supplierDetails.map((val, i)=>{
                    return(<option key={val._id} value={val}>{val}</option>)
                   
                  })}
                </select>
                <input type='email' placeholder='Unit Name' value={data.unit_Name } onChange={(e) => setData((prev) => ({ ...prev, unit_Name: e.target.value }))} />
                 
                <select value={data.category_name}  onChange={(e)=>{setData((prev)=>({...prev, category_name:e.target.value}))}}>
                <option value="" disabled>Select Category</option>
                  {categoryDetails && categoryDetails.map((val, i)=>{
                    return(<option key={val._id} value={val}>{val}</option>)
                   
                  })}
                  </select>
           
            <select
  id="tax"
  value={data.taxName || ''}  
  onChange={(e) => setData((prev) => ({ ...prev, taxName: e.target.value }))
  } onBlur={(e)=>taxHandler(e.target.value)}
>
  <option value="" disabled>
    Tax
  </option>
  {tax &&
    tax.map((val, i) => {
      return (
        <option key={i} value={val.taxName}>
          {val.taxName}
        </option>
      );
    })}
</select>
<select id='hsnName' value={data.hsn} onChange={(e)=>setData((prev)=>({...prev, hsn:e.target.value}))}>
              <option value="" disabled>Hsn Name</option>
              {hsnDetails && hsnDetails.map((val,i)=>{
                return(<option key={i} value={val.hsn}>{val.hsn}</option>)
               
              })}
            </select>
                <button onClick={submitHandler}>Add Product</button>
            </div>
        </div>
      
    </div>
  )
}

export default ProductForm
