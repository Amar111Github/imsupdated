const taxModule = require("../moduls/taxModule");


const CreateTax = async (req, res) => {

    const tax = req.body;
   
    const newTax = new taxModule(tax);

    try {
        await newTax.save()
        res.status(201).json({
            message: 'added a new newTax',
            product: newTax
        })
    } catch {
        res.status(400).json({
            message: 'your requst is new tax requst faild',
        })
    }
}
const FindTax = async (req, res) => {

    try {
        const findTax = await taxModule.find({});
        res.status(200).json({
            message: 'tax all data',
            product: findTax,
            count : findTax.length
        })
    } catch {
        res.status(500).json({
            message: 'tax data requrist is faild',
        })
    }
}

const updateTaxDetails = async (req, res) => {
    const tax = req.body;
    const id = req.params.id

    console.log(id);

    try {
        await taxModule.findByIdAndUpdate(id, tax)
        const findResult = await taxModule.findOne({ _id: id })

        res.status(201).json({
            message: 'added a new Tax',
            product: findResult
        })
    } catch {
        res.status(400).json({
            message: 'your requst is faild',
        })
    }
}

const deleteTax = async (req, res) => {

    const id = req.params.id
    try {
        await taxModule.findByIdAndDelete(id)
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
    CreateTax,
    FindTax,
    updateTaxDetails,
    deleteTax
}