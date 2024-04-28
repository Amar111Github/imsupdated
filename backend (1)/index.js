const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

const app = express();
require('dotenv').config();
app.use(express.json());

app.use(bodyParser.json({ extended: true, limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors());

// Import routes
const employer = require('./route/userRoute');
const supplier = require('./route/supplierRoute');
const userTime = require('./route/userActiveTimeRoute');
const category = require('./route/categoryRoutes');
const product = require('./route/productRoute');
const productDetails = require('./route/productDetailsRoute');
const customer = require('./route/customerRoute');
const invoice = require('./route/invoiceRoute');
const hsn = require("./route/hsnRoute");
const noOfUnit = require("./route/noOfRoute");
const tax = require("./route/taxRoutes");
const inVoiceDetailsModule = require("./moduls/invoiceModule");
const productModule = require("./moduls/productModule");
const customerModule = require("./moduls/customer");
const supplierModule = require("./moduls/supplierModule");
const categoryModule = require("./moduls/categoryModule");

// Connect to the database
mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Database is connected');
}).catch(() => {
    console.log('Database connection failed');
});

// Serve frontend static files
app.use(express.json());
const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(buildPath));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }));
  

// API routes
app.use('/user', employer);
app.use('/supplier', supplier);
app.use('/product', product);
app.use('/userTime', userTime);
app.use("/client", customer);
app.use('/product_details', productDetails);
app.use('/category', category);
app.use('/invoice', invoice);
app.use('/hsn', hsn);
app.use('/noOfUnit', noOfUnit);
app.use("/tax", tax);

// CORS for frontend static files


const Port = process.env.PORT || 8000;

app.get('/mainpage', async (req, res) => {
    try {
        const sale = await inVoiceDetailsModule.find({});
        const product = await productModule.find({});
        const customer = await customerModule.find({});
        const supplier = await supplierModule.find({});
        const category = await categoryModule.find({});

        res.status(200).json({
            message: "Response Received",
            categories: category.length,
            products: product.length,
            customers: customer.length,
            suppliers: supplier.length,
        });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({
            message: "An error occurred while fetching sales data"
        });
    }
});

app.get('/lastInvoices', async (req, res) => {
    try {
        const sale = await inVoiceDetailsModule.find({});
        console.log(sale[0].arr.slice(0, 3));

        res.status(200).json({
            message: "Response Received",
            sales: sale[0].arr.slice(0, 3),

        });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({
            message: "An error occurred while fetching sales data"
        });
    }
});

app.listen(Port, function () {
    console.log('Server is running on port', Port);
});
