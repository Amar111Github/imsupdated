import React from 'react';
import { Link } from 'react-router-dom';
import { GoDownload } from 'react-icons/go';

const InvoiceNav = ({location,pdfSaveHandler, searchHandler, searchKeyWord,}) => {
  return (
    <>
   
    <div className='purchase-button'>
        <ul>
    
            
        <li className={location==="/invoice"?"subactive":"" } ><Link to="/invoice">All Invoice</Link></li>
       
{/* <li className={location === "/invoice/approveInvoice" ? "subactive" : ""} ><Link to="/invoice/approveInvoice">Approve Invoice</Link></li> */}
<li className={location === "/invoice/dueInvoice" ? "subactive" : ""} ><Link to="/invoice/dueInvoice">Due Invoice</Link></li>
<li className={location === "/invoice/paidInvoice" ? "subactive" : ""} ><Link to="/invoice/paidInvoice">Paid Invoice</Link></li>
        <li className={location==="/invoice/getInvoice"?"subactive":""}><Link to="/invoice/getInvoice">Get Invoice</Link></li>

        <div className='download-container' >
        <GoDownload onClick={pdfSaveHandler}/>
        </div>
        
        </ul>
        <div className='input-container'><input placeholder='Purchase No.' value={searchKeyWord} onChange={(e) => searchHandler(e)}  /></div>
          </div>
 
          </>
  )
}

export default InvoiceNav
