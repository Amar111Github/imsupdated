const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
require('dotenv').config();

const app = express();

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cors({
    origin: ["http://localhost:3000"], // Adjust depending on your front-end URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// MongoDB connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database is connected'))
    .catch(err => console.error('Database connection failed:', err));

// Import routes and modules
const employerRoutes = require('./route/userRoute');
const supplierRoutes = require('./route/supplierRoute');
const userTimeRoutes = require('./route/userActiveTimeRoute');
const categoryRoutes = require('./route/categoryRoutes');
const productRoutes = require('./route/productRoute');
const productDetailsRoutes = require('./route/productDetailsRoute');
const customerRoutes = require('./route/customerRoute');
const invoiceRoutes = require('./route/invoiceRoute');
const hsnRoutes = require("./route/hsnRoute");
const noOfUnitRoutes = require("./route/noOfRoute");
const taxRoutes = require("./route/taxRoutes");
const invoiceDetailsModel = require("./moduls/invoiceModule");
const productModel = require("./moduls/productModule");
const customerModel = require("./moduls/customer");
const supplierModel = require("./moduls/supplierModule");
const categoryModel = require("./moduls/categoryModule");

// API endpoints
app.use('/user', employerRoutes);
app.use('/supplier', supplierRoutes);
app.use('/product', productRoutes);
app.use('/userTime', userTimeRoutes);
app.use("/client", customerRoutes);
app.use('/product_details', productDetailsRoutes);
app.use('/category', categoryRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/hsn', hsnRoutes);
app.use('/noOfUnit', noOfUnitRoutes);
app.use("/tax", taxRoutes);

// Dashboard data endpoints
app.get('/mainpage', async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        const products = await productModel.find({});
        const customers = await customerModel.find({});
        const suppliers = await supplierModel.find({});
        res.status(200).json({
            message: "Data fetched successfully",
            categories: categories.length,
            products: products.length,
            customers: customers.length,
            suppliers: suppliers.length,
        });
    } catch (error) {
        console.error("Error fetching mainpage data:", error);
        res.status(500).json({ message: "Error fetching mainpage data" });
    }
});

app.get('/lastInvoices', async (req, res) => {
    try {
        const invoices = await invoiceDetailsModel.find({});
        if (invoices.length > 0 && invoices[0].arr && invoices[0].arr.length > 2) {
            res.status(200).json({
                message: "Invoices fetched successfully",
                sales: invoices[0].arr.slice(0, 3),
            });
        } else {
            res.status(404).json({ message: "No sufficient invoice data found" });
        }
    } catch (error) {
        console.error("Error fetching last invoices:", error);
        res.status(500).json({ message: "Error fetching last invoices" });
    }
});

// Serve static files from React build
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Fallback to serve index.html for any random GET request
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
