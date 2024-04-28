import React, { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import axios from 'axios';
import { base_Url } from '../pages/api';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import "./approvePurchase.css"
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import InvoiceNav from './InvoiceNav';
import { useLocation } from 'react-router-dom';
const ApprovalInvoice = () => {
    const location = useLocation().pathname;
    const [data, setData] = useState(null);
    const [veiwData, setViewData] = useState(data);
    const [units, setUnits] = useState(null);
    const [current, setCurrent] = useState(1)
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const doc = new jsPDF({ orientation: 'landscape' });
    const allPurchase = async () => {
        try {
            const response = await axios.get("http://localhost:8000/invoice/allInvoices");
            
            if(response.data.result.length>0){
                setData(response.data.result[0].arr.filter((val)=>{
                    return(val.status==="Pending")
                }));
                setViewData(response.data.result[0].arr.filter((val)=>{
                    return(val.status==="Pending")
                }));
               }
            
        } catch (error) {
            console.log(error);
        }
    }
    function getTotalQuantities(obj) {
        const result = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const batches = obj[key];
            let totalQuantity = 0;
            batches.forEach(batch => {
              totalQuantity += batch.quantity;
            });
            if(totalQuantity!==0){
                result[key] = totalQuantity;
            }
          }
        }
        return result;
      }
   
    const allUnits = async () => {
        try {
            const response = await axios.get("http://localhost:8000/noOfUnit/noOfUnit");
            
      
            const transformedObject = getTotalQuantities(response.data.data);
            console.log(transformedObject);
            setUnits(transformedObject);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        allPurchase();
        allUnits();
    }, []);
    
console.log(data)
    const rejectHandler = async (item) => {
        item.status = "Rejected";
        console.log(item)
        try{
            await axios.patch(`http://localhost:8000/invoice/updateProductstatus/${item._id}`, item);
            alert("Request is Rejected")
            allPurchase();
        }catch(error){
            alert(error)
        }
        

        }
    
    const approveHandler = async (item) => {
        item.status = "Approved";
        for(let key in units){
            console.log(key, item.product_Name)
            if(key===item.product_Name){
                console.log(+units[key]- +item.noOfUnit)
                if(units[key]-item.noOfUnit>=0){
                     try{
            await axios.patch(`http://localhost:8000/invoice/updateProductstatus/${item.id}`, item);
            alert("Request is Approved")
            allPurchase();
            allUnits();
            return;
        }catch(error){
            alert(error)
        }
                }else{
                    alert("Shortage of quantity");
                  return;
                }
            }
        }
       alert("product not found")
      
    }
    const pdfSaveHandler = () => {
        if(data.length<1) return;
        if (data && Array.isArray(data)) {
           
            doc.setFontSize(10);
            doc.text("Invoices Data", 5, 5);
            
            const headers = [
                ["No.", 'Date', 'Purchase_no', "Product_Name", 'Cutomer_Email', 'Hsn', "Unit Cost", "QTY", "discount", "Tax Name", "Total Price","Paid Amount", "Due Amount", "Paid Status"]
            ];
            const body = data.map((item, i) => [
                i + 1,
                item.date,
                item.purchase_no,
                item.product_Name,
                item.customer_email,
                item.hsn,
                item.perUnitPrice,
                item.noOfUnit,
                item.discount,
                item.taxName,
                item.totalPrice,
                item.paidAmount,
                item.dueAmount,
                item.paidStatus,
            ]);
    
            autoTable(doc, {
                head: headers,
                body: body,
                startY: 8, 
                startX: 5,
                margin: { left: 5, right: 5 },
                tableWidth: 'auto',
                styles: { cellPadding: 2, fontSize: 8, valign: 'middle', halign: 'center' },
                headStyles: { fillColor: [15, 96, 96], textColor: 255, fontSize: 8, fontStyle: 'bold', minCellHeight: 10 },
                bodyStyles: { minCellHeight: 10, alternateRowStyles: { fillColor: [255, 204, 153] } },
            });
    
            doc.save('Invoice waiting for Approval.pdf');
        }
    }; 
    const searchHandler = (e) => {
        console.log(e.target.value)
        if (e.target.value.length>0) {
            const filterData = data.filter((val) => {
                return val.purchase_no.includes(e.target.value);
            });
            setViewData(filterData);
        }else if(e.target.value.length===0){
            setViewData(data);
        }
        setSearchKeyWord(e.target.value)
    }
    const paginationPrevHandler =(page)=>{
        
        if(page<1) return;
      setCurrent(page);
    }
    const paginationNextHandler = (page)=>{
        if(page*10-9>data.length) return;
        setCurrent(page);
    }
  return (
    <div className='purchase'>
                <InvoiceNav location={location}  pdfSaveHandler={pdfSaveHandler} searchKeyWord={searchKeyWord} searchHandler={searchHandler}/>
                <div className='purchase-table'>
                    <table>
                        <thead>
                        <tr>
                            <th>S No.</th>
                                <th>ID</th>
                                <th>Date</th>
                                <th >Product Name </th>
                                <th >Category</th>
                                <th >QTY</th>
                                <th >Total Price</th>
                                <th>Paid status</th>
                                <th>Due</th>
                                <th>Paid</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                veiwData && veiwData.slice(current*10-10, current*10).map((val, i) => (
                                    <tr key={val.id}>
                                        <td>{(current-1)*10 +i + 1}</td>
                                        <td>{val.purchase_no}</td>
                                        <td>{val.date}</td>
                                        <td>{val.product_Name }</td>
                                        <td>{val.category_name }</td>
                                        <td>{val.noOfUnit}</td>
                                        <td>{val.totalPrice }</td>
                                        <td>{val.paidStatus}</td>
                                        <td>{val.dueAmount}</td>
                                        <td>{val.paidAmount}</td>
                                        <td className='pending'>{val.status}</td>
                                       <td><TiTick className='approved' onClick={() => approveHandler(val)} /> <RxCross2 className='rejected' onClick={() => rejectHandler(val)} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
               {veiwData?.length>10 &&  <div className='managersuplier-pagination'>
                      
                      <MdKeyboardArrowLeft onClick={() => paginationPrevHandler(current - 1)}/>
                      <li>{current}</li>
                      <MdKeyboardArrowRight onClick={()=>paginationNextHandler(current+1)}/>
                 
              </div>}
            </div>
  )
}

export default ApprovalInvoice