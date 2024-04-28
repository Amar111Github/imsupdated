
// components/CustomerForm.js
import React, { useEffect, useState } from 'react';
import "./suplierForm.css";
import { IoCloseOutline } from "react-icons/io5";
import { base_Url } from '../pages/api';
import axios from 'axios';

const CustomerForm = ({ setFormToggle, allClient, editData, setEditData }) => {
    console.log(editData)
  const [image, setImage] = useState("");
    const [data, setData] = useState({
        customer_image: "",
        customer_name: "",
        customer_contact_no: "",
        customer_email: "",
        customer_gst: "",
        customer_address: "",
    });

    useEffect(() => {
        setData(editData);
    }, [editData]);

    const addCustomer = async () => {
        try {
            const formData = new FormData();
            formData.append('customer_name', data.customer_name);
            formData.append('customer_contact_no', data.customer_contact_no);
            formData.append('customer_email', data.customer_email);
            formData.append('customer_gst', data.customer_gst);
            formData.append('customer_address', data.customer_address);
            formData.append('image', image); // Append the image directly
            console.log(image)
            const response = await axios.post("http://localhost:8000/client/add_customer", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log(response);
            setFormToggle(false);
            setData({
                customer_image: "",
                customer_name: "",
                customer_contact_no: "",
                customer_gst: "",
                customer_email: "",
                customer_address: "",
            });
            setImage(""); // Clear the image state
            allClient();
            alert("Successfully added customer");
        } catch (error) {
            console.error('Error adding customer:', error);
            alert(error.response.data.message);
        }
    };
    const updateCustomer = async (id)=>{
        try {
            const formData = new FormData();
            formData.append('customer_name', data.customer_name);
            formData.append('customer_contact_no', data.customer_contact_no);
            formData.append('customer_email', data.customer_email);
            formData.append('customer_gst', data.customer_gst);
            formData.append('customer_address', data.customer_address);
            formData.append('image', image); // Append the image directly
          
            const response = await axios.put(`http://localhost:8000/client/updateCustomer/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log(response);
            setFormToggle(false);
            setData({
                customer_image: "",
                customer_name: "",
                customer_contact_no: "",
                customer_gst: "",
                customer_email: "",
                customer_address: "",
            });
            setImage(""); // Clear the image state
            allClient();
            alert("Successfully added customer");
        } catch (error) {
            console.error('Error adding customer:', error);
            alert(error.response.data.message);
        }
    }
    const submitHandler = (e) => {
        e.preventDefault();
        if(editData){
            updateCustomer(editData._id);
        }else{
            addCustomer();
        }

        // ... (your validation code)

     
        setData({
            customer_image: "",
            customer_name: "",
            customer_contact_no: "",
            customer_email: "",
            customer_gst: "",
            customer_address: "",
        });
        setEditData("");
    };

    return (
        <div className='suplierform-container'>
        <div className='suplierform-container'>
        <div className='suplierform'>
            <div className='suplierform-heading'>
                <h4>Add  Customer</h4>
                <div className='suplierform-closing'>
                    <IoCloseOutline onClick={()=>{setFormToggle(false); setEditData("")}}/>
                </div>
            </div>
            <div className='suplierform-form'>
                <input type='text' placeholder='Customer Name' value={data.customer_name} onChange={(e)=>{setData((prev)=>({...prev, customer_name: e.target.value}))}}/>
                <input type='number' placeholder='Mobile No.'  value={data.customer_contact_no} onChange={(e)=>{setData((prev)=>({...prev, customer_contact_no: e.target.value}))}}/>
                <input type='email' placeholder='Email' value={data.customer_email } onChange={(e) => setData((prev) => ({ ...prev, customer_email: e.target.value }))} />
                <input type='text' placeholder='Gst No' value={data.customer_gst } onChange={(e) => setData((prev) => ({ ...prev, customer_gst: e.target.value }))} />
                <input type='text' placeholder='Address'  value={data.customer_address} onChange={(e)=>{setData((prev)=>({...prev, customer_address: e.target.value}))}}/>
                <input name="file" type='file' accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
                <button onClick={submitHandler}>Add Customer</button>
            </div>
        </div>
      
    </div>
        </div>
    );
};

export default CustomerForm;
