const hsnModule = require("../moduls/hsnModule");

const createHsn = async (req, res) => {

    const hsns = req.body;
    const { hsn } = req.body;
    const newhsn = new hsnModule(hsns)

    try {
        const find = await hsnModule.findOne({ hsn : hsn }) 

        if (!find) {
            await newhsn.save()
            res.status(201).json({
                message: 'hsn is created',
                data: newhsn
            })
        } else {
            res.status(400).json({
                message: 'this hsn is already exits',
            })
        }
    } catch {
        res.status(403).json({
            message: 'create hsn requst is failed',
        })
    }
}

const findAllHsn = async (req, res) => {

    try {
        const findAllData = await hsnModule.find({})

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

const updateHsn = async (req, res) => {

    const hsnobj = req.body;
    const { hsn } = req.body;
    const id = req.params.id;

    try {
        const find = await hsnModule.findOne({ hsn : hsn }) 
        if (!find) {
            await hsnModule.findByIdAndUpdate(id, hsnobj)
        const findHsn = await hsnModule.findOne({ _id: id })

        res.status(200).json({
            message: 'Hsn is updated',
            result : findHsn
        })
        } else {
            res.status(400).json({
                message: 'this hsn is already exits',
            })
        }
       
    } catch {
        res.status(500).json({
            message: 'category update requst is failed'
        })
    }
}

const deletedhsn = async (req, res) => {
    const id = req.params.id;

    try {
        await hsnModule.findByIdAndDelete(id)
        res.status(200).json({
            message: 'hsn is deleted'
        })
    } catch {
        res.status(400).json({
            message: 'hsn delete requist is failed'
        })
    }
}

module.exports = {
    createHsn,
    findAllHsn,
    updateHsn,
    deletedhsn
}