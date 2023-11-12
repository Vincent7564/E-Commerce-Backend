const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./Config/db");
const bodyParser = require("body-parser");
const multer = require("multer");
require('dotenv').config();
const bcrypt = require('bcrypt');
const auth = require('./Middleware/auth');
const app = express();
const User = require("./Models/User");
const Product = require("./Models/Product");
const Carousel = require("./Models/Carousel");
const Token = require("./Models/Token");
const { mongo } = require("mongoose");
const jwt = require("jsonwebtoken")
const verifyToken = require("./Middleware/auth")
    // Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "../E-Commerce-Frontend/build")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/api/product-card-data", async(req, res, next) => {
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

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
});

app.delete("/api/delete-product/:id", async(req, res) => {
    const productID = req.params.id;

    try {
        const deletedProduct = await Product.findByIdAndRemove(productID);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/carousel-data", async(req, res, next) => {
    try {
        const carouselData = await Carousel.find();
        console.log(carouselData);
        res.json(carouselData);
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/search-data", async(req, res, next) => {
    try {
        const searchData = await Product.find({ productName: { $regex: `${req.query.search}`, $options: "i" } });
        console.log(searchData);
        const count = searchData.length;
        res.json({ count, data: searchData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/product-card-data-disc", async(req, res, next) => {
    try {
        console.log("hi")
        const productCardData = await Product.find({ discount: { $gt: 0 } });
        const formattedData = productCardData.map((product) => {
            return {
                ...product._doc,
                price: product.price.toString() // Convert price to string
            };
        });
        res.json(formattedData);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
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
app.post("/register", async(req, res) => {
    try {
        console.log("Received data:", req.body);
        const { Username, FirstName, LastName, Email, Password, Address, Phone } =
        req.body;

        encryptedPassword = await bcrypt.hash(Password, 10);
        const existingUser = await User.findOne({
            $or: [{ email: Email }, { username: Username }, { phone: Phone }]
        });
        if (existingUser) {
            if (existingUser.email === Email) {
                res.status(403).json({ message: "Email already registered" });
            } else if (existingUser.username === Username) {
                res.status(403).json({ message: "Username already taken" });
            } else {
                res.status(403).json({ message: "Phone number already registered" });
            }
        } else {
            const expiresIn = 2 * 60 * 60
            const tokenKey = "Pr0J3cTB3rSAm4B40b31"
            const token = jwt.sign({ tokenKey, Email },
                process.env.TOKEN_KEY, {
                    expiresIn: expiresIn,
                }
            )
            const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const expirationTime = new Date(Date.now() + expiresIn * 1000);
            const expirationTimeGMT7 = expirationTime.toLocaleDateString('en-US', options);
            const expirationTimeGMT7Date = new Date(expirationTimeGMT7);
            const user = new User({
                username: Username,
                firstName: FirstName,
                lastName: LastName,
                email: Email,
                password: encryptedPassword,
                address: Address,
                phone: Phone,
            });

            await user.save();

    res.json({ message: "Registration successful" });
        }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

//  Update Profile

// Get Profile detail
app.get("/api/profile-detail-data",async(req,res)=>{
  try {
    const username = req.query.username
    const profileData = await Product.findOne({username : username});
    res.json(profileData);
  }catch(error){
    console.error(error)
    res.status(500).json({message : 'Server Error'})
  }
});

// Edit Profile
app.patch("/edit-profile", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { Username, FirstName, LastName, Email, Password, Address, Phone } =
      req.body;

    encryptedPassword = await bcrypt.hash(Password, 10);

    console.log("save to::", imgPath);

    // Save the user to the database
    await User.updateOne({"username": body.username}, {
      $set: {
        "username": Username,
        "firstName": FirstName,
        "lastName": LastName,
        "email": Email,
        "password": encryptedPassword,
        "address": Address,
        "phone": Phone,
      }
    },{ upsert: true });

    res.json({ message: "Edit Profile successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Edit Profile failed" });
  }
});

// Add Product
app.post("/add-product", upload.single('ProductImage'), async(req, res) => {
    try {
        console.log("Received data:", req.body);
        console.log("Received filename:", req.file.filename);

        const body = req.body;
        const imgPath = String(req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename)

        console.log("save to::", imgPath);
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

//  Update Product
// Edit Product
app.patch("/edit-product", upload.single('ProductImage'), async(req, res) => {
    try {
        console.log("Received data:", req.body);
        console.log("Received filename:", req.file.filename);

        const body = req.body;
        const imgPath = String(req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename)

        console.log("save to::", imgPath);

        // Save the user to the database
        await Product.updateOne({ "_id": body.id }, {
            $set: {
                "productName": body.ProductName,
                "price": body.Price,
                "description": body.Description,
                "qty": body.Qty,
                "discount": body.Discount,
                "productImage": req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename
            }
        }, { upsert: true });

        res.json({ message: "Edit Product successful" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Edit Product failed" });
    }
});

// Product Detail
app.get("/api/product-detail-data", async(req, res, next) => {
    try {
        console.log("heh")
        const productId = req.query.id
        const productData = await Product.findOne({ _id: productId });
        res.json(productData);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
    }
});

// Login
app.post("/api/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!(email && password)){
      res.status(400).send("All field must be filled");
    }
    console.log(email,password)
    const user = await User.findOne({email});
    console.log(user);
    if(user&&(bcrypt.compare(password,user.password))){
       const token = jwt.sign({user_id:user._id, email},
        process.env.TOKEN_KEY,{
          expiresIn:"2h",
        })
        if (user && (bcrypt.compare(password, user.password))) {
            const tokenKey = "Pr0J3cTB3rSAm4B40b31"
            const expiresIn = 2 * 60 * 60
            const token = jwt.sign({ tokenKey, email },
                process.env.TOKEN_KEY, {
                    expiresIn: expiresIn,
                }
            )
            const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const expirationTime = new Date(Date.now() + expiresIn * 1000);
            const expirationTimeGMT7 = expirationTime.toLocaleDateString('en-US', options);
            const expirationTimeGMT7Date = new Date(expirationTimeGMT7);
            await User.updateOne({ "email": email }, {
                $set: {
                    "token": token,
                    "isActive": 1,
                }
            }, { upsert: true });

            console.log("Token Expiration Time:", expirationTimeGMT7Date);
            console.log(token)
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Account Not Found!" })
        }
    }
    } catch (err) {
        res.status(404).json(err)
        console.log(err)
    }
})

app.get('/check-authorization', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Authorization check passed!', user: req.user });
});

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../E-Commerce-Frontend/build", "index.html")
    );
});

// Start the server
app.listen(5000, () => {
    console.log("Server is running nicely");
});
