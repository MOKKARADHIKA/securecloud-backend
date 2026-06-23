// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");
// require("dotenv").config();

// const authRoutes = require("./routes/auth");
// const fileRoutes = require("./routes/fileRoutes");

// const app = express();

// // MIDDLEWARE
// // app.use(cors());
// app.use(
//   cors({
//     origin: 
//       "*"
    
    
//   })
// );
// app.use(express.json());

// // 🔥 IMPORTANT: STATIC FILE ACCESS (UPLOADS)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ROUTES
// app.use("/api/auth", authRoutes);
// app.use("/api/files", fileRoutes);

// // MONGODB CONNECTION
// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));

// // TEST ROUTE
// app.get("/", (req, res) => {
//   res.send("Backend is Running...");
// });

// // SERVER START
// // app.listen(5000, () => {
// //   console.log("Server running on port 5000");
// // });


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

/* =========================
   CORS CONFIG (FIXED)
========================= */

const allowedOrigins = [
  "http://localhost:5173",
    "http://localhost:5174",
      "http://localhost:5175",
  "https://securecloud-frontend.vercel.app" // replace with your REAL frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// Handle preflight requests
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

/* =========================
   STATIC FILES
========================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

/* =========================
   MONGODB
========================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Backend is Running...");
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});