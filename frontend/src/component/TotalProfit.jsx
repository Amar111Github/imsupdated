import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GoDownload } from "react-icons/go";
import { useLocation, Link } from 'react-router-dom';
import { base_Url } from '../pages/api';
import "./manageUnit.css";

const TotalProfit = () => {
    const doc = new jsPDF();

    const location = useLocation().pathname;
    const [data, setData] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [searchKeyWord, setSearchKeyWord] = useState('');
    const [totalProfitValue, setTotalProfitValue] = useState(0);
    const [activeFilter, setActiveFilter] = useState(null);
    const [date, setDate] = useState({
        startDate: "",
        endDate: "",
        status: "Approved"
    });
    const itemsPerPage = 10;
    function getTotalPrice(obj) {
        const result = {};
        
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const batches = obj[key];
         
            let totalPrice = 0;
            batches.forEach(batch => {

              totalPrice+= batch.profit;
            });
            if(totalPrice!==0){
                result[key] = totalPrice;
            }
            
          }
        }
        profitCalculator(result)
        return result;
      }
      const profitCalculator = (obj) => {
        let profit = (Object.entries(obj).reduce((accu, [key, value]) => {
            return accu + value;
        }, 0)).toFixed(2);
        
        setTotalProfitValue(profit);
    };

    const allUnits = async () => {
        try {
            const response = await axios.get("http://localhost:8000/noOfUnit/noOfUnit");
            console.log(response)
            const transformedObject = getTotalPrice(response.data.data);
            console.log(transformedObject)
            setData(transformedObject);
            setViewData(transformedObject);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        allUnits();
    }, []);

    const pdfSaveHandler = () => {
        let serial = 1;
        if (Object.keys(viewData).length === 0) return;
    
        let startY = 5; // Adjust startY position if needed
    
        // Add the document title outside the loop
        doc.setFontSize(10);
        doc.text(`Units Data`, 10, startY);
    
        const headers = [['S no.', 'Product Name', 'Total Profit']];
        const body = [];
        let rowIndex = 0;
        const productColors = {}; // Object to store product names and their colors
    
        Object.entries(viewData).forEach(([productName, totalProfit]) => {
            body.push([
                serial,
                productName,
                totalProfit,
            ]);
            serial++;
    
            if (!productColors[productName]) {
                productColors[productName] = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)]; // Generate a random color for the product name
            }
    
            rowIndex++;
        });
    
        autoTable(doc, {
            head: headers,
            body: body,
            startY: startY+3 , // Adjust startY if needed
            startX: 5,
            margin: { left: 1, right: 1 },
            tableWidth: 'auto',
            styles: { cellPadding: 2, fontSize: 10, valign: 'middle', halign: 'center' },
            headStyles: { fillColor: [15, 96, 96], textColor: 255, fontSize: 12, fontStyle: 'bold', minCellHeight: 10 },
            bodyStyles: { minCellHeight: 8, alternateRowStyles: { fillColor: [255, 204, 153] } }
        });
    
        doc.save('Units in Stock.pdf');
    };
    

    const searchHandler = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchKeyWord(keyword);
        if (keyword.length > 0) {
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([productName]) => productName.toLowerCase().includes(keyword))
            );
            setViewData(filteredData);
        } else {
            setViewData(data);
        }
    };
const searchProducts = async ()=>{
    try {
        const response = await axios.post("http://localhost:8000/noOfUnit/profit", date);
      console.log(response)
        const transformedObject = getTotalPrice(response.data.data);
   
        setData(transformedObject);
        setViewData(transformedObject);
    } catch (error) {
        console.log(error);
    }
}

    const submitHandler = (e)=>{
        e.preventDefault();
        if(date.startDate==="" || date.endDate==="") return;

        searchProducts();
        
        setActiveFilter(null);
        setDate({
            startDate: "",
            endDate: "",
            status: "Approved"
        })
    }

const weeklyHandler = async ()=>{
    try {
        const today = new Date();
        const currentDay = today.getDay();
        let monday = new Date(today);
        if (currentDay === 0) {
            monday.setDate(today.getDate() - 6); 
        } else {
            monday.setDate(today.getDate() - (currentDay - 1)); 
        }
        const startDate1 = new Date(monday);
      
        const startDate = startDate1.toISOString().slice(0, 10);
        const endDate = today.toISOString().slice(0, 10);
      
      
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
     let status= "Approved";
        let obj = {startDate, endDate, status}
        console.log(obj)
        const response = await axios.post("http://localhost:8000/noOfUnit/profit", obj);

        const transformedObject = getTotalPrice(response.data.data);
   
        setData(transformedObject);
        setViewData(transformedObject);
        setActiveFilter("Weekly"); 
    } catch (error) {
        console.log(error);
    }
}



const monthlyHandler = async ()=>{
    try {
        let status= "Approved";
        const today = new Date();
   const monthStart = new Date(today.getFullYear(), today.getMonth(), 2);
   const startDate = monthStart.toISOString().slice(0, 10);
   const endDate = today.toISOString().slice(0, 10);
        let obj = {startDate, endDate, status}
        console.log(obj)
        const response = await axios.post("http://localhost:8000/noOfUnit/profit", obj);
        const transformedObject = getTotalPrice(response.data.data);
        setData(transformedObject);
        setViewData(transformedObject);
        setActiveFilter("Monthly");
    } catch (error) {
        console.log(error);
    }
}
const yearlyHandler = async ()=>{
    try {

        let status= "Approved";
        const today = new Date();
        const yearStart = new Date(today.getFullYear(), 0, 2); // January 1st of the current year
    
        const startDate = yearStart.toISOString().slice(0, 10); // Start date is January 1st of the current year
        const endDate = today.toISOString().slice(0, 10);
        let obj = {startDate, endDate, status}
       console.log(obj)
        const response = await axios.post("http://localhost:8000/noOfUnit/profit", obj);

        const transformedObject = getTotalPrice(response.data.data);
   
        setData(transformedObject);
        setViewData(transformedObject);
        setActiveFilter("Yearly"); 
    } catch (error) {
        console.log(error);
    }
}
console.log(viewData)
    return (
        <>
            <div className='purchase'>
                <div className='purchase-button'>
                    <ul>
                        <li className={location === "/unit" ? "subactive" : ""}><Link to="/unit">Total Units</Link></li>
                        <li className={location === "/unit/batchUnits" ? "subactive" : ""}><Link to="/unit/batchUnits">All Batch Units</Link></li>
                        <li className={location === "/unit/profit" ? "subactive" : ""}><Link to="/unit/profit">Batch Profit</Link></li>
                        <li className={location === "/unit/totalProfit" ? "subactive" : ""}><Link to="/unit/totalProfit">Total Profit</Link></li>
                        <div className='download-container' >
                            <GoDownload onClick={pdfSaveHandler} />
                        </div>
                    </ul>
                    <div className='input-container'><input placeholder='Product Name' value={searchKeyWord} onChange={(e) => searchHandler(e)} /></div>
                    
                </div>
                <div className='purchase-table totalprice'>
                    <div className='purchase-table-filters'>
                    <div className='purchase-table-filters-nav'>
                    <p className={activeFilter === "Yearly" ? "active-link" : ""} onClick={yearlyHandler}>Yearly</p>
                            <p className={activeFilter === "Monthly" ? "active-link" : ""} onClick={monthlyHandler}>Monthly</p>
                            <p className={activeFilter === "Weekly" ? "active-link" : ""} onClick={weeklyHandler}>Weekly</p>
                    </div>

                    
                <form onSubmit={submitHandler}>
                <input type='date' value={date.startDate} onChange={(e)=>setDate((prev)=>({...prev, startDate:e.target.value}))}/>
                <input type='date' value={date.endDate} onChange={(e)=>setDate((prev)=>({...prev, endDate:e.target.value}))}/>
                <button type='submit'>Search</button>
        </form>
        </div>
                <p className='purchase-table_profit'>Total: <span>₹ {totalProfitValue}</span> </p>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>S No.</th>
                                <th style={{ width: '200px' }}>Product Name</th>
                                <th style={{ width: '200px' }}>Total Profit(₹)</th>
             
                            </tr>
                        </thead>
                        <tbody>
                            {viewData &&
                                Object.entries(viewData).map(([productName, totalUnits], index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{productName}</td>
                                        <td>{totalUnits}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default TotalProfit
