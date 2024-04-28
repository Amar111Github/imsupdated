const inVoiceDetailsModule = require("../moduls/invoiceModule");
const productModule = require("../moduls/productModule");
const customerModule = require("../moduls/customer")


const updateInvoiceStatus = async(req, res) => {
    const { id, status } = req.body;
    console.log("heloo",id, status)
   
    let oldPurchase = await inVoiceDetailsModule.find({});
    try {
        const oldDocumentId =  oldPurchase[0]._id
      
        
        const update = await inVoiceDetailsModule.findByIdAndUpdate(
            oldDocumentId,
            {
                $set: {
                    "arr.$[elem].status": status,
                },
            },
            {
                new: true,
                arrayFilters: [{ "elem.id": id }],
            }
        );

        console.log(update);

        if (update) {
            res.status(200).json({
                message: "Product details status is updated",
                updatedProduct: update
            });
        } else {
            res.status(404).json({
                message: "Product not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Update request failed"
        });
    }

}
const updateInvoicePaidStatus = async (req, res) => {
    const { id } = req.params;
    const item = req.body;
    console.log(id,item)
    try {
        const oldPurchase = await inVoiceDetailsModule.find({});
        console.log(oldPurchase)
        if (!oldPurchase) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        const oldDocumentId = oldPurchase[0]._id;
        console.log(oldDocumentId)
        const update = await inVoiceDetailsModule.findByIdAndUpdate(
            oldDocumentId,
            {
                $set: {
                    "arr.$[elem].paidStatus": "paid",
                    "arr.$[elem].paidAmount": item.totalPrice,
                    "arr.$[elem].dueAmount": 0,
                },
            },
            {
                new: true,
                arrayFilters: [{ "elem.id": id }],
            }
        );

        if (update) {
            res.status(200).json({
                message: "Invoice details status is updated",
                updatedInvoice: update
            });
        } else {
            res.status(404).json({
                message: "Invoice not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Update request failed"
        });
    }
};

const allInvoices = async(req, res) => {

    try{
        const result = await inVoiceDetailsModule.find({})
        res.status(200).json({
            message : "response Received",
            result : result,
            count : result.length
        })
    } catch {
        res.status(500).json({
            message : "product details requist is faild"
        })
    }
}
const findProductList = async (req, res) => {
    const { status } = req.body;


    try {
     

        const findAll = await inVoiceDetailsModule.find({});

        if (status) {
            const { startDate, endDate } = req.body;
            const filteredItems = await findAll[0].arr.filter((item) => {
                const itemDate = new Date(item.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return itemDate >= start && itemDate <= end && item.status === status;
            });
            res.json({ data: filteredItems });
        } else {
            const { startDate, endDate } = req.body;
            const result = {};
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Loop through each day between start and end dates
            for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                const currentDate = new Date(date);
                const filteredItems = findAll[0].arr.filter((item) => {
                    // console.log("product",item.product)
                    const itemDate = new Date(item.date);
                    return itemDate.toDateString() === currentDate.toDateString();
                });
                // console.log("filtered",filteredItems.length)
               
                if(filteredItems.length>0){
                    let total = 0;
                    filteredItems.map((val)=>{
                        total +=val.product.length;
                        return val.product
                    })
                    result[currentDate.toISOString().split('T')[0].split("-")[2]] = total;
                }else{
                    result[currentDate.toISOString().split('T')[0].split("-")[2]] = 0;
                }
         
            }
            // console.log("filtered",result)
            res.json({ data: result });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const sameInvoiceData = async (req, res)=>{
    try{
        const {purchase_no} = req.body;
      console.log(purchase_no)
        let oldPurchase = await inVoiceDetailsModule.find({});
        if(oldPurchase.length>0){
            const existingPurchase = oldPurchase[0].arr.filter((val)=>{
                return val.purchase_no ===purchase_no
            })
           res.status(200).json({
            message: "data found",
            data: existingPurchase
           })
        }else{
            res.status(404).json({
                message: "data not found"
            })
        }
    }catch(error){
        console.log(error)
    }
}

const invoiceDetails = async (req, res) => {
    try{
    const arr = req.body;
        console.log(arr)
 
        let oldPurchase = await inVoiceDetailsModule.find({});
    if(oldPurchase.length>0){
        const oldDocumentId =  oldPurchase[0]._id
        const purchase_no = arr[0].purchase_no;
        const existingPurchase = oldPurchase[0].arr.some((val)=>{
            return val.purchase_no ===purchase_no
        })
        console.log(existingPurchase)
       oldPurchase = [...arr,...oldPurchase[0].arr]


     
        if (existingPurchase) {
            res.status(400).json({
                message: 'Purchase no. already exists',
            });
        } else {
      
           
           
            await inVoiceDetailsModule.updateOne(
                { _id: oldDocumentId },
                { $set: { arr: oldPurchase } }
            );

            res.status(201).json({
                message: 'Successfully saved',
                result: arr,
            });
        }
    } else{
        console.log("heelloo", arr)
        const newpurchaseItem = new inVoiceDetailsModule({
            arr
        });
      
        await newpurchaseItem.save();
        res.status(201).json({
            message: 'Successfully saved',
            result: newpurchaseItem,
        });
    }
    }catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Your request failed',
        });
    }
 



  
}



const findProduct = async (req, res) => {
    const { category_name } = req.body;

    try {
        if (category_name === "") {
            res.status(400).json({
                message: "plase select the category",
            })
        } else {
            const findSuplire = await productModule.find({ category_name: category_name })
            let product = []
            for (const val of findSuplire) {
                if (category_name === val.category_name) {
                    product.push(val.product_Name);
                }
            }
            res.status(200).json({
                message: "ok",
                result: product,
                product:findSuplire
            })
        }
    } catch {
        res.status(500).json({
            message: "your requist is faild"
        })
    }
}

const deleteInvoiceDetails = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    let oldPurchase = await inVoiceDetailsModule.find({});
        const oldDocumentId =  oldPurchase[0]._id  
    try {
        await inVoiceDetailsModule.updateOne(
            { _id: oldDocumentId },
            { $pull: { arr: { id: id } } }
        );
        res.status(200).json({
            message: "product details are deleted"
        })
    } catch {
        res.status(500).json({
            message: "your requist is faild"
        })
    }
}
const addPayment = async (req, res) => {
    try {
        const { id, amount, paymentMode, paymentDue } = req.body;

        let result = await inVoiceDetailsModule.find({});
        
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Product details not found" });
        }

        const data = result[0].arr.find((val) => val.id === id);

        if (!data) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (data.payments.length === 0) {
            data.payments.push({ amount, paymentMode });
            data.paymentDue = paymentDue;

            if (data.dueAmount === parseInt(amount)) {
              
                data.paidAmount = data.totalPrice;
                data.dueAmount = 0;
                data.paidStatus = "paid";
            } else {
            
                data.paidAmount = parseInt(amount);
                data.dueAmount = data.totalPrice - parseInt(amount);
            }
        } else if (data.payments.length > 0) {
            const totalPaid = data.payments.reduce((acc, curr) => acc + curr.amount, 0);
            data.payments.push({ amount, paymentMode });
            if (data.dueAmount === parseInt(amount)) {
                data.paidAmount = data.totalPrice;
                data.dueAmount = 0;
                data.paidStatus = "paid";
            } else {
                data.dueAmount = (data.totalPrice - parseInt(amount)) - parseInt(totalPaid);
                data.paidAmount = parseInt(amount) + parseInt(totalPaid);
            }
        }

    
        await inVoiceDetailsModule.updateOne({}, { $set: { arr: result[0].arr } });


      

        res.status(200).json({
            message: "payment is added",
            data:result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Product details request failed"
        });
    }
};

module.exports = {
    invoiceDetails,
    deleteInvoiceDetails,
    findProduct,
    addPayment,
    allInvoices,
    updateInvoiceStatus,
    updateInvoicePaidStatus,
    findProductList,sameInvoiceData
}