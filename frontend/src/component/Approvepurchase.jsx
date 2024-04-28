import React, { useEffect, useState } from 'react';


import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { base_Url } from '../pages/api';
import { MdKeyboardArrowRight} from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IoCheckmarkOutline } from "react-icons/io5";

import PurchaseNav from './PurchaseNav';
import "./approvePurchase.css"
import { useLocation } from 'react-router-dom';

const Approvepurchase = () => {
    const location = useLocation().pathname;
    const [data, setData] = useState(null);
    const [viewData, setViewData] = useState(data)
    const [current, setCurrent] = useState(1)
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const doc = new jsPDF();
    const allPurchase = async () => {
        try {
            const response = await axios.get("http://localhost:8000/product_details/allpurchase");
            console.log(response)
            console.log(response.data.result)
            setData(response.data.result[0].arr.filter((val)=>{
                return(val.status==="Pending")
            }));
            setViewData(response.data.result[0].arr.filter((val)=>{
                return(val.status==="Pending")
            }));
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        allPurchase();
    }, []);
    
console.log(data)
    const rejectHandler = async (item) => {
        item.status = "Rejected";
        console.log(item)
        try{
            await axios.patch(`http://localhost:8000/product_details/updateProductstatus/${item._id}`, item);
            alert("Request is Rejected")
            allPurchase();
        }catch(error){
            alert(error)
        }
        

        }
    
    const approveHandler = async (item) => {
        item.status = "Approved";
        console.log(item)
        try{
            await axios.patch(`http://localhost:8000/product_details/updateProductstatus/${item._id}`, item);
            alert("Request is Approved");
            
            allPurchase();
         
        }catch(error){
            alert(error)
        }
      
    }
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
    const pdfSaveHandler = () => {
      if (viewData.length < 1) return;
    
      let startY = 7; // Initial startY position
      const margin = 7; // Margin for each table
      const minTableHeight = 50; // Minimum height for each table
      const maxWidth = doc.internal.pageSize.width - margin * 2; // Maximum width for each table
      const avgRowHeight = 5; // Average row height (adjusted to a smaller value)
    
      // Add the document title outside the loop
      doc.setFontSize(10);
      doc.text(`Purchase Data`, 10, startY);
    
      viewData.forEach((purchaseData, index) => {
          const supplierDetail = purchaseData.supplierDetail[0];
          const paymentData = purchaseData.payments[0];
    
          const headers = [
              ["Date", "Purchase No", "Supplier Name", "Total Price", "Paid Amount", "Due Amount", "Due Date", "Status"]
          ];
          const body = [
              [
                  purchaseData.date,
                  purchaseData.purchase_no,
                  supplierDetail.suplierName, // Assuming "customer_name" is the supplier name
                  purchaseData.totalPrice, // Total Price calculation
                  purchaseData.paidAmount,
                  purchaseData.dueAmount,
                  purchaseData.paymentDue,
                  purchaseData.status
              ]
          ];
    
          // Calculate the height of the first table based on available space
          let tableHeight = body.length * avgRowHeight;
    
          autoTable(doc, {
              head: headers,
              body: body,
              startY: startY + 4,
              margin: { left: margin, right: margin },
              tableWidth: maxWidth,
              styles: { cellPadding: 1, fontSize: 8, valign: 'middle', halign: 'center' },
              headStyles: { fillColor: [15, 96, 96], textColor: 255, fontSize: 8, fontStyle: 'bold', minCellHeight: 8 },
              bodyStyles: { minCellHeight: 8, alternateRowStyles: { fillColor: [255, 204, 153] } },
              height: tableHeight // Set the height of the table
          });
    
          // Calculate the height of the nested table based on available space
          const productsHeaders = ["Product Name", "Batch No", "HSN", "No of Units", "Per Unit Price", "Tax Percentage", "Price"];
          const productsBody = purchaseData.product.map(product => [
              product.product_Name,
              product.batchNo,
              product.hsn,
              product.noOfUnit,
              product.perUnitPrice,
    
              product.taxPer,
              product.price
          ]);
          console.log(productsBody.length)
          let productsTableHeight = productsBody.length * avgRowHeight;
    
          // Add a nested table for products
          autoTable(doc, {
              head: [productsHeaders],
              body: productsBody,
              startY: startY + tableHeight + 15, // Start directly below the complete body of the first table
              margin: { left: margin, right: margin },
              tableWidth: maxWidth,
              styles: { cellPadding: 1, fontSize: 8, valign: 'middle', halign: 'center' },
              headStyles: { fillColor: [0, 123, 255], textColor: 255, fontSize: 8, fontStyle: 'bold', minCellHeight: 8 },
              bodyStyles: { minCellHeight: 8, alternateRowStyles: { fillColor: [255, 204, 153] } },
              height: productsTableHeight // Set the height of the table
          });
    
          // Update startY position for the next set of tables
          startY += tableHeight+ productsTableHeight + 25;
    
          // Check if the next table exceeds the page height and add a new page if needed
          if (startY + minTableHeight + 30 > doc.internal.pageSize.height && index !== viewData.length - 1) {
              doc.addPage();
              startY = 7; // Reset startY position for new page
          }
      });
    
      doc.save(`Purchase.pdf`);
    };
    const paginationPrevHandler =(page)=>{
        
        if(page<1) return;
      setCurrent(page);
    }
    const paginationNextHandler = (page)=>{
        if(page*10-9>data.length) return;
        setCurrent(page);
    }
    const [expandedRow, setExpandedRow] = useState(null);

    const handleRowClick = (id) => {
      setExpandedRow(expandedRow === id ? null : id);
    };
  return (
   <>
                
                <div className='purchase'>
                <PurchaseNav location={location}   pdfSaveHandler={pdfSaveHandler} searchKeyWord={searchKeyWord} searchHandler={searchHandler}/>
                <div className='purchase-table'>
                <table>
                <thead>
        <tr>
          <th>Date</th>
          <th>Purchase No</th>
          <th>Supplier Name</th>
          <th>Total Price</th>
          <th>Paid Amount</th>
          <th>Due Amount</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {viewData && viewData.slice(current*10-10, current*10).map((purchase) => (
          <React.Fragment key={purchase.id}>
            <tr onClick={() => handleRowClick(purchase.id)}>
              <td>{purchase.date}</td>
              <td>{purchase.purchase_no}</td>
              <td>{purchase.supplierDetail[0].suplierName}</td>
              <td>{purchase.totalPrice}</td>
              <td>{purchase.paidAmount}</td>
              <td>{purchase.dueAmount}</td>
              <td>{purchase.paymentDue}</td>
              <td className='pending'>{purchase.status}</td>
                                       
                                       <td className='purchasde-icon'><IoCheckmarkOutline className='approved' onClick={(e) => (e.stopPropagation(),approveHandler(purchase)   )} /> <RxCross2 className='rejected' onClick={(e) => (e.stopPropagation(),rejectHandler(purchase))} /></td>
                                    </tr>
                                    {expandedRow === purchase.id && (
              <tr>
                <td colSpan="9"> {/* Increase colspan to match the number of columns */}
                  <table className='internaltable'>
                    <thead >
                      <tr >
                        <th >Product Name</th>
                        <th >Batch No</th>                 
                        <th>HSN</th>
                        <th >No of Units</th>
                        <th>Per Unit Price</th>
                        <th>Tax Percentage</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchase.product.map((product) => (
                        <tr key={product.productId}>
                          <td>{product.product_Name}</td>
                          <td>{product.batchNo}</td>
                          <td>{product.hsn}</td>
                          <td>{product.noOfUnit}</td>
                          <td>{product.perUnitPrice}</td>
                          <td>{product.taxPer}</td>
                          <td>{product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
                </React.Fragment>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                </div>
                {viewData?.length>10 &&  <div className='managersuplier-pagination'>
                      
                      <MdKeyboardArrowLeft onClick={() => paginationPrevHandler(current - 1)}/>
                      <li>{current}</li>
                      <MdKeyboardArrowRight onClick={()=>paginationNextHandler(current+1)}/>
                 
              </div>}
                </>
  )
}

export default Approvepurchase
