const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

const User = require("./Models/users");
const Expense = require("./Models/expense");
const database = require("./utils/database");
const Order = require("./Models/orders");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "sandybhai", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  });
};
// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Define associations
Order.belongsTo(User); // Order belongs to a user
User.hasMany(Order); // User has many orders

// Signup API
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, "sandybhai");

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signin API
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Verify the user and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, "sandybhai");

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Add Expense API
app.post("/expenses", authenticateToken, async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    console.log("amount,description,category");

    const user = await User.findByPk(req.user.userId); // Find the authenticated user

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
    });

    await expense.setUser(user); // Associate the expense with the user ///very useful point to connect user to expense

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Expenses API
app.get("/expenses", authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { UserId: req.user.userId }, // Fetch expenses for the authenticated user only
      order: [["createdAt", "DESC"]], // Sort expenses by creation date in descending order
    });

    console.log(expenses); // Add this line to log the expenses array

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update Expense API
app.put("/expenses/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;

    const expense = await Expense.findOne({
      where: { id, UserId: req.user.userId }, // Find the expense by ID and user ID
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Update the expense properties
    expense.amount = amount;
    expense.description = description;
    expense.category = category;

    await expense.save(); // Save the updated expense

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Delete Expense API
app.delete("/expenses/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOne({
      where: { id, UserId: req.user.userId }, // Find the expense by ID and user ID
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await expense.destroy(); // Delete the expense

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const Razorpay = require("razorpay");

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: "rzp_test_YjiHLDNnRzK6x4",
  key_secret: "zbckQJ7Z1O1Q0kCKfeqAgPRg",
});
// Handle the purchase request
app.post("/purchase-premium", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Create an order with status PENDING and orderId as null
    const order = await Order.create({
      status: "PENDING",
      orderId: "placeholder_value", // Provide a placeholder value for orderId
    });

    // Generate a Razorpay order ID
    const options = {
      amount: 10000, // Example: 10000 represents ₹100.00
      currency: "INR",
      receipt: `order_${order.id}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Update the order with Razorpay order details
    await order.update({
      orderId: razorpayOrder.id, // Update orderId with Razorpay order ID
    });

    res.json({ orderId: razorpayOrder.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handle Razorpay webhook notification
app.post("/razorpay-webhook", async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === "payment.captured") {
      const { order_id } = payload;

      // Find the order by Razorpay order ID
      const order = await Order.findOne({ where: { orderId: order_id } });

      if (order) {
        // Update the order status to SUCCESSFUL
        await order.update({ status: "SUCCESSFUL" });

        // Make the current user a premium user (You need to implement this logic)

        // Send a response back to Razorpay
        res.sendStatus(200);
      } else {
        // Invalid order ID
        res.sendStatus(400);
      }
    } else if (event === "payment.failed") {
      // Handle payment failure event
      // You can update the order status to FAILED here if required

      // Send a response back to Razorpay
      res.sendStatus(200);
    } else {
      // Unsupported event
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
// Protected route example
app.get("/", authenticateToken, (req, res) => {
  // Access the authenticated user ID using req.user.userId
  // You can implement your logic here
  res.json({ message: "Protected route accessed successfully" });
});

// Start the server
database
  .sync({ force: false, alter: true })
  .then(() => {
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((err) => {
    console.log("error" + err);
  });
