import React, {useState} from 'react'
import "./getInvoices.css";
import { base_Url } from '../pages/api';
import axios from "axios";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import jsPDF from 'jspdf';
import { TfiTrash } from "react-icons/tfi";
import { SlEye } from "react-icons/sl";
import autoTable from 'jspdf-autotable';
import InvoiceNav from './InvoiceNav';
import { useLocation } from 'react-router-dom';
import Invoice from './Invoice';
const GetInvoice = () => {
    const location = useLocation().pathname;
    const doc = new jsPDF();
    const [data, setData] = useState({
        startDate: "",
        endDate: "",
        status: "Approved"
    });
    const [date, setDate] = useState(data);
    const [receivedData, setReceivedData] = useState(null);
    const [viewToggle, setViewToggle] = useState(false);
    const [copyData, setCopyData] = useState(receivedData)
    const [current, setCurrent] = useState(1)
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const [viewPurchase, setViewPurchase] = useState(null);
    const allPurchase = async () => {
        try {
            const response = await axios.post("http://localhost:8000/invoice/find_product_list", data);
            console.log(response.data.data)
            setReceivedData(response.data.data)
            setCopyData(response.data.data)
         
        } catch (error) {
            console.log(error);
        }
    }
    const submitHandler = (e)=>{
        e.preventDefault();
        setDate(data);
        allPurchase();
        setData({
            startDate: "",
            endDate: "",
            status: "Approved"
        })
    }
    const paginationPrevHandler =(page)=>{
        
        if(page<1) return;
      setCurrent(page);
    }
    const paginationNextHandler = (page)=>{
        if(page*10-9>data.length) return;
        setCurrent(page);
    }
    const pdfSaveHandler = () => {
        if (copyData.length < 1) return;
    
        let startY = 7; // Initial startY position
        const margin = 7; // Margin for each table
        const minTableHeight = 50; // Minimum height for each table
        const maxWidth = doc.internal.pageSize.width - margin * 2; // Maximum width for each table
        const avgRowHeight = 5; // Average row height (adjusted to a smaller value)
    
        // Add the document title outside the loop
        doc.setFontSize(10);
        doc.text(`Purchase Data from ${date.startDate} - To ${date.endDate}`, 10, startY);
    
        copyData.forEach((purchaseData, index) => {
            const customerDetail = purchaseData.customer_detail[0];
            const paymentData = purchaseData.payments[0];
    
            const headers = [
                ["Date", "Purchase No", "Supplier Name", "Total Price", "Paid Amount", "Due Amount", "Due Date", "Status"]
            ];
            const body = [
                [
                    purchaseData.date,
                    purchaseData.purchase_no,
                    customerDetail.customer_name, // Assuming "customer_name" is the supplier name
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
            const productsHeaders = ["Product Name", "Batch No", "HSN", "No of Units", "Per Unit Price","Discount", "Tax Percentage", "Price"];
            const productsBody = purchaseData.product.map(product => [
                product.product_Name,
                product.batchNo,
                product.hsn,
                product.noOfUnit,
                product.perUnitPrice,
                product.discount,
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
            if (startY + minTableHeight + 30 > doc.internal.pageSize.height && index !== copyData.length - 1) {
                doc.addPage();
                startY = 7; // Reset startY position for new page
            }
        });
    
        doc.save(`Invoices.pdf`);
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    const searchHandler = (e) => {
        console.log(e.target.value.length)
        if (e.target.value.length>0) {
            const filterData = receivedData.filter((val) => {
                return val.purchase_no.includes(e.target.value);
            });
            setCopyData(filterData);
        }else if(e.target.value.length===0){
            setCopyData(receivedData)
        }
        setSearchKeyWord(e.target.value)
    }
    const deleteHandler = async (id) => {
        await axios.delete(`http://localhost:8000/invoice/remove_invoice_details/${id}`).then((res) => {
            console.log(res.data);
            alert("deleted")
            allPurchase();

        }).catch((err) => console.log(err))
    }
    const [expandedRow, setExpandedRow] = useState(null);

    const handleRowClick = (id) => {
      setExpandedRow(expandedRow === id ? null : id);
    };
  return (
    <> {viewToggle ? <Invoice  viewPurchase={viewPurchase} setViewToggle={setViewToggle} /> : <></>}
    <div className='purchase'>
         <InvoiceNav location={location} pdfSaveHandler={pdfSaveHandler} searchKeyWord={searchKeyWord} searchHandler={searchHandler}/>
        <form onSubmit={submitHandler}>
            <input type='date' value={data.startDate} onChange={(e)=>setData((prev)=>({...prev, startDate:e.target.value}))}/>
            <input type='date' value={data.endDate} onChange={(e)=>setData((prev)=>({...prev, endDate:e.target.value}))}/>
            <button type='submit'>Search</button>
        </form>
   
  
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
                {
                    copyData && copyData.slice(current * 10 - 10, current * 10).map((val, i) => (
                        <React.Fragment key={val.id}>
            <tr onClick={() => handleRowClick(val.id)}>
              <td>{val.date}</td>
              <td>{val.purchase_no}</td>
              <td>{val.customer_detail[0].customer_name}</td>
              <td>{val.totalPrice}</td>
              <td>{val.paidAmount}</td>
              <td>{val.dueAmount}</td>
              <td>{val.paymentDue}</td>
              <td className={val.status==="Approved"?'approve':val.status==="Rejected"?"reject":"pending"}>{val.status}</td>
             {val.status==="Pending"?<td className='action'><TfiTrash className='reject' onClick={()=>deleteHandler(val.id)}/><SlEye onClick={()=>(setViewToggle(val.purchase_no),setViewPurchase(val))}/></td>:<td><SlEye onClick={()=>(setViewToggle(val.purchase_no),setViewPurchase(val))}/></td>}
            </tr>
            {expandedRow === val.id && (
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
                      {val.product.map((product) => (
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
            {/* <tbody>
                {
                    copyData && copyData.slice(current * 10 - 10, current * 10).map((val, i) => (
                        <tr key={val.id}>
                            <td>{(current - 1) * 10 + i + 1}</td>
                            <td>{val.purchase_no}</td>
                            <td>{val.product_Name}</td>
                            <td>{val.date}</td>
                     
                            <td>{val.category_name}</td>
                            <td>{val.noOfUnit}</td>
                            <td>{val.perUnitPrice}</td>
                            <td>{val.totalPrice}</td>
                            <td className='approve'>{val.status}</td>
                            <td><MdOutlineRemoveRedEye className='visible' onClick={()=> (setViewPurchase(val.purchase_no),setViewToggle(true))}/></td>
                        </tr>
                    ))
                }
            </tbody> */}
        </table>
    </div>
    {copyData?.length > 10 && <div className='managersuplier-pagination'>
    <MdKeyboardArrowLeft onClick={() => paginationPrevHandler(current - 1)}/>
                            <li>{current}</li>
                            <MdKeyboardArrowRight onClick={()=>paginationNextHandler(current+1)}/>
    </div>}
</div>

</>
  )
}

export default GetInvoice
