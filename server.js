const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db");
const bodyParser = require("body-parser");

const app = express();
const User = require("./Models/User");
// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.static(path.join(__dirname, "../E-Commerce-Frontend/build")));

// For rendering React file

app.use(express.static(path.join(__dirname, "../E-Commerce-Frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../E-Commerce-Frontend/build", "index.html")
  );
});

app.get("/register", (req, res) => {
  console.log("register");
});

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
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running nicely");
});
