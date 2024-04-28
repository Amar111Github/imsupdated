const categoryModule = require("../moduls/categoryModule")
const productModule = require("../moduls/productModule");
const supplierModule = require("../moduls/supplierModule");


const addproduct = async (req, res) => {
    const product = req.body;
    const { suplire_Name, product_Name } = req.body;

    const newProducts = new productModule(product)

    try {
        const products = await productModule.findOne({ product_Name : product_Name })
        const suplire = await productModule.findOne({ suplire_Name : suplire_Name })

        if (products && suplire) {
            res.status(500).json({
                message: 'product name and suplire name alredy exits',
            })
        } else {
            await newProducts.save();
            res.status(201).json({
                message: 'new Product is aded successfuly',
                product: newProducts
            })
        }

    } catch {
        res.status(500).json({
            message: 'create product request is faild',
        })
    }
}

const updateProduct = async (req, res) => {

    const id = req.params.id;
    const product = req.body;
    const { suplire_Name, product_Name } = req.body;

    try {
        const products = await productModule.findOne({ product_Name: product_Name })

        if (products && products.suplire_Name === suplire_Name && products._id != id) {
            res.status(500).json({
                message: 'product name and suplire name alredy exits',
            })
        } else {
            const result = await productModule.findByIdAndUpdate(id, product)
            res.status(201).json({
                message: 'Product is successfuly updatted',
                product: result
            })
        }

    } catch {
        res.status(500).json({
            message: 'update product request is faild',
        })
    }

}

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        await productModule.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Product is successfuly deleted',
        })

    } catch {
        res.status(500).json({
            message: 'delete product request is faild',
        })
    }
}

const getProduct = async (req, res) => {

    try {
        const find = await productModule.find({ _id: req.body.product_id }).populate('suppliers_id')
        if (find.length > 0) {
            res.status(200).json({
                result: find
            })
        } else {
            const findAll = await productModule.find({})
            res.status(200).json({
                result: findAll
            })
        }
    } catch {
        res.status(400).json({
            message: "product  request is faild"
        })
    }
}

const categoryAndSupplire = async (req, res) => {
    try {
        const findCategory = await categoryModule.find({})
        const findSupplier = await supplierModule.find({})

        // suppliers 
        let suppliers = []
        for (sup of findSupplier) {
            suppliers.push(sup.suplierEmail)
        }

        // category 
        let cate = []
        for (const cat of findCategory) {
            cate.push(cat.category)
        }

        res.status(200).json({
            category: cate,
            suppliers: suppliers,
        })
    } catch {
        res.status(500).json({
            message: 'find data requst is faild'
        })
    }

}

module.exports = {
    addproduct,
    getProduct,
    updateProduct,
    deleteProduct,
    categoryAndSupplire
};