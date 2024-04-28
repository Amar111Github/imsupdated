import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { base_Url } from '../pages/api';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './purchaseForm.css';

const InvoiceForm = ({ setFormToggle, allPurchase, invoice }) => {

  let rray ;
  if(invoice.length>0){
    rray = invoice[0].purchase_no.split("-")[1];
  }else{
    rray= 0;
  }

let purchaseNo = `KASP-${+rray+1}`;
  console.log(purchaseNo)
  const generate = uuidv4();
  const [allCustomers, setAllCustomers] = useState(null);
  const [allCustomersName, setAllCustomersName] = useState(null);
  const [tax, setTax] = useState(null);
  const [product, setProduct] = useState("");
  const [paymentMode, setPaymentMode] = useState("")
  const [payment, setPayment] = useState("");
  const [batches, setBatches] = useState(null);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [initialData, setInitialData] = useState(null);
    const currentDate = new Date();
 
    const formattedDate = currentDate.toISOString().split('T')[0];
  

 
  const [data, setData] = useState({
    id: generate,
    date: formattedDate,
    purchase_no: purchaseNo,
    dispatchNo: "",
    product : [],
    customer_email: '',
    customer_detail: '',
    payments:[],
    paidStatus: "",
    dueAmount:"",
    paymentDue: "",
    dispatchThrough: "",
    paidAmount: "",
    totalPrice: 0,
    status: "Approved"
  });


  const [productDetails, setProductDetails] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // for testing
  const [purchase, setPurchase] = useState(null);
  const [sale, setSale] =useState(null)
  const allProduct = async () => {
    try {
        const response = await axios.post("http://localhost:8000/product/all_product");
        setProductDetails(response.data.result)
    } catch (error) {
        console.log(error);
    }
  }
  const purchaseFormHandler = async (arr) => {
    try {
    
      const response = await axios.post("http://localhost:8000/invoice/invoices", [arr]);
      alert('Purchase Request done Successfully');
      setFormToggle(false);
      allPurchase();
      localStorage.removeItem('purchase');
    } catch (error) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
  };
  const productId = uuidv4();

  const [productList, setProductList] = useState({
    productId,
    batchNo: "",
    noOfUnit: 0,
    category_name: "",
    product_Name: "",
    hsn: "",
    discount:0, 
    taxName: "",
    taxPer: 0,
    perUnitPrice: 0,
    price: 0
  });

  const filterProducts = (value) => {
    if (value.trim() === '') {
      setFilteredProducts([]);
      return;
    }
    const filtered = productDetails.filter((product) =>
      product.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered.slice(0, 10)); // Limiting to first 10 filtered products
  };
  const allPoductQuantity = async (e) => {
    console.log("hello")
    try {
        const response = await axios.get("http://localhost:8000/noOfUnit/noOfUnit");
        console.log(response.data.data)
      if( Object.keys(response.data.data).length){
        let requiredProduct = Object.entries(response.data.data).filter(([productName, value])=>{
          return productName===e.target.value;
        });
        let filteredquantity = 0;
        let filteredBatch = requiredProduct[0][requiredProduct[0].length-1].filter((val, i)=>{
           return val.quantity>0
        }).map((val)=>{
          filteredquantity+= val.quantity
          return val.batchNo
        })
       
        // setMaxQuantity(filteredquantity)
        setBatches(filteredBatch)
      }
     
//    let filterD=      Object.entries(response.data.data).forEach(([productName, value])=>{
//         if(productName===e.target.value){
//          let val =  value.filter((val)=>{
//            return val.quantity>0
//           })
//           console.log(val)
//           return val
//         }
//         })
// console.log(filterD)
// setBatches(filterD.flat())
        // const transformedObject = getTotalQuantities(response.data.data);
        // setData(transformedObject);
        // setViewData(transformedObject);
    } catch (error) {
        console.log(error);
    }
};
useEffect(()=>{
  // setMaxQuantity(0)
  setProductList({...productList, batchNo:""})
}, [productList.product_Name])

  const productDetailsHandler = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/invoice/invoicesDetails`, data);
      setProduct(response.data.product);
      setProductDetails(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const allTax = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tax/find_tax`);
      setTax(response.data.product);
    } catch (error) {
      console.log(error);
    }
  };


  const allClient = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/client/allCustomer`);
   let customerDetails = response.data.result.map((val)=>{
        return val.customer_email;
      })
      
      setAllCustomersName(customerDetails)
      setAllCustomers(response.data.result);

    } catch (error) {
      console.log('hello');
    }
  };
  function getTotalQuantities(obj) {

    const result = {};
    console.log(obj)
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
    console.log(result)
    return result;
  }
  const bacthWiseQuantity = (input) => {
    const result = {};
    for (const key in input) {
        if (input.hasOwnProperty(key)) {
            result[key] = {};
            input[key].forEach(({ batchNo, quantity }) => {
                result[key][batchNo] = quantity;
            });
        }
    }
    console.log(result)
    return result;
};




  useEffect(() => {
    let arr = [];
    localStorage.setItem('purchase', JSON.stringify(arr));
  }, []);

  useEffect(() => {
    allProduct();
    allClient();
    allTax();
    allUnits();
  }, []);

 


  const calculateTotalPrice = () => {
    let price = (+productList.noOfUnit * +productList.perUnitPrice);
    console.log(productList)
    let totalPrice = price;
    console.log(productList.taxPer,productList.discount)
    if (productList.taxPer !== "" && productList.discount!==0) {
      const disount = Math.floor(price*productList.discount/100);
      price -= disount;
      console.log(price)
      const taxAmount = Math.floor(price * (+productList.taxPer) / 100);
     
      totalPrice = taxAmount+price;
      console.log(taxAmount,totalPrice )
    }else if(productList.taxPer !== "" ){
      const taxAmount = Math.floor(price * (+productList.taxPer) / 100);
      totalPrice += taxAmount;
    }
  
    setProductList(prev => ({ ...prev, price:Math.abs(totalPrice) }));
  };

  
  useEffect(() => {
    calculateTotalPrice();
  }, [productList.perUnitPrice, productList.noOfUnit, productList.product_Name, productList.discount]);
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
  
  function groupProductsByBatch(product) {
    const { product_Name, batchNo, noOfUnit: quantity } = product;
    console.log(product_Name, batchNo, quantity )
    const groupedProducts = {};

    if (product_Name in groupedProducts) {
        groupedProducts[product_Name].push({ "batchNo": batchNo, "quantity":quantity });
    } else {
    
  
        groupedProducts[product_Name] = [{ "batchNo": batchNo, "quantity":quantity }];
    
    }
    return groupedProducts;
}
const calculateDifference = (sumpurchaseProducts, sumsoldProducts) => {
  const soldObject = {};
  const purchaseObject={};
console.log("purchase",sumpurchaseProducts,"sold",sumsoldProducts)
  Object.keys(sumpurchaseProducts).forEach((productName) => {
      let purchaseQuantities = [...sumpurchaseProducts[productName]];
 
      const soldProducts = sumsoldProducts[productName] || [];
      let soldBatches = soldProducts;
      

      let purchaseQuantitiesCopy = [soldBatches,purchaseQuantities];

    
for(let i = 0;i<purchaseQuantitiesCopy[0].length; i++){
  for(let j=purchaseQuantitiesCopy[1].length-1; j>=0;j--){
      if(purchaseQuantitiesCopy[0][i].batchNo===purchaseQuantitiesCopy[1][j].batchNo){
         
          if(purchaseQuantitiesCopy[0][i].quantity<=purchaseQuantitiesCopy[1][j].quantity){
              purchaseQuantitiesCopy[1][j].quantity = purchaseQuantitiesCopy[1][j].quantity-purchaseQuantitiesCopy[0][i].quantity;
            
            
                  // console.log(purchaseQuantities[j]["profit"])
              purchaseQuantitiesCopy[0][i].quantity=0;

          }
      }
  }
 }
 soldBatches = purchaseQuantitiesCopy[0];
 purchaseQuantities = purchaseQuantitiesCopy[1]

      soldObject[productName] = purchaseQuantitiesCopy[0];
      purchaseObject[productName] = purchaseQuantitiesCopy[1];
  });


  return {soldObject,purchaseObject};
};
function calculateFinalDifference(sumpurchaseProducts, sumsoldProducts) {
  const differenceObject = {};
console.log(sumpurchaseProducts,sumsoldProducts)
  Object.keys(sumpurchaseProducts).forEach((productName) => {
      const purchaseQuantities = [...sumpurchaseProducts[productName]];
      const soldBatches = sumsoldProducts[productName] || [];
   
      //units and perunit cost is in correct format calculate total cost and than calculate profit;

      for (let j = purchaseQuantities.length - 1; j >= 0; j--) {
         
          for (let i = 0; i < soldBatches.length; i++) {
              
              if (purchaseQuantities[j].quantity >= soldBatches[i].quantity) {
               
               
                  purchaseQuantities[j].quantity -= soldBatches[i].quantity;
              //    console.log("quanity",soldBatches[i].quantity,"purchaseRate",purchaseQuantities[j].perUnitPrice,"soldRate",soldBatches[i].perUnitPrice, "discount",soldBatches[i].discount);
                
                 
                  soldBatches.splice(i, 1);
                  i--;
              } else {
                  soldBatches[i].quantity -= purchaseQuantities[j].quantity;
                 
               
                  purchaseQuantities[j].quantity = 0;
                  break; 
              }
          }
      }

      differenceObject[productName] = purchaseQuantities;
  });

console.log(differenceObject)
  return differenceObject;
}
  const addListHandler =()=>{

    

  
  
    if(data.customer_detail.length<1){
      alert("customer details are incorrect");
      return;
    }else if(productList.category_name
      === undefined){
      alert("product details are incorrect");
      return;}
    else if(productList.noOfUnit>maxQuantity){
    
      alert("quanity is more than in stock");
      return;
    }
   
      if(data.customer_email && productList.product_Name &&
        productList.perUnitPrice &&
        productList.noOfUnit  
      ){
        console.log(data)
      let arr = JSON.parse(localStorage.getItem("purchase"));
      
   
    if(arr.length<1){
      data.product.unshift(productList);
    
      let invoice = groupProductsByBatch(productList);
      let {soldObject,purchaseObject} = calculateDifference(purchase,invoice)
     let purchased= calculateFinalDifference(purchaseObject,soldObject);
      console.log(purchased)
      arr.unshift(data);
      localStorage.setItem("purchase", JSON.stringify(arr));
      totalPriceCalculator()
    
    }else{
      arr[arr.length-1].product.unshift(productList);
     
      let invoice = groupProductsByBatch(productList);
   let {soldObject,purchaseObject} = calculateDifference(purchase,invoice)
     let purchased= calculateFinalDifference(purchaseObject,soldObject);
     console.log(purchased)
      localStorage.setItem("purchase", JSON.stringify(arr));
      totalPriceCalculator()
    }
    setMaxQuantity(0)
      setData(
        {
          id: data.id,
          date: data.date,
          purchase_no: data.purchase_no,
          dispatchNo: "",
          product : [],
          customer_email: data.customer_email,
          customer_detail: data.customer_detail,
          payments:[],
          paidStatus: "",
          dueAmount:"",
          paymentDue: "",
          dispatchThrough: "",
          paidAmount: "",
          totalPrice: 0,
          status: "Approved"
        }
      )
      const productId = uuidv4();
      setProductList(
        {
          productId,
          batchNo:  "",
          noOfUnit: "",
          category_name: "",
          product_Name: "",
          hsn: "",
          discount:0, 
          taxName: "",
          taxPer: "",
          perUnitPrice: "",
          price: 0
        
      })
    setBatches(null)
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

  const blurHandler = (mail) => {
    let clientInfo = allCustomers.filter((val) => {
      return val.customer_email === mail;
    });

    setData((prev) => ({ ...prev, customer_detail: clientInfo }));
  };


  const deleteHandler = (index) => {
    let arr = JSON.parse(localStorage.getItem("purchase"));
   if(arr[0].product.length===1){
    arr[0].totalPrice =0;
   }
    arr[0].product.splice(index, 1);


    setData({
      id: data.id,
      date: data.date,
      purchase_no: data.purchase_no,
      product : [...arr[0].product],
      customer_email: data.customer_email,
      customer_detail: data.customer_detail,
      totalPrice: 0,
      status: "Approved",
      dispatchNo: "", 
      payments:[],
      paidStatus: "",
      dueAmount:"",
      paymentDue: "",
      dispatchThrough: "",
      paidAmount: "",
    });
    localStorage.setItem("purchase", JSON.stringify(arr));
totalPriceCalculator();
  };

  const purchaseHandler = ()=>{

  
    if(payment.paidStatus==="unpaid"){
      {
        payment.payments= [];
      }
    }else{
      payment.payments.push({amount:payment.paidAmount, paymentMode})
    }
  
    purchaseFormHandler(payment);

  console.log(payment)
  
  
      
      setData({
      id: generate,
      date:formattedDate,
      purchase_no: "",
      product : [],
      customer_email : "",
      customer_detail: "",
      payments:[],
      dispatchNo:"",
      paidStatus: "",
      dueAmount:"",
      paymentDue: "",
      dispatchThrough: "",
      paidAmount: "",
      totalPrice: 0,
      status: "Approved"
  })
    
  }

  let arr = JSON.parse(localStorage.getItem('purchase'));
  const clientHandler = (e)=>{
    if(e.type==="click"){
      console.log(e.target.textContent)
       let customerInfo=  allCustomers.filter((val)=>{
      return val.customer_email ===e.target.textContent
     });
     

  
      setData({...data, customer_email:e.target.textContent, customer_detail:customerInfo})
    }else if(e.type==="change"){
     
      let customerInfo=  allCustomers.filter((val)=>{
        return val.customer_email ===e.target.value
       });
      
      
      
      setData({...data, customer_email:e.target.value, customer_detail:customerInfo})
    }
    }

  const productHandler = (e)=>{
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
  useEffect(() => {
    if (payment.paidStatus === 'paid') {
      setPayment((prev) => ({ ...prev, paidAmount: payment.totalPrice, dueAmount: 0, paymentDue: "" }));
    } else if (payment.paidStatus === 'unpaid') {
      setPayment((prev) => ({ ...prev, paidAmount: 0, dueAmount: payment.totalPrice }));
    } else if (payment.paidStatus === 'partiallyPaid') {
      setPayment((prev) => ({ ...prev, dueAmount: payment.totalPrice - payment.paidAmount }));
    }
  }, [payment.paidStatus, payment.paidAmount]);
const batchUnits = async (e)=>{
  if(e.type==="click"){
    console.log(Object.keys(purchase).length)
    
    if( Object.keys(purchase).length && e.target.textContent){
      let requiredProduct = Object.entries(purchase).filter(([productName, value])=>{
        return productName===productList.product_Name;
      });
      
      let filteredquantity = 0;
      if(requiredProduct.length){
        let filteredBatch = requiredProduct[0][requiredProduct[0].length-1].map((val, i)=>{
           
            if(val.quantity>0 && val.batchNo===e.target.textContent){
              filteredquantity+= val.quantity;
              return val.batchNo;
            }

     
       })
      console.log(filteredquantity)
       setMaxQuantity(filteredquantity)
       
      }else{
        setMaxQuantity(0)
       
      }
     
    }
   
  }else if(e.type==="blur"){

    if( Object.keys(purchase).length && e.target.value){
      let requiredProduct = Object.entries(purchase).filter(([productName, value])=>{
        return productName===productList.product_Name;
      });
      console.log(requiredProduct)
      let filteredquantity = 0;
      if(requiredProduct.length){
        let filteredBatch = requiredProduct[0][requiredProduct[0].length-1].map((val, i)=>{
           
            if(val.quantity>0 && val.batchNo===e.target.value){
              filteredquantity+= val.quantity;
              return val.batchNo;
            }

     
       })
      console.log(filteredquantity)
       setMaxQuantity(filteredquantity)
       
      }else{
        setMaxQuantity(0)
       
      }
     
    }
    
  }
 
}


const allUnits = async () => {
  try {
      const response = await axios.get(`http://localhost:8000/noOfUnit/noOfUnit`);
      console.log(response.data.data)
      // localStorage.setItem('purchaseObject', JSON.stringify(arr));
      setPurchase(response.data.data)
      const transformedObject = getTotalQuantities(response.data.data);
   const transformedbatchObject=   bacthWiseQuantity(response.data.data);
   console.log(transformedbatchObject)
      setInitialData(transformedObject);
  
  } catch (error) {
      console.log(error);
  }
};
const unitHandler = (e)=>{

  if(e.type==="click"){
    console.log(Object.keys(purchase).length)
    
    if( Object.keys(purchase).length && e.target.textContent){
      let requiredProduct = Object.entries(purchase).filter(([productName, value])=>{
        return productName===e.target.textContent;
      });
      
      let filteredquantity = 0;
      if(requiredProduct.length){
        let filteredBatch = requiredProduct[0][requiredProduct[0].length-1].filter((val, i)=>{
          return val.quantity>0
       }).map((val)=>{
         filteredquantity+= val.quantity
         return val.batchNo
       })
      console.log(filteredBatch)
       setMaxQuantity(filteredquantity)
       setBatches(filteredBatch)
      }else{
        setMaxQuantity(0)
        setBatches(null)
      }
     
    }
   
  }else if(e.type==="blur"){
    console.log(e.target.value)
    if( Object.keys(purchase).length && e.target.value){
      let requiredProduct = Object.entries(purchase).filter(([productName, value])=>{
        return productName===e.target.value;
      });
      let filteredquantity = 0;
    
      if(requiredProduct.length){
        let filteredBatch = requiredProduct[0][requiredProduct[0].length-1].filter((val, i)=>{
          return val.quantity>0
       }).map((val)=>{
         filteredquantity+= val.quantity
         return val.batchNo
       })
      console.log(filteredBatch)
       setMaxQuantity(filteredquantity)
       setBatches(filteredBatch)
      }else{
        setMaxQuantity(0)
        setBatches(null)
      }
     
    }
    
  }
}

  return (
    <div className='purchase_form-container'>
      <div className='purchase_form'>
        <div className='suplierform-heading'>
          <h4>Add  Invoice</h4>
          <div className='suplierform-closing'>
            <IoCloseOutline onClick={() => {setFormToggle(false); }} />
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

            
            <label htmlFor='supplierName'>Customer Email</label>
           <div className='search-container'>
            <div className='search-inner'>
              <input type='text' value={data.customer_email} placeholder='customer Email' disabled = {arr && arr.length>0  ?true: false}  onChange={(e)=>clientHandler(e)} />

            </div>
            <div className='dropdown'>
              {allCustomersName && allCustomersName.filter((val)=>{
                
                const searchItem = data.customer_email.toLowerCase();
      
                const customerEmail = val.toLowerCase();
                return searchItem &&  customerEmail.startsWith(searchItem) && customerEmail!==searchItem;
              }).map((val)=>{
                return <div className='dropdown-row' onClick={(e) => clientHandler(e)}>{val}</div>
              })}
            </div>
           </div>
        
            </div>
            </div>
            <div className='purchase-form-inputs_container-product invoices'>
            <div className='label-container'>
            <label htmlFor='productName'>Product Name</label>
           
            <div className='search-container'   >
            <div className='search-inner'>
              <input type='text' value={productList.product_Name} placeholder='Product Name'  onChange={(e)=>productHandler(e)} onBlur={(e)=>unitHandler(e)} />
            </div>
            <div className='dropdown '>
            {productDetails && productDetails.filter((val) => {
              
  const searchItem = productList.product_Name ? productList.product_Name.toLowerCase() : '';
  const productName = val.product_Name.toLowerCase();
  return searchItem && productName.startsWith(searchItem) && productName !== searchItem;
}).map((val) => {

  return <div className='dropdown-row product' onClick={(e) => (productHandler(e),unitHandler(e))}>{val.product_Name}</div>
})}
            </div>
           </div>
           </div>
           <div className='label-container'>
  <label htmlFor='batchNo'>Batch</label>
  <div className='search-container'>
   
      <React.Fragment>
        <div className='search-inner'>
          <input
            type='text'
            value={productList.batchNo}
            placeholder='Batch No'
            onChange={(e) => { setProductList((prev) => ({ ...prev, batchNo: e.target.value })) }}
            onBlur={(e)=>batchUnits(e)}
          />
        </div>
        {batches && batches.length > 0 && (  <div className='dropdown'>
          {batches.filter((val) => {
              
              const searchItem = productList.batchNo ? productList.batchNo.toLowerCase() : '';
              const batchName = val;
             
              return batchName && batchName.startsWith(searchItem) && batchName !== searchItem;
            }).map((val) => (
             
            val  && (
              
              <div className='dropdown-row product' key={val} onClick={(e) =>  (setProductList((prev) => ({ ...prev, batchNo: val})),batchUnits(e) )}  >
                {val}
              </div>
            )
          ))}
        </div> )}
      </React.Fragment>
   
  </div>
</div>
           
            <div className='label-container '>
              
           
            <label htmlFor='noOfUnit'>No of Unit-<span className='max_quantity'> max {`(${maxQuantity})`}</span></label>
            <input type='number' placeholder='No of Unit' min={0} max={maxQuantity} id='noOfUnit' value={productList.noOfUnit} onChange={(e) => {setProductList((prev) => ({ ...prev, noOfUnit: Math.abs(e.target.value), price: Math.abs(e.target.value * productList.perUnitPrice )}))}} />
            </div>
            <div className='label-container'>
            <label htmlFor='UnitPerPrice'>unit Per Price</label>
            <input type='number' placeholder='unit per Price' id='UnitPerPrice'  value={productList.perUnitPrice} onChange={(e) => {setProductList((prev) => ({ ...prev, perUnitPrice: Math.abs(e.target.value), price: Math.abs(productList.noOfUnit * e.target.value) }))}} />
            </div>
            <div className='label-container'>
            <label htmlFor='discount'>Discount (%)</label>
            <input type='number' placeholder='Discount' id='discount'  value={productList.discount} onChange={(e) => {setProductList((prev) => ({ ...prev, discount: Math.abs(e.target.value), price: Math.abs(productList.noOfUnit * productList.perUnitPrice + (((productList.noOfUnit * productList.perUnitPrice)*e.target.value)/100)) }))}} />
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
            onClick={() => deleteHandler(i)}
          />
        </td>
    
    </tr>
  ))}

                        </tbody>
                    </table>
          </div>
          {arr && arr.length>0 && arr[0].product.length>0 && <div className='total-container'>
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
        
           </div>
        
        <button type='button' onClick={purchaseHandler}>Checkout</button>

      </div>
    </div>
  )
}

export default InvoiceForm;




