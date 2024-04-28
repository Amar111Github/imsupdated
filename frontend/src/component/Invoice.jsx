import React, { useState,useEffect } from 'react';
import html2canvas from 'html2canvas';
import { RiDeleteBinLine } from "react-icons/ri";
import jsPDF from 'jspdf';
import axios from "axios"
import { SlPrinter } from "react-icons/sl";
import { IoCloseOutline } from "react-icons/io5";
// import './Invoice.css';
import companyLogo from "../images/logo.png";
import { base_Url } from '../pages/api';

const Invoice = ({viewPurchase, setViewToggle}) => {
  console.log(viewPurchase.payments)
  const [orginalCopy, setOriginalCopy] = useState(false);
  const [editData, setEditData] = useState(viewPurchase);
  const [data, setData] = useState({
    totalPaid: "",
    totalDueAmount: '',
    totalPrice: "",

  })

 

  // const purchaseNoHandler= async ()=>{
  
  //   const response = await   axios.post(`http://localhost:8000/invoice/allPurchase_no`, {purchase_no: viewPurchase});
  //   setEditData(response.data.data);
  //   console.log(response.data.data)
    
  // }
  // useEffect(()=>{
  //   purchaseNoHandler()
  // }, []);
  // const totalData = ()=>{
  //   if(editData){
  //     let totalPaid =  editData.reduce((h1,h2)=>{
  //     return h1+h2.paidAmount
  //   },0 );
  //  let  totalPrice =  editData.reduce((h1,h2)=>{
  //     return h1+h2.totalPrice
  //   },0 );
  //  let totalDueAmount =  editData.reduce((h1,h2)=>{
  //     return h1+h2.dueAmount
  //   },0 );
  //   setData({totalPaid, totalDueAmount, totalPrice})
  //   }
   
   
  // }
  // useEffect(()=>{
  //   totalData()
  // }, [editData]);
  const downloadPDF = () => {
 
    const capture = document.querySelector('.invoice');
    if (capture) {
  
      html2canvas(capture).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = canvas.width * 0.95; 
       const pdfHeight = canvas.height;
        const pdf = new jsPDF('l', 'pt', [pdfWidth, pdfHeight]);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
        pdf.save('invoice.pdf');
      });
    }
  };
  const deleteHandler = async (id) => {
    console.log(id)
    await axios.delete(`http://localhost:8000/product_details/remove_product_details/${id}`).then((res) => {
        console.log(res.data);
        // purchaseNoHandler();

    }).catch((err) => console.log(err))
}
  return (
    <div className='invoice-container'>

   
    <div className='download-invoice' ><SlPrinter onClick={downloadPDF}/> <IoCloseOutline className='closing' onClick={()=>setViewToggle(false)}/></div>
   {editData && <div className='invoice'>
     {orginalCopy?<>
      <p className='invoiceCopy' onClick={()=>setOriginalCopy(!orginalCopy)}>{orginalCopy? "Customer Copy": "Seller Copy"}</p>
      <div className='invoice-first-div'>
        <div className='logo-container'>
          <div className='invoice-logo'>
            <img src={companyLogo} alt='logo' />
          </div>
          <p>Kasper Infotech Pvt. Ltd.</p>
        </div>
        <div className='date-container'>
          <h3>Tax Invoice</h3>
          <p><span>Purchase Date: </span>{editData.date}</p>
        </div>
      </div>
      <div className='invoice-address'>
        <div className='invoice-address-left'>
          <p><span>Office Address:</span><br /> Office Number 214, Tower B, The iThum Towers, Sector 62, Noida, Uttar Pradesh 201301</p>
          <p><span>Phone No: </span>+91 80062 36800</p>
          <p><span>CIN: </span>2222 80062 36800</p>
          <p><span>GST: </span>2222 80062 36800</p>
        </div>
       {editData && <div className='invoice-address-right'>
          <p><span>Invoice ID: </span>{editData.purchase_no}</p>
          <p><span>To: </span>{editData.customer_detail[0].customer_name.toUpperCase()}</p>
          <p><span>Add: </span>{editData.customer_detail[0].customer_address}</p>
          <p><span>Email: </span>{editData.customer_detail[0].customer_email}</p>
          <p><span>GST No: </span>{editData.customer_detail[0].customer_gst}</p>
        </div>} 
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>HSN/SAC code</th>
            <th>Unit Price </th>
            <th>Qty</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {editData && editData.product.map((val)=>{
            return(
              <tr key={val.id}>
            {val.status==="Pending" || val.status==="Rejected"?<td className='print-hide' style={{display: "flex", alignItems:"center", gap: "5px"}}><h4>{val.product_Name}</h4><RiDeleteBinLine style={{color:"red"}} onClick={() => deleteHandler(val.id)} /></td>:<td><h4>{val.product_Name}</h4></td>} 
     
              <td>
                <h4>{val.hsn}</h4>
              </td>
              <td>₹ {val.perUnitPrice}</td>
              <td>{val.noOfUnit}</td>
              <td>₹ {val.discount}</td>
              <td>{val.taxName}</td>
              <td>₹ {val.price}</td>
             

            </tr>
            )
          })}
        
        </tbody>
      </table>
      <div className={orginalCopy?'totalAmount-container cont':' cont totalAmount-container '}>
        <div className='totalAmount'>
        <p><span>Total Amount: </span>₹ {viewPurchase.totalPrice}</p>
          <p><span>Paid Amount: </span>₹ {viewPurchase.paidAmount}</p>

          <p style={{ backgroundColor: '#126262 !important' }}><span>Due Amount: </span>₹ {viewPurchase.dueAmount}</p>
        </div>
      </div></>:<>  <p className='invoiceCopy' onClick={()=>setOriginalCopy(!orginalCopy)}>{orginalCopy? "Customer Copy": "Seller Copy"}</p>
      <div className='invoice-first-div'>
        <div className='logo-container'>
          <div className='invoice-logo'>
            <img src={companyLogo} alt='logo' />
          </div>
          <p>Kasper Infotech Pvt. Ltd.</p>
        </div>
        <div className='date-container'>
          <h3>Tax Invoice</h3>
          <p><span>Purchase Date: </span>{editData.date}</p>
        </div>
      </div>
      <div className='invoice-address'>
        <div className='invoice-address-left'>
          <p><span>Office Address:</span><br /> Office Number 214, Tower B, The iThum Towers, Sector 62, Noida, Uttar Pradesh 201301</p>
          <p><span>Phone No: </span>+91 80062 36800</p>
          <p><span>CIN: </span>2222 80062 36800</p>
          <p><span>GST: </span>2222 80062 36800</p>
        </div>
       {editData && <div className='invoice-address-right'>
          <p><span>Invoice ID: </span>{editData.purchase_no}</p>
          <p><span>To: </span>{editData.customer_detail[0].customer_name.toUpperCase()}</p>
          <p><span>Add: </span>{editData.customer_detail[0].customer_address}</p>
          <p><span>Email: </span>{editData.customer_detail[0].customer_email}</p>
          <p><span>GST No: </span>{editData.customer_detail[0].customer_gst}</p>
        </div>} 
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>HSN/SAC code</th>
            <th>Unit Price </th>
            <th>Qty</th>
            <th>Discount</th>
            <th>Tax</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {editData && editData.product.map((val)=>{
            return(
              <tr key={val.id}>
            {val.status==="Pending" || val.status==="Rejected"?<td className='print-hide' style={{display: "flex", alignItems:"center", gap: "5px"}}><h4>{val.product_Name}</h4><RiDeleteBinLine style={{color:"red"}} onClick={() => deleteHandler(val.id)} /></td>:<td><h4>{val.product_Name}</h4></td>} 
     
              <td>
                <h4>{val.hsn}</h4>
              </td>
              <td>₹ {val.perUnitPrice}</td>
              <td>{val.noOfUnit}</td>
              <td>₹ {val.discount}</td>
              <td>{val.taxName}</td>
              <td>₹ {val.price}</td>
             

            </tr>
            )
          })}
        
        </tbody>
      </table>
      <div className={orginalCopy?'totalAmount-container cont':'totalAmount-container '}>
      {viewPurchase.payments.length > 0 &&   <ul className="payment-list">
  <li className="list-header">
    <span>Payment</span>
    <span>Mode</span>
  </li>
{viewPurchase.payments.map((val, index) => (
    <li className="tag" key={index}>
      <span>{index+1}. ₹{val.amount}</span>
      <span>{val.paymentMode.toLowerCase()}</span>
    </li>
  ))}
</ul>
}
        <div className='totalAmount'>
        <p><span>Total Amount: </span>₹ {viewPurchase.totalPrice}</p>
          <p><span>Paid Amount: </span>₹ {viewPurchase.paidAmount}</p>

          <p style={{ backgroundColor: '#126262 !important' }}><span>Due Amount: </span>₹ {viewPurchase.dueAmount}</p>
        </div>
 
      </div></>}
      <div className='thankyouNote-Container'>

        <p>Thank you for your business</p>


      </div>
      <div className='TermsAndCondition-Container'>

        <h4>Terms and Condition:</h4>
        <p>For any questions or concerns regarding this invoice or the provided goods/services, please contact +91 80062 36800.</p>
        <p>Orders that are canceled after processing may be subject to a cancellation fee.</p>

      </div>
    </div>
    
   } 
 </div>
  )
}

export default Invoice
