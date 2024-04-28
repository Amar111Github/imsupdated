
import React, { useEffect, useState } from 'react';
import "./managersuplier.css";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from 'axios';
import { base_Url } from './api';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import CategoryForm from './CategoryForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GoDownload } from "react-icons/go";
const ManageCategory = () => {
    const doc = new jsPDF()
    const [formToggle, setFormToggle] = useState(false);
    const [data, setData] = useState(null);
    const [viewData, setViewData] = useState(data)
    const [current, setCurrent] = useState(1)
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const [editData, setEditData] = useState("");
    const allCategory = async () => {
        try {
            const response = await axios.get("http://localhost:8000/category/findall_category");
            setData(response.data.data);
            setViewData(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        allCategory();
    }, []);
    const editHandler = (item) => {
        setEditData(item);
        console.log(item)
        setFormToggle(true);
    }

    const deleteHandler = async (id) => {
        await axios.delete(`http://localhost:8000/category/${id}`).then((res) => {
            console.log(res.data);
            alert("deleted")
            allCategory();

        }).catch((err) => console.log(err))
    }
    const pdfSaveHandler = () => {
        console.log("hello");
        if (data && Array.isArray(data)) {
            const headers = [['No.', 'Category Name']];
            const body = data.map((item,i)=> [
                i+1,
                item.category,
              
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
    
           
            doc.save('Category.pdf');
        }
    };
    const searchHandler = (e) => {
        console.log(e.target.value)
        if (e.target.value.length>0) {
            const filterData = data.filter((val) => {
                return val.category.toLowerCase().includes(e.target.value.toLowerCase());
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
            {formToggle ? <CategoryForm  editData={editData} setEditData={setEditData} allCategory={allCategory} setFormToggle={setFormToggle} /> : <></>}
            <div className='purchase'>
            <div className='purchase-button'>
        <ul>
    
            
        <li className="subactive" >All Category</li>
       


        <div className='download-container' >
        <GoDownload onClick={pdfSaveHandler}/>
        </div>
        
        </ul>
        <div className='input-container'><input placeholder='Category Name' value={searchKeyWord} onChange={(e) => searchHandler(e)}  /></div>
          </div>
                <div className='purchase-table'>
                <button  className='newPurchase' onClick={() => setFormToggle(true)}>Add Category</button>
                    <table>
                        <thead>
                            <tr>
                                <th >S.No.</th>
                                <th >Category Name</th>
                              
                                <th >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                viewData && viewData.slice(current*10-10, current*10).map((val, i) => (
                                    <tr key={val.id}>
                                        <td>{(current-1)*10 +i + 1}</td>
                                        <td>{val.category}</td>
                                        
                                        <td><MdOutlineModeEdit className='visible supplier' onClick={() => editHandler(val)} /><RiDeleteBinLine className='rejected supplier' onClick={() => deleteHandler(val._id)} /></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
               {viewData?.length>10 &&  <div className='managersuplier-pagination'>
                      
                      <MdKeyboardArrowLeft onClick={() => paginationPrevHandler(current - 1)}/>
                      <li>{current}</li>
                      <MdKeyboardArrowRight onClick={()=>paginationNextHandler(current+1)}/>
                 
              </div>}
            </div>
        </>
    );
}

export default ManageCategory
