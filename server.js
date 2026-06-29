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

const path = require("path");

require("dotenv").config();

const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/fileRoutes");

const supabase = require("./config/supabase");

const app = express();

// connectDB();

/* =========================
   CORS
========================= */
app.use(cors({
  origin: "*",   // TEMP FIX (IMPORTANT for debugging)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));





/* =========================
   DB (MOVE INSIDE SAFELY)
========================= */


/* Lazy DB connection (IMPORTANT FIX) */
let isConnected = false;

const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});




/* =========================
   STATIC FILES
========================= */

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("Backend is Running...");
});

app.get("/debug-env", (req, res) => {
  res.json({
    mongo: !!process.env.MONGO_URI,
    jwt: !!process.env.JWT_SECRET,
  });
});

const PORT = process.env.PORT || 5001;

// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// }

module.exports = app;