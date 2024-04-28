
const { cloudinaryFileUploder, removeCloudinaryImage, uplodeImagesCloudinary } = require('../utils/cloudinary')
const customerModule = require('../moduls/customer')

// create a customre -------
const createCustomer = async (req, res, next) => {
    const { customer_name, customer_address, customer_email, customer_contact_no, customer_gst } = req.body;

    if (customer_name === "" || customer_address === "" || customer_email === "" || customer_contact_no === "" || customer_gst === "") {
        return res.status(400).json({
            message: "Please fill all input fields."
        });
    }

    try {
        let customer_image = { public_id: "", url: "" }; // Default empty image data

        const file = req.file;
        if (file) {
               
            const cloudinaryFile = await cloudinaryFileUploder(file.path);
          
            if (cloudinaryFile) {
                customer_image = {
                    public_id: cloudinaryFile.publicId,
                    url: cloudinaryFile.image_url
                };
            } else {
                return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
            }
        }

        const newCustomer = new customerModule({
            customer_image,
            customer_address,
            customer_contact_no,
            customer_email,
            customer_name,
            customer_gst
        });

        const findCustomer = await customerModule.findOne({ customer_email });
        if (findCustomer) {
            return res.status(400).json({ message: "Customer email already exists." });
        }

        await newCustomer.save();
        return res.status(201).json({ message: "Customer created successfully.", result: newCustomer });
    } catch (error) {
        console.error('Error creating customer:', error);
        return res.status(500).json({ message: "Failed to create customer." });
    }
};

// find the all data in customer ---------


// delete the customer details ----------
const deleteCustomer = async (req, res) => {
    const id = req.params.id;

    try {
        const customer = await customerModule.findById(id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // Delete image from Cloudinary
        const imagePublicId = customer.customer_image.public_id;
        await removeCloudinaryImage(imagePublicId);

        // Delete customer from the database
        await customerModule.findByIdAndDelete(id);

        res.status(200).json({
            message: "Customer details and image deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({
            message: "Customer delete request failed"
        });
    }
}
const updateCustomer = async (req, res) => {
    const customerId = req.params.id;
    const { customer_name, customer_address, customer_email, customer_contact_no, customer_gst } = req.body;

    try {
        // Find the customer by ID
        let customer = await customerModule.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

       
        customer.customer_name = customer_name;
        customer.customer_address = customer_address;
        customer.customer_email = customer_email;
        customer.customer_contact_no = customer_contact_no;
        customer.customer_gst = customer_gst;

        if (req.file) {
           
            const cloudinaryFile = await cloudinaryFileUploder(req.file.path);
            if (cloudinaryFile) {
              
                await removeCloudinaryImage(customer.customer_image.public_id);
           
                customer.customer_image = {
                    public_id: cloudinaryFile.publicId,
                    url: cloudinaryFile.image_url
                };
            } else {
                return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
            }
        }

        // Save the updated customer
        await customer.save();

        return res.status(200).json({ message: "Customer updated successfully.", result: customer });
    } catch (error) {
        console.error('Error updating customer:', error);
        return res.status(500).json({ message: "Failed to update customer." });
    }
};
const allCustomer = async (req, res) => {

    try {
        const allCustomer = await customerModule.find({})
        res.status(200).json({
            message: "find all data",
            result: allCustomer,
            count: allCustomer.length
        })
    } catch {
        res.status(400).json({
            message: "your requist is faild"
        })
    }
}

module.exports = {
    createCustomer,
    allCustomer,
    deleteCustomer,
    updateCustomer
}

