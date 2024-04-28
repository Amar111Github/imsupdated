
const mongoose = require('mongoose');

const customerSchema= mongoose.Schema({
    customer_name : { type : String , require : true },
    customer_email : { type : String , require : true },
    customer_contact_no : { type : String , require : true },
    customer_gst: { type : String , require : true },
    customer_address : { type : String , require : true },
    customer_image: {
        public_id: { type: String  },
       url: { type: String}
    }
})

const customerModule = mongoose.model('customerTable', customerSchema)

module.exports = customerModule