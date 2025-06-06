require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin : process.env.CLIENT_URL || "*",
        methods : ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders : ["Content-Type", "Authorization"],
    })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Serve Upload folder
app.use("/uploads",
    express.static(path.join(__dirname, "uploads"), {
        setHeaders : (res, path) => {
            res.set("Access-Control-Allow-Origin", "https://resume-builder-app-i9y7.onrender.com");
        },
    })
);
// app.use(
//     "/uploads",
//     express.static(path.join(__dirname, "uploads"), {
//         setHeaders : (res, path) => {
//             // Replace with Hosted frontend URL
//             const allowedOrigins = ["http://localhost:5173", "https://your-app.onrender.com"];
//             const origin = res.req.headers.origin;
            
//             if(allowedOrigins.includes(origin)){
//                 res.set("Access-Control-Allow-Origin", origin);
//             }
//         },
//     })
// );

// Start Server
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});