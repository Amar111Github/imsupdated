const purchaseProductsModule = require("../moduls/productDetails");
const soldProductsModule = require("../moduls/invoiceModule");

const dataInfo = async (req, res) => {
    try {
        const purchaseProducts = await purchaseProductsModule.find({});
        const soldProducts = await soldProductsModule.find({});
          
        const purchaseProductsArray = purchaseProducts[0]?.arr || [];
        const soldProductsArray = soldProducts[0]?.arr || [];

        const sumpurchaseProducts = calculateSum(purchaseProductsArray);
        const sumsoldProducts = calculateSum(soldProductsArray);
  console.log(sumpurchaseProducts)
        const {soldObject,purchaseObject} = calculateDifference(sumpurchaseProducts, sumsoldProducts);
        // console.log(soldObject,purchaseObject)
        const difference = calculateFinalDifference(purchaseObject,soldObject);
       console.log(difference)
        res.status(200).json({
            data: difference,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Request failed',
        });
    }
};
const calculateSum = (data) => {
    const productsMap = {};
  

    data.forEach((purchase) => {
   
      if (purchase.status === "Approved") {
     
        purchase.product.forEach((product) => {
          const { product_Name, batchNo, noOfUnit, perUnitPrice, discount} = product;
        //   console.log("discount",discount)
            if(discount!==undefined){
                   
                  if (!productsMap[product_Name]) {
           
                    productsMap[product_Name] = [];
                  }
               
                  productsMap[product_Name].push({ batchNo, quantity: noOfUnit,perUnitPrice,discount});
            }else{
                let totalPrice = 0;
                let profit=0;
                if (!productsMap[product_Name]) {
           
                    productsMap[product_Name] = [];
                  }
               
                  productsMap[product_Name].push({ batchNo, quantity: noOfUnit,perUnitPrice,totalPrice,profit});
            }

            //calculate total price after subtracting discount and also add it to the given productname and then minus the both the total price to calculate profit
       
        });
      }
    });
// console.log(productsMap)
    return productsMap;
};


const calculateDifference = (sumpurchaseProducts, sumsoldProducts) => {
    const soldObject = {};
    const purchaseObject={};
// console.log("purchase",sumpurchaseProducts,"sold",sumsoldProducts)
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
              
                // purchaseQuantitiesCopy[1][j]["totalPrice"] = purchaseQuantitiesCopy[0][i].quantity*purchaseQuantitiesCopy[1][j].perUnitPrice;
                    let soldCost = (purchaseQuantitiesCopy[0][i].quantity*purchaseQuantitiesCopy[0][i].perUnitPrice)-((purchaseQuantitiesCopy[0][i].quantity*purchaseQuantitiesCopy[0][i].perUnitPrice)*purchaseQuantitiesCopy[0][i].discount/100);
                  
                    let purhcaseCost = purchaseQuantitiesCopy[0][i].quantity*purchaseQuantitiesCopy[1][j].perUnitPrice;
                    // console.log(soldCost,purhcaseCost)
                    purchaseQuantities[j]["profit"] += +((soldCost-purhcaseCost).toFixed(2));
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

    Object.keys(sumpurchaseProducts).forEach((productName) => {
        const purchaseQuantities = [...sumpurchaseProducts[productName]];
        const soldBatches = sumsoldProducts[productName] || [];
     
        //units and perunit cost is in correct format calculate total cost and than calculate profit;

        for (let j = purchaseQuantities.length - 1; j >= 0; j--) {
           
            for (let i = 0; i < soldBatches.length; i++) {
                
                if (purchaseQuantities[j].quantity >= soldBatches[i].quantity) {
                 
                 
                    purchaseQuantities[j].quantity -= soldBatches[i].quantity;
                //    console.log("quanity",soldBatches[i].quantity,"purchaseRate",purchaseQuantities[j].perUnitPrice,"soldRate",soldBatches[i].perUnitPrice, "discount",soldBatches[i].discount);
                   let soldCost = (soldBatches[i].quantity*soldBatches[i].perUnitPrice)-((soldBatches[i].quantity*soldBatches[i].perUnitPrice)*soldBatches[i].discount/100);
                    let purhcaseCost = soldBatches[i].quantity*purchaseQuantities[j].perUnitPrice;
                    purchaseQuantities[j]["profit"] += (soldCost-purhcaseCost);
                    purchaseQuantities[j]["totalPrice"]+= soldBatches[i].quantity*purchaseQuantities[j].perUnitPrice;
                    soldBatches.splice(i, 1);
                    i--;
                } else {
                    soldBatches[i].quantity -= purchaseQuantities[j].quantity;
                    purchaseQuantities[j]["totalPrice"]+= purchaseQuantities[j].quantity*purchaseQuantities[j].perUnitPrice;
                    // console.log("quanity",purchaseQuantities[j].quantity,"purchaseRate",purchaseQuantities[j].perUnitPrice,"soldRate",soldBatches[i].perUnitPrice, "discount",soldBatches[i].discount);
                    let soldCost = (purchaseQuantities[j].quantity*soldBatches[i].perUnitPrice)-((purchaseQuantities[j].quantity*soldBatches[i].perUnitPrice)*soldBatches[i].discount/100);
                    let purhcaseCost = purchaseQuantities[j].quantity*purchaseQuantities[j].perUnitPrice;
                    purchaseQuantities[j]["profit"] += (soldCost-purhcaseCost);
                    purchaseQuantities[j].quantity = 0;
                    break; 
                }
            }
        }

        differenceObject[productName] = purchaseQuantities;
    });
 
// console.log(differenceObject)
    return differenceObject;
}
// calculation of weekly monthly and yearly profit;

const findProductList = async (req, res) => {
    try {
        // const { status } = req.body;
        const findAllPurchase = await purchaseProductsModule.find({});
        const findAllInvoice = await soldProductsModule.find({})
        let startPurchase;
        let startInvoice;
        if(findAllPurchase){
            startPurchase = findAllPurchase[0].arr[findAllPurchase[0].arr.length-1].date;
        }
if(findAllInvoice){
    startInvoice = findAllInvoice[0].arr[findAllInvoice[0].arr.length-1].date;
}
console.log(startInvoice);

       
            const { startDate, endDate } = req.body;
            console.log(startDate,endDate);
           let startDa = startDate.split("");
           startDa[startDa.length-1] = startDa[startDa.length-1]-1;
          let startOldDate = startDa.join("")
            const filteredPurchase = await findAllPurchase[0].arr.filter((item) => {
                const itemDate = new Date(item.date);
                const start = new Date(startPurchase);
                const end = new Date(endDate);
                return itemDate >= start && itemDate <= end;
            });
            const filteredInvoiceOld = await findAllInvoice[0].arr.filter((item)=>{
                const itemDate = new Date(item.date);
                const start = new Date(startInvoice);
                const end = new Date(startOldDate);
                return itemDate >= start && itemDate <= end;
            });
            const filteredInvoice = await findAllInvoice[0].arr.filter((item)=>{
                const itemDate = new Date(item.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return itemDate >= start && itemDate <= end;
            });
            const sumpurchaseProducts = calculateSum(filteredPurchase);
            const sumsoldProductsOld = calculateSum(filteredInvoiceOld);
            const sumsoldProductsRequire = calculateSum(filteredInvoice);
            // console.log(sumpurchaseProducts)
            const {soldObject,purchaseObject} = calculateDifference(sumpurchaseProducts, sumsoldProductsOld);
            // console.log(soldObject,purchaseObject)
            // console.log(purchaseObject)
            const difference = calculateFinalDifference(purchaseObject,soldObject);
            Object.entries(difference).forEach(([key, value])=>{
                value.forEach((val)=>{
                    val.profit=0
                })
            })
            console.log(difference)
            const {soldObject: soldObjectrequire,purchaseObject:purchaseObjectrequire} = calculateDifference(difference, sumsoldProductsRequire);
            const finalDifference = calculateFinalDifference(purchaseObjectrequire,soldObjectrequire);
            console.log(finalDifference);
            res.status(200).json({
                data: finalDifference,
            });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({
            message: 'Request failed',
        });
    }
};



  
 



const calculateProfit = (sumpurchaseProducts, sumsoldProducts) => {
    const differenceObject = {};
   
    Object.keys(sumpurchaseProducts).forEach((productName) => {
        const purchaseQuantities = [...sumpurchaseProducts[productName]];
        const soldBatches = sumsoldProducts[productName] || [];
       
        let totalSoldQuantity = soldBatches.reduce((total, batch) => total + batch.quantity, 0);
        let soldProfit = soldBatches.reduce((total, batch)=> total+batch.quantity*batch.perUnitPrice,0);
      
        for (let i = purchaseQuantities.length - 1; i >= 0; i--) {
            const batch = purchaseQuantities[i];
            const batchNo = batch.batchNo;
            const soldBatch = soldBatches.find(batch => batch.batchNo === batchNo);  
            if (soldBatch) {
                const remainingQuantity = batch.quantity - soldBatch.quantity;
               
                if (remainingQuantity > 0) {
                    batch.quantity = remainingQuantity;
                } else {
                    purchaseQuantities.splice(i, 1);
                }
                totalSoldQuantity -= soldBatch.quantity;
            } else {
                if (totalSoldQuantity > 0) {
                    const remainingSoldQuantity = totalSoldQuantity - batch.quantity;
                    // TotalSoldCost += ((totalSoldQuantity*soldBatch.perUnitPrice) -(soldBatch.quantity*batch.perUnitPrice) )
                    if (remainingSoldQuantity <= 0) {
                        batch.quantity -= totalSoldQuantity;
                        break;
                    } else {
                        batch.quantity = 0;
                        totalSoldQuantity = remainingSoldQuantity;
                    }
                }
            }
        }

        differenceObject[productName] = purchaseQuantities;
    });
    // console.log(differenceObject)
    return differenceObject;
};


module.exports = { dataInfo, findProductList };
