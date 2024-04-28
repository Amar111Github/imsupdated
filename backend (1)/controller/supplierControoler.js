const supplierModule = require("../moduls/supplierModule");


const CreateSuplier = async (req, res) => {

    const suplier = req.body;
   
    const newSuplier = new supplierModule(suplier);

    try {
        await newSuplier.save()
        res.status(201).json({
            message: 'added a new newSuplier',
            product: newSuplier
        })
    } catch {
        res.status(400).json({
            message: 'your requst is new suplier requst faild',
        })
    }
}

const FindSupplier = async (req, res) => {

    try {
        const findSupplier = await supplierModule.find({});
        res.status(200).json({
            message: 'supplire all data',
            product: findSupplier,
            count : findSupplier.length
        })
    } catch {
        res.status(500).json({
            message: 'supplire data requrist is faild',
        })
    }
}

const updateSuplireDetails = async (req, res) => {
    const supplier = req.body;
    const id = req.params.id

    console.log(id);

    try {
        await supplierModule.findByIdAndUpdate(id, supplier)
        const findResult = await supplierModule.findOne({ _id: id })

        res.status(201).json({
            message: 'added a new Product',
            product: findResult
        })
    } catch {
        res.status(400).json({
            message: 'your requst is faild',
        })
    }
}

const deleteSupplire = async (req, res) => {

    const id = req.params.id
    try {
        await supplierModule.findByIdAndDelete(id)
        res.status(200).json({
            message: 'data is deleted',
        })
    } catch {
        res.status(500).json({
            message: 'your requst is faild'
        })
    }
}




module.exports = {
    CreateSuplier,
    FindSupplier,
    deleteSupplire,
    updateSuplireDetails
}






