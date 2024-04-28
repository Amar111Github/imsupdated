import React from 'react';
import Header from '../component/Header';

import MainPage from '../component/MainPage';

import ManageSuplier from './ManageSuplier';
import ManageCategory from './ManageCategory';
import "./home.css"
import { Routes,Route ,Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import ManageProduct from './ManageProduct';
import ManagePurchase from './ManagePurchase';
import Approvepurchase from '../component/Approvepurchase';
import ManageCustomer from './ManageCustomer';
import ManageInvoice from './ManageInvoice';
import ApprovalInvoice from '../component/ApprovalInvoice';
import DueInvoice from '../component/DueInvoice';
import PaidInvoices from '../component/PaidInvoices';
import ManageHsn from './ManageHsn';
import ManageUnits from '../component/ManageUnits';
import GetInvoice from '../component/GetInvoice';
import GetPurchase from '../component/GetPurchase';
import ManagerTax from './ManagerTax';
import TotalUnits from "../component/TotalUnits"
import DuePurchase from '../component/DuePurchase';
import PaidPurchase from '../component/PaidPurchase';
import TotalProfit from '../component/TotalProfit';
import BatchProfit from '../component/BatchProfit';

const Home = () => {
  return (
     <>
      <Header />
      <div className='dashboard'>
      <Sidebar/>
        <Routes>
          <Route path='/home' element={<MainPage/>} />
          <Route path='/supplier' element={<ManageSuplier/>} />
          <Route path='/category' element={<ManageCategory/>}/>
          <Route path='/product' element={<ManageProduct/>}/>
          <Route path='/purchase' >
            <Route path='/purchase' element={<ManagePurchase/>}/>
    <Route path='/purchase/approvePurchase' element={<Approvepurchase />} />
    <Route path='/purchase/duePurchase' element={<DuePurchase />} />
    <Route path='/purchase/paidPurchase' element={<PaidPurchase />} />
    <Route path='/purchase/getPurchase' element={<GetPurchase />} />
  </Route>
   
       
          <Route path='/customer' element={<ManageCustomer/>}/>
          <Route path='/invoice'>
          <Route path='/invoice' element={<ManageInvoice/>}/>
          {/* <Route path='/invoice/approveInvoice' element={<ApprovalInvoice/>}/> */}
          <Route path='/invoice/dueInvoice' element={<DueInvoice/>}/>
          <Route path='/invoice/paidInvoice' element={<PaidInvoices/>}/>
          <Route path='/invoice/getInvoice' element={<GetInvoice/>}/>
          </Route>
          
        
          <Route path='/hsn' element={<ManageHsn/>}/>
          <Route path='/unit'>
          <Route path='/unit' element={<TotalUnits/>}/>
  <Route path='/unit/batchUnits' element={<ManageUnits/>}/>
  <Route path='/unit/profit' element={<BatchProfit/>}/>
  <Route path='/unit/totalProfit' element={<TotalProfit/>}/>
</Route>
    
        
          <Route path='/taxes' element={<ManagerTax/>}/>
        </Routes>
        
      </div>
      
      </>
  )
}

export default Home
