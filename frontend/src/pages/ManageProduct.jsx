import React, { useEffect, useState } from 'react';
import "./managersuplier.css";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from 'axios';
import { base_Url } from './api';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { GoDownload } from "react-icons/go";
import ProductForm from '../component/ProductForm';

const ManageProduct = () => {
    const [formToggle, setFormToggle] = useState(false);
    const [data, setData] = useState(null);
    const [viewData, setViewData] = useState(data);
    const [current, setCurrent] = useState(1)
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const [editData, setEditData] = useState("");
    const doc = new jsPDF()
    const allProduct = async () => {
        try {
            const response = await axios.post("http://localhost:8000/product/all_product");
            console.log(response.data.result)
            setData(response.data.result);
            setViewData(response.data.result)
        } catch (error) {
            console.log(error);
        }
    }
    const pdfSaveHandler = () => {
        console.log("hello");
        if (data && Array.isArray(data)) {
            const headers = [['Category Name', 'Product Name', 'Supplier Email', 'Unit Name']];
            const body = data.map(item => [
                item.category_name,
                item.product_Name,
                item.suplire_Email,
                item.unit_Name,
            ]);
    
            autoTable(doc, {
                head: headers,
                body: body,
                startY: 5,
                startX: 5, 
                margin: { left: 5, right: 5 }, 
                tableWidth: 'auto', 
                styles: { cellPadding: 2, fontSize: 10, valign: 'middle', halign: 'center' },
                headStyles: { fillColor: [15, 96, 96], textColor: 255, fontSize: 12, fontStyle: 'bold', minCellHeight: 10 },
                bodyStyles: { minCellHeight: 8, alternateRowStyles: { fillColor: [255, 204, 153] } },
            });
    
           
            doc.save('product.pdf');
        }
    };
    
    
    
    useEffect(() => {
        allProduct();
    }, []);
    const editHandler = (item) => {
        setEditData(item);
        console.log(item)
        setFormToggle(true);
    }
console.log(data)
    const deleteHandler = async (id) => {
        await axios.delete(`http://localhost:8000/product/delete_product/${id}`).then((res) => {
            console.log(res.data);
            alert("deleted")
            allProduct();

        }).catch((err) => console.log(err))
    }

    const searchHandler = (e) => {
        console.log(e.target.value)
        if (e.target.value.length>0) {
            const filterData = data.filter((val) => {
                return val.product_Name.toLowerCase().includes(e.target.value.toLowerCase());
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
            {formToggle ? <ProductForm  editData={editData} setEditData={setEditData} allProduct={allProduct} setFormToggle={setFormToggle} /> : <></>}
            <div className='purchase'>
            <div className='purchase-button'>
        <ul>
    
            
        <li className="subactive" >All Product</li>
       


        <div className='download-container' >
        <GoDownload onClick={pdfSaveHandler}/>
        </div>
        
        </ul>
        <div className='input-container'><input placeholder='Product Name' value={searchKeyWord} onChange={(e) => searchHandler(e)}  /></div>
          </div>
                
                <div className='purchase-table'>
                <button  className='newPurchase' onClick={() => setFormToggle(true)}>Add Product</button>
                    <table>
                        <thead>
                            <tr>
                                <th >S.No.</th>
                                <th >Product Name</th>
                                <th >Supplier Email</th>
                                <th >Unit </th>
                                <th >category</th>
                                <th >Tax</th>
                                <th >Hsn</th>
                                <th >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                viewData && viewData.slice(current*10-10, current*10).map((val, i) => (
                                    <tr key={val.id}>
                                        <td>{(current-1)*10 +i + 1}</td>
                                        <td>{val.product_Name}</td>
                                        <td>{val.suplire_Email}</td>
                                        <td>{val.unit_Name}</td>
                                        <td>{val.category_name }</td>
                                        <td>{val.taxName }</td>
                                        <td>{val.hsn }</td>
                                        
                                        <td><MdOutlineModeEdit className='visible supplier' onClick={() => editHandler(val)} /><RiDeleteBinLine  className='rejected supplier' onClick={() => deleteHandler(val._id)} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
               {viewData?.length>10 && <div className='managersuplier-pagination'>
                      
                      <MdKeyboardArrowLeft onClick={() => paginationPrevHandler(current - 1)}/>
                      <li>{current}</li>
                      <MdKeyboardArrowRight onClick={()=>paginationNextHandler(current+1)}/>
                 
              </div>}
            </div>
        </>
    );
}

export default ManageProduct
