import React from 'react';
import { Link} from 'react-router-dom';
import { GoDownload } from "react-icons/go";

const PurchaseNav = ({location,pdfSaveHandler, searchHandler, searchKeyWord,}) => {
    console.log(location)
    
  return (
    <>
   
    <div className='purchase-button'>
        <ul>
    
            
        <li className={location==="/purchase"?"subactive":"" } ><Link to="/purchase">All Purchase</Link></li>
       
<li className={location === "/purchase/approvePurchase" ? "subactive" : ""} ><Link to="/purchase/approvePurchase">Approve Purchase</Link></li>
<li className={location === "/purchase/duePurchase" ? "subactive" : ""} ><Link to="/purchase/duePurchase">Due Purchase</Link></li>
<li className={location === "/purchase/paidPurchase" ? "subactive" : ""} ><Link to="/purchase/paidPurchase">Paid Purchase</Link></li>
        <li className={location==="/purchase/getPurchase"?"subactive":""}><Link to="/purchase/getPurchase">Get Purchase</Link></li>

        <div className='download-container' >
        <GoDownload onClick={pdfSaveHandler}/>
        </div>
        
        </ul>
        <div className='input-container'><input placeholder='Purchase No.' value={searchKeyWord} onChange={(e) => searchHandler(e)}  /></div>
          </div>
 
          </>
  )
}

export default PurchaseNav
