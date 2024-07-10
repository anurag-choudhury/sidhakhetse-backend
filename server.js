const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");
const cors = require("cors");
const Order = require("./models/Order");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");

require("dotenv").config();
const { check, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.BACKENDPORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const razorpay = new Razorpay({
    key_id: process.env.razorpay_key_id,
    key_secret: process.env.razorpay_key_secret,
});

// // Middleware to serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));

// // Your API routes here
// // Example: app.use('/api', apiRoutes);

// // Catch-all handler to serve the React app for any route not handled by your API
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.get("/hi", (req, res) => {
    res.send({ message: `Hello from the server!${process.env.BACKENDPORT}` });
});

const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
    host: "sidhakhetse.store", // e.g., 'mail.yourdomain.com'
    port: 465, // Usually port 465 for SSL
    secure: true, // Use SSL
    auth: {
        user: process.env.NOREPLY_EMAIL, // Your cPanel email address
        pass: process.env.NOREPLY_PASS, // Your email account password
    },
});

// Function to send email
const sendOrderConfirmation = async (orderDetails) => {
    const mailOptions = {
        from: process.env.NOREPLY_EMAIL, // Sender address
        to: orderDetails.address.email, // List of recipients
        subject: "Order Confirmation", // Subject line
        text: `Thank you for your order! Your order details: ${JSON.stringify(
            orderDetails
        )}`, // Plain text body
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Thank you for your order!</h2>
            <p>Dear ${orderDetails.address.name},</p>
            <p>We are pleased to confirm your order with Sidha Khet Se. Below are your order details:</p>
            <h3>Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderDetails.cart
                        .map(
                            (product) => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${
                                product.name
                            }</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${
                                product.quantity
                            }</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">₹${
                                product.price
                            }</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">₹${(
                                product.price * product.quantity
                            ).toFixed(2)}</td>
                        </tr>
                    `
                        )
                        .join("")}
                </tbody>
            </table>
            <h3>Shipping Address</h3>
            <p>${orderDetails.address.name}<br>
               ${orderDetails.address.addressLine}<br>
               ${orderDetails.address.city}, ${orderDetails.address.state}, ${
            orderDetails.address.zip
        }<br>
               Phone: ${orderDetails.address.phone}<br>
               Email: ${orderDetails.address.email}
            </p>
            <h3>Order Details</h3>
            <p>Order ID: ${orderDetails.orderId}<br>
               Total Amount: ₹${orderDetails.total.toFixed(2)}
            </p>
            <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>
            <p>Best regards,<br>Sidha Khet Se Team</p>
        </div>
        `, // HTML body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email: %s", error);
    }
};
app.post("/create-order", async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const order = await razorpay.orders.create({
            amount: amount,
            currency,
            receipt: "receipt#1",
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/save-order", async (req, res) => {
    const orderDetails = req.body;
    // Save orderDetails to your database
    try {
        const order = new Order(orderDetails);
        await order.save();
        sendOrderConfirmation(orderDetails);
        res.status(201).send("Order saved successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.status(200).send({ token });
});

const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Access denied");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).send("Invalid token");
    }
};
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post(
    "/add-product",
    [
        authenticate,
        upload.single("image"),
        check("name").notEmpty().withMessage("Name is required"),
        check("price").isNumeric().withMessage("Price must be a number"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, price } = req.body;

        try {
            const image = req.file.path;

            const newProduct = new Product({
                name,
                price,
                image,
            });
            await newProduct.save();
            res.status(201).send("Product added successfully");
        } catch (error) {
            res.status(500).send(error);
        }
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
