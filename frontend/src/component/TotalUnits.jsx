import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GoDownload } from "react-icons/go";
import { useLocation, Link } from 'react-router-dom';
import { base_Url } from '../pages/api';
import "./manageUnit.css";

const TotalUnits = () => {
    const doc = new jsPDF();
    const location = useLocation().pathname;
    const [data, setData] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [searchKeyWord, setSearchKeyWord] = useState('');
    const itemsPerPage = 10;
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
        if (data.length < 1) return;
    
        let startY = 5; // Adjust startY position if needed
    
        // Add the document title outside the loop
        doc.setFontSize(10);
        doc.text(`Units Data`, 10, startY);
    
        if (data) {
            const headers = [['S no.', 'Product Name', 'Total No. of units']];
            const body = [];
            let rowIndex = 0;
            const productColors = {}; // Object to store product names and their colors
    
            Object.entries(viewData).forEach(([productName, totalUnits], pageIndex) => {
                body.push([
                    serial,
                    productName,
                    totalUnits,
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
                startY: startY +3, // Adjust startY if needed
                startX: 5,
                margin: { left: 1, right: 1 },
                tableWidth: 'auto',
                styles: { cellPadding: 2, fontSize: 10, valign: 'middle', halign: 'center' },
                headStyles: { fillColor: [15, 96, 96], textColor: 255, fontSize: 12, fontStyle: 'bold', minCellHeight: 10 },
                bodyStyles: { minCellHeight: 8, alternateRowStyles: { fillColor: [255, 204, 153] } }
            });
    
            doc.save('Units in Stock.pdf');
        }
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
                <div className='purchase-table'>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>S No.</th>
                                <th style={{ width: '200px' }}>Product Name</th>
                                <th style={{ width: '200px' }}>Total No Of Units</th>
             
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
};

export default TotalUnits;
