const productDetilsModule = require("../moduls/productDetails");
const productModule = require("../moduls/productModule");


const samePurchaseData = async (req, res)=>{
    try{
        const {purchase_no} = req.body;
      console.log(purchase_no)
        let oldPurchase = await productDetilsModule.find({});
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
const addPayment = async (req, res) => {
    try {
        const { id, amount, paymentMode, paymentDue } = req.body;

        let result = await productDetilsModule.find({});
        
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

    
        await productDetilsModule.updateOne({}, { $set: { arr: result[0].arr } });


      

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


const  allpurchaseProduct = async(req, res) => {

    try{
        const result = await productDetilsModule.find({})
        console.log(result)
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
    try {
        const { status } = req.body;
        const findAll = await productDetilsModule.find({});

        if (status) {
            const { startDate, endDate } = req.body;
            console.log(startDate)

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
                    const itemDate = new Date(item.date);
                    return itemDate.toDateString() === currentDate.toDateString();
                });
                console.log("filtered",filteredItems)
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
            console.log(result)
            res.json({ data: result });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const productDetails = async (req, res) => {
    try {
        const arr = req.body;
       
        let oldPurchase = await productDetilsModule.find({});
    
        if(oldPurchase.length>0){
            const oldDocumentId =  oldPurchase[0]._id
            const purchase_no = arr[0].purchase_no;
            const existingPurchase = oldPurchase[0].arr.some((val)=>{
                return val.purchase_no ===purchase_no
            })
            console.log(existingPurchase)
           oldPurchase = [ ...arr,...oldPurchase[0].arr]
    
    
         
            if (existingPurchase) {
                res.status(400).json({
                    message: 'Purchase no. already exists',
                });
            } else {
          
               
               
                await productDetilsModule.updateOne(
                    { _id: oldDocumentId },
                    { $set: { arr: oldPurchase } }
                );
    
                res.status(201).json({
                    message: 'Successfully saved',
                    result: arr,
                });
            }
        } else{
            const newpurchaseItem = new productDetilsModule({
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

// update the product status 
const updateProductstatus = async (req, res) => {
    const { id, status } = req.body;
    
   console.log(id, status)
    let oldPurchase = await productDetilsModule.find({});
    try {
        const oldDocumentId =  oldPurchase[0]._id
      
        
        const update = await productDetilsModule.findByIdAndUpdate(
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
};



const findCategory = async (req, res) => {
    const {suplierEmail}  = req.body;
   console.log(suplierEmail)
    const findSuplire = await productModule.find({ suplire_Email: suplierEmail })
    console.log(findSuplire)
    let category = []
    for (const iterator of findSuplire) {
        category.push(iterator.category_name)
    }
    let unique = new Set(category);
    let uniqueCatergory = [...unique]
    try {
        if (suplierEmail === "" || suplierEmail === null) {
            res.status(400).json({
                message: "select your category"
            })
        } else {
            res.status(200).json({
                message: "ok",
                result: uniqueCatergory
            })
        }

    } catch {
        res.status(500).json({
            message: "your requist is faild"
        })
    }
}

const findProduct = async (req, res) => {
    const { suplire_Name, category_name } = req.body;

    try {
        if (category_name === "") {
            res.status(400).json({
                message: "plase select the category",
            })
        } else {
            const findSuplire = await productModule.find({ suplire_Name: suplire_Name })
            let product = []
            for (const val of findSuplire) {
                if (category_name === val.category_name) {
                    product.push(val.product_Name);
                }
            }
         
            res.status(200).json({
                message: "ok",
                result: product,
                product: findSuplire
            })
        }
    } catch {
        res.status(500).json({
            message: "your requist is faild"
        })
    }
}

const deleteProductDetails = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    let oldPurchase = await productDetilsModule.find({});
        const oldDocumentId =  oldPurchase[0]._id  
    try {
        await productDetilsModule.updateOne(
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


module.exports = {
    productDetails,
    findCategory,
    deleteProductDetails,
    findProduct,
    allpurchaseProduct,
    updateProductstatus,
    findProductList,samePurchaseData,
    addPayment
}