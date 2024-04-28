const categoryModule = require("../moduls/categoryModule");

const createCategory = async (req, res) => {

    const categories = req.body;
    const { category } = req.body;
    const newCategory = new categoryModule(categories)

    try {
        const find = await categoryModule.findOne({ category : category }) 

        if (!find) {
            await newCategory.save()
            res.status(201).json({
                message: 'category is created',
                data: newCategory
            })
        } else {
            res.status(400).json({
                message: 'this category is already exits',
            })
        }
    } catch {
        res.status(403).json({
            message: 'create category requst is failed',
        })
    }
}

const findAllCategory = async (req, res) => {

    try {
        const findAllData = await categoryModule.find({})

        res.status(200).json({
            message: 'All data is finds',
            data: findAllData,
            count: findAllData.length
        })
    } catch {
        res.status(500).json({
            message: 'find data requst is failed'
        })
    }
}

const updateCategory = async (req, res) => {

    const categoryobj = req.body;
    const { category } = req.body;
    const id = req.params.id;

    try {
        const find = await categoryModule.findOne({ category : category }) 
        if (!find) {
            await categoryModule.findByIdAndUpdate(id, categoryobj)
        const findCategory = await categoryModule.findOne({ _id: id })

        res.status(200).json({
            message: 'category is updated',
            result : findCategory
        })
        } else {
            res.status(400).json({
                message: 'this category is already exits',
            })
        }
       
    } catch {
        res.status(500).json({
            message: 'category update requst is failed'
        })
    }
}

const deletedCategory = async (req, res) => {
    const id = req.params.id;

    try {
        await categoryModule.findByIdAndDelete(id)
        res.status(200).json({
            message: 'category is deleted'
        })
    } catch {
        res.status(400).json({
            message: 'category delete requist is failed'
        })
    }
}

module.exports = {
    createCategory,
    findAllCategory,
    deletedCategory,
    updateCategory
}