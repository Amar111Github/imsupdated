import React, { useEffect, useState } from 'react';
import "./managersuplier.css";
import SuplierForm from '../component/SuplierForm';
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from 'axios';
import { base_Url } from './api';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GoDownload } from "react-icons/go";
const ManageSuplier = () => {
    const doc = new jsPDF();
    const [formToggle, setFormToggle] = useState(false);
    const [data, setData] = useState(null);
    const [viewData, setViewData] = useState(data)
    const [current, setCurrent] = useState(1)
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const [editData, setEditData] = useState("");
    const allSupplier = async () => {
        try {
            const response = await axios.get("http://localhost:8000/supplier/find_supplire");
            setData(response.data.product);
            setViewData(response.data.product)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        allSupplier();
    }, []);
    const editHandler = (item) => {
        setEditData(item);
        console.log(item)
        setFormToggle(true);
    }

    const deleteHandler = async (id) => {
        await axios.delete(`http://localhost:8000/supplier/delete_supplire/${id}`).then((res) => {
            console.log(res.data);
            alert("deleted")
            allSupplier();

        }).catch((err) => console.log(err))
    }
    const pdfSaveHandler = () => {
        console.log("hello");
        if (data && Array.isArray(data)) {
            const headers = [["No.", 'supplier Name', 'supplier No.', 'Supplier Email', 'supplier Gst no.', 'supplier Address']];
            const body = data.map((item, i) => [
                i + 1,
                item.suplierName,
                item.suplierContact,
                item.suplierEmail,
                item.suplierGST,
                item.suplierAddress
            ]);
    
     
            const maxSupplierNameWidth = Math.max(...body.map(row => doc.getStringUnitWidth(row[1]) *3)); // Assuming 1 unit is 8 pixels
    
            autoTable(doc, {
                head: headers,
                body: body,
                startY: 5,
                startX: 5,
                margin: { left: 5, right: 5 },
                tableWidth: 'auto',
                columnWidth: 'auto', 
                styles: { cellPadding: 2, fontSize: 8, valign: 'middle', halign: 'center' },
                headStyles: { fillColor: [15, 96, 96], textColor: 255, fontSize: 8, fontStyle: 'bold', minCellHeight: 10 },
                bodyStyles: { minCellHeight: 8, alternateRowStyles: { fillColor: [255, 204, 153] } },
                didDrawCell: (data) => {
                    // Add border to all cells
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height);
                },
                columnStyles: {
                    1: { columnWidth: maxSupplierNameWidth  } // Adding some padding to the calculated width
                },
            });
    
            doc.save('Supplier.pdf');
        }
    };
    
    
    
    
    
    const searchHandler = (e) => {
        console.log(e.target.value)
        if (e.target.value.length>0) {
            const filterData = data.filter((val) => {
                return val.suplierName.toLowerCase().includes(e.target.value.toLowerCase());
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
        <>
            {formToggle ? <SuplierForm data1={data} editData={editData} setEditData={setEditData} allSupplier={allSupplier} setFormToggle={setFormToggle} /> : <></>}
            <div className='purchase'>
            <div className='purchase-button'>
        <ul>
    
            
        <li className="subactive" >All Suppliers</li>
       


        <div className='download-container' >
        <GoDownload onClick={pdfSaveHandler}/>
        </div>
        
        </ul>
        <div className='input-container'><input placeholder='Supplier Name' value={searchKeyWord} onChange={(e) => searchHandler(e)}  /></div>
          </div>
                
                <div className='purchase-table'>
                <button  className='newPurchase' onClick={() => setFormToggle(true)}>Add Suplier</button>
                    <table>
                        <thead>
                            <tr>
                                <th >S.No.</th>
                                <th>Suplier Name</th>
                                <th >Mobile No.</th>
                                <th >Email </th>
                                <th >Supplier Gst </th>

                                <th >Address</th>
                                <th >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                viewData && viewData.slice(current*10-10, current*10).map((val, i) => (
                                    <tr key={val.id}>
                                        <td>{(current-1)*10 +i + 1}</td>
                                        <td>{val.suplierName}</td>
                                        <td>{val.suplierContact}</td>
                                        <td>{val.suplierEmail}</td>
                                        <td>{val.suplierGST}</td>
                                        <td style={{width: "263px"}}>{val.suplierAddress}</td>

                                        <td><MdOutlineModeEdit className='visible supplier' onClick={() => editHandler(val)} /><RiDeleteBinLine className='rejected supplier' onClick={() => deleteHandler(val._id)} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
               {viewData?.length>10 &&   <div className='managersuplier-pagination'>
                      
                      <MdKeyboardArrowLeft onClick={() => paginationPrevHandler(current - 1)}/>
                      <li>{current}</li>
                      <MdKeyboardArrowRight onClick={()=>paginationNextHandler(current+1)}/>
                 
              </div>}
            </div>
        </>
    );
}

export default ManageSuplier;
