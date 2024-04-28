import React, {useEffect, useState} from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { base_Url } from '../pages/api';
import { v4 as uuidv4 } from 'uuid';
import "./purchaseForm.css"
import { RiDeleteBinLine } from "react-icons/ri";
import axios from 'axios';

const PurchaseForm = ({setFormToggle,allPurchase, todayBatch, purchase }) => {
console.log(purchase)
  let rray ;
  if(purchase.length>0){
    rray = purchase[0].purchase_no.split("-")[1];
  }else{
    rray= 0;
  }
  useEffect(() => {

    const arr = [];

    localStorage.setItem("purchase", JSON.stringify(arr));
  }, []);

let purchaseNo = `KASP-${+rray+1}`;
console.log(purchaseNo)

const generate = uuidv4();
const currentDate = new Date();
 
    const formattedDate = currentDate.toISOString().split('T')[0];
    console.log(formattedDate)
  const [data, setData] = useState({
    id: generate,
    date:formattedDate,
    purchase_no: purchaseNo,
    dispatchNo: "",
    product : [],
    suplire_Email : "",
    supplierDetail: "",
    payments:[],
    paidStatus: "",
    dueAmount:"",
    paymentDue: "",
    dispatchThrough: "",
    paidAmount: "",
    totalPrice: 0,
    status: "Pending"
});



const [supplierDetails, setSupplierDetails] = useState("");
const productId = uuidv4();
let batchNo = `${formattedDate}-${todayBatch+1}`;
const [productList, setProductList] = useState({
  productId,
  batchNo,
  noOfUnit: "",
  category_name: "",
  product_Name: "",
  hsn: "",
  taxName: "",
  taxPer: "",
  perUnitPrice: "",
  price: 0
});
const [productDetails, setProductDetails] = useState("");
const [supplierData, setSupplierData] = useState("");

const [payment, setPayment] = useState("")
const [product, setProduct] = useState("");
const [paymentMode, setPaymentMode] = useState("")
const allProduct = async () => {
  try {
      const response = await axios.post("http://localhost:8000/product/all_product");
      console.log(response.data.result)
     
      setProductDetails(response.data.result)
  } catch (error) {
      console.log(error);
  }
}



const purchaseFormHandler=async (arr)=>{
  try{
    
    console.log(arr)

        const response = await axios.post("http://localhost:8000/product_details/product", [arr]);
        console.log(response);
        alert("purchase Request done Successfully");
        setFormToggle(false);
        allPurchase();
        localStorage.removeItem("purchase");
      
  
   
    
  }catch(error){
    alert(error.response.data.message)
  }
 
}

const supplierDetailsHandler = async()=>{
   
  try{
    const response = await   axios.get("http://localhost:8000/product/category_Supplire");


    setSupplierDetails(response.data.suppliers);
 
  
  }catch(error){
      console.log(error)
  }
}


const productDetailsHandler = async ()=>{
  try{
    const response = await axios.post("http://localhost:8000/product_details/productsDetails", data);


  }catch(error){
    console.log(error)

  }
 
}
const totalPriceCalculator = ()=>{

  let arr = JSON.parse(localStorage.getItem("purchase"));
  if(arr.length<1) return;
  if(arr[0].product.length===1){
    arr[0].totalPrice = arr[0].product[0].price;
    setPayment(...arr)
 
    localStorage.setItem("purchase", JSON.stringify(arr));
  }else if(arr[0].product.length>1){
    let total = arr[0].product.reduce((h1,h2)=>{
     return h1+h2.price
    },0);

    arr[0].totalPrice = total;
    setPayment(...arr)
 
    localStorage.setItem("purchase", JSON.stringify(arr));
  }


}


const allSupplier = async () => {
  try {
      const response = await axios.get("http://localhost:8000/supplier/find_supplire");
      console.log(response.data.product)
      setSupplierData(response.data.product)
   
  } catch (error) {
      console.log(error);
  }
}

const calculateTotalPrice = () => {
  const price = (+productList.noOfUnit * +productList.perUnitPrice);
  console.log(productList)
  let totalPrice = price;

  if (productList.taxPer !== "") {
    const taxAmount = Math.floor(price * (+productList.taxPer) / 100);
    totalPrice += taxAmount;
  }

  setProductList(prev => ({ ...prev, price:Math.abs(totalPrice) }));
};


useEffect(() => {
  calculateTotalPrice();
}, [productList.perUnitPrice, productList.noOfUnit, productList.product_Name]);
useEffect(()=>{
  supplierDetailsHandler();
  allSupplier();
  allProduct();
},[])

const purchaseHandler = ()=>{

  // let arr = JSON.parse(localStorage.getItem("purchase"));
  if(payment.paidStatus==="unpaid"){
    {
      payment.payments= [];
    }
  }else{
    payment.payments.push({amount:payment.paidAmount, paymentMode})
  }

  purchaseFormHandler(payment);
//  if(payment){
//   payment.payments.push({amount:payment.paidAmount, paymentMode})
//  }
console.log(payment)
  // if (
  //  arr.length>0
  // ) {
  //  console.log(arr)
  //   purchaseFormHandler();

    
    setData({
    id: generate,
    date:formattedDate,
    purchase_no: "",
    product : [],
    suplire_Email : "",
    supplierDetail: "",
    payments:[],
    dispatchNo:"",
    paidStatus: "",
    dueAmount:"",
    paymentDue: "",
    dispatchThrough: "",
    paidAmount: "",
    totalPrice: 0,
    status: "Pending"
})
  // } 
}

const deleteHandler=(item,index)=>{
  let arr = JSON.parse(localStorage.getItem("purchase"));
  if(arr[0].product.length===1){
    arr[0].totalPrice =0;
   }
   

  arr[0].product.splice(index, 1);
  let dat =  parseInt(item.batchNo.split("-")[3]);
 let arr2=  arr[0].product.map((val)=>{

      if(parseInt(val.batchNo.split("-")[3])>dat){
        let batch = val.batchNo.split("-");
       
        let newBatchNo = parseInt(batch[3])-1;
        batch.pop();
        batch.push(newBatchNo)
  
       val.batchNo = batch.join("-");
      
      }
      return val
    

    })

  localStorage.setItem("purchase", JSON.stringify(arr));
  totalPriceCalculator()
  setData(
    {
      id: data.id,
      date: data.date,
      purchase_no: data.purchase_no,
      suplire_Email : data.suplire_Email,
      supplierDetail: data.supplierDetail,
      product : [...arr[0].product],
      totalPrice: 0,
      status: "Pending"
  }
  )
  setProductList(
    {
      productId,
      batchNo:  `${formattedDate}-${--productList.batchNo.split("-")[3]}`,
      noOfUnit: "",
      category_name: "",
      product_Name: "",
      hsn: "",
      taxName: "",
      taxPer: "",
      perUnitPrice: "",
      price: 0
    
  })

}

const supplierHandler = (e)=>{
if(e.type==="click"){
  console.log(e.target.textContent)
   let supplierInfo=  supplierData.filter((val)=>{
  return val.suplierEmail ===e.target.textContent
 });
 let product = productDetails.filter((val)=>{
  return val.suplire_Email===e.target.textContent;
 })
 setProductList({...productList, product_Name:""})
 setProduct(product)

  setData({...data, suplire_Email:e.target.textContent, supplierDetail:supplierInfo})
}else if(e.type==="change"){
  
  let supplierInfo=  supplierData.filter((val)=>{
    return val.suplierEmail ===e.target.value
   });
   let product = productDetails.filter((val)=>{
    return val.suplire_Email===e.target.textContent;
   });
   setProductList({...productList, product_Name:""})
   setProduct(product)
  setData({...data, suplire_Email:e.target.value, supplierDetail:supplierInfo})
}
}

const productHandler = (e) => {

if(e.type==="click"){
  console.log(e.target.textContent)
   let selectedProduct=  productDetails.filter((val)=>{
  return val.product_Name ===e.target.textContent
 });
 
 console.log(selectedProduct[0])
 setProductList({
    ...productList,
    product_Name: e.target.textContent,
    category_name: selectedProduct[0].category_name,
    taxName: selectedProduct[0].taxName,
    taxPer: selectedProduct[0].taxPer,
    hsn: selectedProduct[0].hsn
  });
}else if(e.type==="change"){
  console.log("chnage");
  let selectedProduct=  productDetails.filter((val)=>{
    return val.product_Name ===e.target.value
   });
if(selectedProduct.length>0){
  setProductList({
    ...productList,
    product_Name: e.target.value,
    category_name: selectedProduct[0].category_name,
    taxName: selectedProduct[0].taxName,
    taxPer: selectedProduct[0].taxPer,
    hsn: selectedProduct[0].hsn
  });
}else{
  setProductList({
    ...productList,
    product_Name: e.target.value,
    category_name: selectedProduct.category_name,
    taxName: selectedProduct.taxName,
    taxPer: selectedProduct.taxPer,
    hsn: selectedProduct.hsn
  });
}
  
}
}

const addListHandler =()=>{
console.log(productList)
if(data.supplierDetail.length<1){
  alert("supplier details are incorrect");
  return;
}else if(productList.category_name
  === undefined){
  alert("product details are incorrect");
  return;
}
  if(data.suplire_Email && productList.product_Name &&
    productList.perUnitPrice &&
    productList.noOfUnit  
  ){
    
  let arr = JSON.parse(localStorage.getItem("purchase"));
  console.log(data)
if(arr.length<1){
  data.product.unshift(productList)
  arr.unshift(data);
  localStorage.setItem("purchase", JSON.stringify(arr));
  totalPriceCalculator()

}else{
  arr[arr.length-1].product.unshift(productList);
  localStorage.setItem("purchase", JSON.stringify(arr));
  totalPriceCalculator()
}

  setData(
    {
      id: data.id,
      date: data.date,
      purchase_no: data.purchase_no,
      suplire_Email : data.suplire_Email,
      supplierDetail: data.supplierDetail,
      product : [],
      totalPrice: 0,
      paidStatus: "",
    payments: [],
    dispatchNo:"",
    paymentDue: "",
    dispatchThrough: "",
    paidAmount: "",
    status: "Pending"
  }
  )
  const productId = uuidv4();
  setProductList(
    {
      productId,
      batchNo:  `${formattedDate}-${++productList.batchNo.split("-")[3]}`,
      noOfUnit: "",
      category_name: "",
      product_Name: "",
      hsn: "",
      taxName: "",
      taxPer: "",
      perUnitPrice: "",
      price: 0
    
  })

}else {
  if (!data.date) {
    alert('Please select date');
  } else if (!data.purchase_no) {
    alert('Please enter the purchase no.');
  } else if (!data.suplire_Email) {
    alert('Please enter a Supplier Name');
  }
 
} 
}
const [show, setShwow] = useState(false)
const foucsHandler = ()=>{
  setShwow(true)
}
const blurHandler = ()=>{
  setShwow(false)
}



useEffect(() => {
  if (payment.paidStatus === 'paid') {
    setPayment((prev) => ({ ...prev, paidAmount: payment.totalPrice, dueAmount: 0, paymentDue: "" }));
  } else if (payment.paidStatus === 'unpaid') {
    setPayment((prev) => ({ ...prev, paidAmount: 0, dueAmount: payment.totalPrice }));
  } else if (payment.paidStatus === 'partiallyPaid') {
    setPayment((prev) => ({ ...prev, dueAmount: payment.totalPrice - payment.paidAmount }));
  }
}, [payment.paidStatus, payment.paidAmount]);
let arr = JSON.parse(localStorage.getItem("purchase"));
console.log(supplierDetails ,data)
  return (
   
      <div className='purchase_form-container'>
         <div className='purchase_form'>
           <div className='suplierform-heading'>
                <h4>Add  Product</h4>
                <div className='suplierform-closing'>
                    <IoCloseOutline onClick={()=>{setFormToggle(false); }}/>
                </div>
            </div>
           <div className='purchase-form-inputs_container'>
           <div className='purchase-form-inputs_container-prod'>
           <div className='label-container'>       
<label htmlFor='supplierName'>Purchase No</label>
<div className='search-container'>
<div className='search-inner'>
  <input type='text' value={data.purchase_no}  disabled />

</div>

</div>

</div>
<div className='label-container'>       
<label htmlFor='supplierName'>Date</label>
<div className='search-container'>
<div className='search-inner'>
  <input type='text' value={data.date}  disabled />

</div>

</div>

</div>
            <div className='label-container'>

            
            <label htmlFor='supplierName'>Supplier Email</label>
           <div className='search-container'>
            <div className='search-inner'>
              <input type='text' value={data.suplire_Email} placeholder='Supplier Email' disabled = {arr && arr.length>0  ?true: false}  onChange={(e)=>supplierHandler(e)} />

            </div>
            <div className='dropdown'>
              {supplierDetails && supplierDetails.filter((val)=>{
            
                const searchItem = data.suplire_Email.toLowerCase();
      
                const supplierEmail = val.toLowerCase();
                return searchItem &&  supplierEmail.startsWith(searchItem) && supplierEmail!==searchItem;
              }).map((val)=>{
                return <div className='dropdown-row' onClick={(e) => supplierHandler(e)}>{val}</div>
              })}
            </div>
           </div>
        
            </div>
            </div>
            <div className='purchase-form-inputs_container-product'>
            <div className='label-container'>
            <label htmlFor='productName'>Product Name</label>
           
            <div className='search-container' onFocus={foucsHandler}  >
            <div className='search-inner'>
              <input type='text' value={productList.product_Name} placeholder='Product Name'  onChange={(e)=>productHandler(e)}/>

            </div>
            <div className='dropdown '>
            {product && show && product.filter((val) => {
              
  const searchItem = productList.product_Name ? productList.product_Name.toLowerCase() : '';
  const productName = val.product_Name.toLowerCase();
  return searchItem && productName.startsWith(searchItem) && productName !== searchItem;
}).map((val) => {

  return <div className='dropdown-row product' onClick={(e) => productHandler(e)}>{val.product_Name}</div>
})}
            </div>
           </div>
           </div>
            <div className='label-container'>
              
           
            <label htmlFor='noOfUnit'>No of Unit</label>
            <input type='number' placeholder='No of Unit' id='noOfUnit' value={productList.noOfUnit} onChange={(e) => {setProductList((prev) => ({ ...prev, noOfUnit: Math.abs(e.target.value), price: Math.abs(e.target.value * productList.perUnitPrice )}))}} />
            </div>
            <div className='label-container'>
            <label htmlFor='UnitPerPrice'>unit Per Price</label>
            <input type='number' placeholder='unit per Price' id='UnitPerPrice'  value={productList.perUnitPrice} onChange={(e) => {setProductList((prev) => ({ ...prev, perUnitPrice: Math.abs(e.target.value), price: Math.abs(productList.noOfUnit * e.target.value) }))}} />
            </div>
            <div className='label-container'>
            <label htmlFor='price'>Price</label>
            <input type='number' placeholder='Price' disabled id='price' value={productList.price} />
            </div>
            <button type='button' className='addButton' onClick={addListHandler}>add</button>
           </div>
          
           </div>
           
           <div className='managersuplier-table'>
                    <table>
                        <thead>
                            <tr>
                            <th style={{ width: '20px' }}>S No.</th>
                            <th style={{ width: '130px' }}>Product Name</th>
                                <th style={{ width: '150px' }}>Category</th>
                                <th style={{ width: '150px' }}>Batch No</th>
                                <th style={{ width: '80px' }}>Hsn</th>
                                <th style={{ width: '50px' }}>QTY</th>
                               
                                <th style={{ width: '100px' }}>Unit/cost</th>
                                <th style={{ width: '80px' }}>Tax</th>
                                <th style={{ width: '80px' }}>Cost</th>
                                <th style={{ width: '80px' }}>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                        {arr && arr.length>0 && arr[0].product.map((val, i) => (
    <tr key={i}>
      <td>{i + 1}</td>
      <td>{val.product_Name}</td>
      <td>{val.category_name}</td>
      <td>{val.batchNo}</td>
      <td>{val.hsn}</td>
      <td>{val.noOfUnit}</td>
      <td>{val.perUnitPrice}</td>
      <td>{val.taxName}-{val.taxPer}%</td>
      <td>{val.price}</td>
      
    

        <td>
          <RiDeleteBinLine
            className="reject"
            onClick={() => deleteHandler(val,i)}
          />
        </td>
    
    </tr>
  ))}

                        </tbody>
                    </table>
          </div>
        {arr &&  arr.length>0 && arr[0].product.length>0  && <div className='total-container'>
         <div className='label-container'>       
<label >Total Price</label>
<div className='search-container'>
<div className='search-inner'>
  <input type='text' value={`₹ ${arr[0].totalPrice}`}  disabled />

</div>

</div>

</div>
         </div> } 
         {/* page two */}
         <div className='purchase-form-inputs_container payment'>
           <div className='purchase-form-inputs_container-products'>
           <div className='label-container'>   
           <label htmlFor='paidStatus'>Paid Status</label>    
           <select id='paidStatus' value={payment.paidStatus} onChange={(e) => setPayment({...payment, paidStatus:e.target.value})}>
          <option value="" disabled>Paid Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">UnPaid</option>
            <option value="partiallyPaid">Partially Paid</option>
          </select>

</div>

            <div className='label-container'>

            <label htmlFor='paidAmount'>Paid Amount</label>
          <input type='number' placeholder='Paid Amount' id='paidAmount' disabled={payment.paidStatus === "paid" || payment.paidStatus === "unpaid" ? true : false} value={payment.paidStatus === "paid" ? payment.totalPrice :
            payment.paidStatus === "unpaid" ? 0:
            payment.paidStatus === "partiallyPaid" ? (payment.paidAmount):(payment.paidAmount)} onChange={(e) => { setPayment((prev) => ({ ...prev, paidAmount: e.target.value})) }} />
        
        
            </div>
            <div className='label-container'>
            <label htmlFor='dueAmount'>Due Amount</label>
          <input
            type='number'
            placeholder='Due Amount'
            id='dueAmount'
            value={
              payment.paidStatus === "paid" ? 0 :
              payment.paidStatus === "unpaid" ? payment.totalPrice :
                payment.paidStatus === "partiallyPaid" ? (payment.totalPrice - +payment.paidAmount) :
                    ""
            }
            disabled={true}
            onChange={(e) => {
              setPayment((prev) => ({ ...prev, dueAmount: e.target.value }))
            }}
            
          />
            </div>
            <div className='label-container'>       
<label htmlFor='supplierName'>Due Date</label>
<div className='search-container'>
<div className='search-inner'>
  <input disabled={payment.paidStatus==="paid"?true:false} type='date' value={payment.paymentDue}   onChange={(e)=>setPayment({...payment, paymentDue: e.target.value})} />

</div>

</div>

</div>
<div className='label-container'>       
<label htmlFor='supplierName'>Payment Mode</label>
<div className='search-container'>
<div className='search-inner'>
  <input placeholder='Payment Mode' disabled={payment.paidStatus==="unpaid"?true:false} type='text' value={paymentMode}   onChange={(e)=>setPaymentMode(e.target.value)} />

</div>

</div>

</div>
<div className='label-container'>       
<label htmlFor='supplierName'>Shipped By</label>
<div className='search-container'>
<div className='search-inner'>
  <input placeholder='Shipped By'  type='text' value={payment.dispatchThrough}   onChange={(e)=>setPayment({...payment, dispatchThrough: e.target.value})} />

</div>

</div>

</div>
<div className='label-container'>       
<label htmlFor='supplierName'>Despatch Doc No.</label>
<div className='search-container'>
<div className='search-inner'>
  <input placeholder='Shipped By'  type='text' value={payment.dispatchNo}   onChange={(e)=>setPayment({...payment, dispatchNo: e.target.value})} />

</div>

</div>

</div>
            </div>
            {/* <div className='purchase-form-inputs_container-product'>
            <div className='label-container'>
            <label htmlFor='productName'>Product Name</label>
           
            <div className='search-container' onFocus={foucsHandler}  >
            <div className='search-inner'>
              <input type='text' value={productList.product_Name} placeholder='Product Name'  onChange={(e)=>productHandler(e)}/>

            </div>
            <div className='dropdown '>
            {product && show && product.filter((val) => {
              
  const searchItem = productList.product_Name ? productList.product_Name.toLowerCase() : '';
  const productName = val.product_Name.toLowerCase();
  return productName.startsWith(searchItem) && productName !== searchItem;
}).map((val) => {

  return <div className='dropdown-row product' onClick={(e) => productHandler(e)}>{val.product_Name}</div>
})}
            </div>
           </div>
           </div>
            <div className='label-container'>
              
           
            <label htmlFor='noOfUnit'>No of Unit</label>
            <input type='number' placeholder='No of Unit' id='noOfUnit' value={productList.noOfUnit} onChange={(e) => {setProductList((prev) => ({ ...prev, noOfUnit: Math.abs(e.target.value), price: Math.abs(e.target.value * productList.perUnitPrice )}))}} />
            </div>
            <div className='label-container'>
            <label htmlFor='UnitPerPrice'>unit Per Price</label>
            <input type='number' placeholder='unit per Price' id='UnitPerPrice'  value={productList.perUnitPrice} onChange={(e) => {setProductList((prev) => ({ ...prev, perUnitPrice: Math.abs(e.target.value), price: Math.abs(productList.noOfUnit * e.target.value) }))}} />
            </div>
            <div className='label-container'>
            <label htmlFor='price'>Price</label>
            <input type='number' placeholder='Price' disabled id='price' value={productList.price} />
            </div>
            <button type='button' className='addButton' onClick={addListHandler}>add</button>
           </div> */}
          
           </div>
           
                 <button type='button' onClick={purchaseHandler}>Purchase</button>
         </div>
        
    </div>
  )
}

export default PurchaseForm
