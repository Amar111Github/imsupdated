import React, {useEffect, useState} from 'react';
import { VscGraph } from "react-icons/vsc";
import { MdProductionQuantityLimits } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { GiHandTruck } from "react-icons/gi";
import Chart from "react-apexcharts";
import { FaLongArrowAltRight } from "react-icons/fa";
import axios from 'axios';
import "./mainpage.css"
import { Link } from 'react-router-dom';
import { base_Url } from '../pages/api';

const MainPage = () => {
  const [dataDashboard, setDataDashboard] = useState(null);
  const [lastTranscations, setLastTranscations] = useState(null);
  const [dataxaxis, setdataxaxis] = useState([])
  const [datayaxis, setdatayaxis] = useState([])
  const [data1xaxis, setdata1xaxis] = useState([])
  const [data1yaxis, setdata1yaxis] = useState([])
 const currentDate = new Date();
 
    const formattedDate = currentDate.toISOString().split('T')[0];
    let start =  currentDate.toISOString().split('T')[0].split("-");
    start[2] = start[2]-6;
    let formattedDate1 = start.join("-");
  
    const date = {
      startDate: formattedDate1,
      endDate: formattedDate
    }
    const allInvoice = async () => {
      try {
          const response = await axios.post("http://localhost:8000/invoice/find_product_list", date);
          console.log(response.data.data)
          let xaxis = [];
          let yaxis = [];
     for(let key in response.data.data){
          xaxis.push(key);
          yaxis.push(response.data.data[key])
         
       }
       setdata1xaxis(xaxis);
       setdata1yaxis(yaxis);
       
      } catch (error) {
          console.log(error);
      }
  }
  const allPurchase = async () => {
    try {
      console.log(date);
        const response = await axios.post("http://localhost:8000/product_details/find_product_list", date);
        console.log(response.data.data)
        let xaxis = [];
        let yaxis = [];
   for(let key in response.data.data){
        xaxis.push(key);
        yaxis.push(response.data.data[key])
       
     }
     setdataxaxis(xaxis);
     setdatayaxis(yaxis);
    } catch (error) {
        console.log(error);
    }
}
  const allDashboard = async () => {
    try {
        const response = await axios.get("http://localhost:8000/mainpage");
        console.log(response.data);
        setDataDashboard(response.data)
     
    } catch (error) {
        console.log(error);
    }
}
const lastTranscation = async () => {
  try {
      const response = await axios.get("http://localhost:8000/lastInvoices");
      console.log(response.data.sales);
      setLastTranscations(response.data.sales)
   
  } catch (error) {
      console.log(error);
  }
}

useEffect(() => {
  allDashboard();
  lastTranscation();
  allPurchase();
  allInvoice();
}, []);
const data = {
  options: {
    chart: {
      id: "area",
    },
    colors: ["#0F6060"],
    stroke: {
      width: 3
    },
   
    xaxis: {
      categories: data1xaxis,
      labels: {
        style: {
          fontSize: "14px",
        },
      },
      tooltip: {
        enabled: false
      },
    },
   
    yaxis: {
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 3,
    },
    markers: {
      size: 0,
      hover: {
        size: 6,
        colors: ["#0F6060"]
      },
      shape: 'circle',
    },
    fill: {
      type: "gradient",
      colors: ["#0F6060"],
      gradient: {
        shadeIntensity: 0,
        opacityFrom: 1,
        opacityTo: 0.6,
        stops: [0, 100],
      },
    },
  },

  series: [
    {
      name: "Total No. Of Sales",
      data: data1yaxis,
    },
  ],
};





      const data1 = {
        series: [{
          name: 'Total No. Of Purchase',
          data: datayaxis,
        }],
        options: {
          chart: {
            type: 'pie',
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '40%',
              endingShape: 'rounded',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['#0F6060'],
          },
          xaxis: {
            categories: dataxaxis,
          },
          fill: {
            opacity: 1,
            colors: ["#0F6060"], // Change bar colors
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val;
              },
            },
            markers: {
              colors: "yellow",
            },
          },
        },
      };
    
  

      
   
    
 
  return (
    <div className='mainPage'>
        <div className='cards-container'>
            <div className='dashboard-card'>
                <div className='dashboard-card-icon'>
                    <VscGraph/>
                </div>
                <div className='dashboard-card-stats'>
                   
                    <p>{dataDashboard && dataDashboard.categories}+</p>
                    <h6>Total categories</h6>
                </div>
            </div>
            <div className='dashboard-card purple'>
                <div className='dashboard-card-icon'>
                    <IoPeople/>
                </div>
                <div className='dashboard-card-stats'>
                   
                    <p>{dataDashboard && dataDashboard.customers}+</p>
                    <h6>Total customer</h6>
                </div>
            </div>
            <div className='dashboard-card green'>
                <div className='dashboard-card-icon'>
                    <MdProductionQuantityLimits/>
                </div>
                <div className='dashboard-card-stats'>
                   
                    <p>{dataDashboard && dataDashboard.products}+</p>
                    <h6>Total Product</h6>
                </div>
            </div>
            <div className='dashboard-card pink'>
                <div className='dashboard-card-icon'>
                    <GiHandTruck/>
                </div>
                <div className='dashboard-card-stats'>
                   
                    <p>{dataDashboard && dataDashboard.suppliers}+</p>
                    <h6>Total Supplier</h6>
                </div>
            </div>
           
        </div>
        <div className='dashboard-transcation'>
           
            
            <div className='dashboard-table-container'>
            <div className='dashboard-table-left'>
            <h5>Weekly Shopping Summary</h5>
            <Chart  options={data1.options}  type="bar" series={data1.series}   height="85%"/>
            </div>  
           
            <div className='dashboard-table-right'>
            <h5>Weekly Sale Summary</h5>
            <Chart  options={data.options}  type="area" series={data.series} height="85%"/>
            </div>
            </div>
            <div className='dashboard-table'>
            <div className='dashboard-order'>
                <h5>Recent Orders</h5>
                <p><Link to="/invoice">Go to All Orders<FaLongArrowAltRight/></Link></p>
            </div>
                <table>
                    <thead>
                        <tr>
                            <th >ID</th>
                            <th >Item</th>
                            <th >Qty</th>
                            <th >Date </th>
                            <th >Transaction Amount</th>
                            <th >Status</th>
                        </tr>
                    </thead>
                    <tbody>
                      {lastTranscations && lastTranscations.map((val)=>{
                        return   <tr>
                        <td style={{color:"#03022980"}}>{val.purchase_no}</td>
                        <td style={{color:"black"}}>{val.product_Name}</td>
                        <td style={{color:"black"}}>{val.noOfUnit}</td>
                        <td style={{color:"#03022980"}}>{val.date}</td>
                        <td style={{color:"#3C3C3C"}}>{val.totalPrice}</td>
                      
                        <td ><p  className={val.status==="Approved"?"approve":val.status==="Rejected"?"reject":"pending"} >{val.status}</p></td>
                    </tr>
                      })}
                      
                     
                       
                    </tbody>
                </table>
            </div>
        </div>
      
    </div>
  )
}

export default MainPage
