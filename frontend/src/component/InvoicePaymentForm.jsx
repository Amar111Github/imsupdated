import React, {useEffect, useState} from 'react';
import "./suplierForm.css";
import { IoCloseOutline } from "react-icons/io5";

import { base_Url } from '../pages/api';
import axios from 'axios';

const InvoicePaymentForm = ({setViewPayment,allPurchase,viewPurchase}) => {
 
    const [data, setData] = useState({
        id: viewPurchase.id,
        amount: "",
        paymentMode : "",
        paymentDue: "",
      });
      const addProduct = async () => {
            try {
           
              
                const response = await axios.post("http://localhost:8000/invoice/addpayment", data);
                console.log(response);
                
                setViewPayment(false);
               
                setData({
                    id: viewPurchase.id,
                    amount: "",
                    paymentMode : "",
                    paymentDue: "",
                  });
           
                  allPurchase();
                alert("successfully added Payment")
              
              } catch (error) {
                // alert(error.response.data.message);
      
              }
        
        
      };
      function isDateGreaterThanCurrent(date) {

        const currentDate = new Date();
        

        const selectedDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
   
        if(parseInt(data.amount)===viewPurchase.dueAmount) return true;
        return selectedDate >= currentDate;
      }
  
      const submitHandler = () => {

       
       if(+data.amount>viewPurchase.dueAmount){
        alert("Amount is more than Due Amount");
        return;
       }else if(!isDateGreaterThanCurrent(data.paymentDue)){
        alert("please Select future date");
        return;
       }
          if (
            data.amount && 
            
            data.paymentMode 
     
          ) {
            addProduct();
          } else {
            if (!data.amount) {
              alert('Please Enter Amount');
            } else if (!data.paymentMode) {
              alert('Please Enter Payment Mode');
            } 
          } 
           
          setData({
            id: viewPurchase.id,
            amount: "",
            paymentMode : "",
            paymentDue: "",
          });
 
      }
  return (
    <div className='suplierform-container'>
        <div className='suplierform'>
            <div className='suplierform-heading'>
                <h4>Add  Payment</h4>
                <div className='suplierform-closing'>
                    <IoCloseOutline onClick={()=>{setViewPayment(false)}}/>
                </div>
            </div>
            <div className='suplierform-form'>
              <label htmlFor='amount' >Amount</label>
                <input type='number' placeholder='Amount' id='amount' value={data.amount} onChange={(e)=>{setData({...data,amount:e.target.value})}}/>
                
                <label htmlFor='payment' >Payment Mode</label>
                <input type='text' placeholder='Payment Mode' id='payment' value={data.paymentMode } onChange={(e) => setData((prev) => ({ ...prev, paymentMode: e.target.value }))} />
                <label htmlFor='dueDate'>Next Due Date</label>
                <input type='date' placeholder='Due Date' id='dueDate' value={data.paymentDue } onChange={(e) => setData((prev) => ({ ...prev, paymentDue: e.target.value }))} />

                <button onClick={submitHandler}>Add Payment</button>
            </div>
        </div>
      
    </div>
  )
}

export default InvoicePaymentForm

