const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db");
const bodyParser = require("body-parser");
const multer = require("multer");
require('dotenv').config();

const app = express();
const User = require("./Models/User");
const Product = require("./Models/Product");
const Carousel = require("./Models/Carousel");
const { mongo } = require("mongoose");
// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "../E-Commerce-Frontend/build")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/api/product-card-data",async(req,res,next)=>{
  try {
    console.log("hi")
    const productCardData = await Product.find();
    const formattedData = productCardData.map((product) => {
      return {
        ...product._doc,
        price: product.price.toString() // Convert price to string
      };
    });
    res.json(formattedData);
    
  }catch(error){
    console.error(error)
    res.status(500).json({message : 'Server Error'})
  }
});

app.get("/api/carousel-data",async(req,res,next)=>{
  try{
    const carouselData = await Carousel.find();
    console.log(carouselData);
    res.json(carouselData);
  }catch(error){
    console.log(error);
  }
});



app.get("/api/product-card-data-disc",async(req,res,next)=>{
  try {
    console.log("hi")
    const productCardData = await Product.find({discount:{$gt:1}});
    const formattedData = productCardData.map((product) => {
      return {
        ...product._doc,
        price: product.price.toString() // Convert price to string
      };
    });
    res.json(formattedData);
    
  }catch(error){
    console.error(error)
    res.status(500).json({message : 'Server Error'})
  }
});

// Image store
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, filefilter: filefilter });

// Register route
app.post("/register", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { Username, FirstName, LastName, Email, Password, Address, Phone } =
      req.body;

    // Create a new user instance
    const user = new User({
      username: Username,
      firstName: FirstName,
      lastName: LastName,
      email: Email,
      password: Password,
      address: Address,
      phone: Phone,
    });

    // Save the user to the database
    await user.save();

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Registration failed" });
    res.status(500).json({ message: "Registration failed" });
  }
});

// Add Product
app.post("/add-product", upload.single('ProductImage'), async (req, res) => {
  try {
    console.log("Received data:", req.body);
    console.log("Received filename:", req.file.filename);
    
    const body = req.body;
    const imgPath = String(req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename)

    console.log("save to::", imgPath);

    // Create a new user instance
    const product = new Product({
      productName: body.ProductName,
      price: body.Price,
      description: body.Description,
      qty: body.Qty,
      discount: body.Discount,
      productImage: req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename
    });

    // Save the user to the database
    await product.save();

    res.json({ message: "Add Product successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Add Product failed" });
  }
});

// Product Detail
app.get("/api/product-detail-data",async(req,res,next)=>{
  try {
    console.log("heh")
    const productId = req.query.id
    const productData = await Product.findOne({_id : productId});
    res.json(productData);
  }catch(error){
    console.error(error)
    res.status(500).json({message : 'Server Error'})
  }
});

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../E-Commerce-Frontend/build", "index.html")
  );
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running nicely");
});
