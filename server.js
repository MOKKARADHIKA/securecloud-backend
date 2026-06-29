

// const express = require("express");
// const cors = require("cors");

// const path = require("path");

// require("dotenv").config();

// const connectDB = require("./db");

// const authRoutes = require("./routes/auth");
// const fileRoutes = require("./routes/fileRoutes");

// const supabase = require("./config/supabase");

// const app = express();

// // connectDB();

// /* =========================
//    CORS
// ========================= */
// app.use(cors({
//   origin: "*",   // TEMP FIX (IMPORTANT for debugging)
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.options("*", cors());

// /* =========================
//    MIDDLEWARE
// ========================= */

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));





// /* =========================
//    DB (MOVE INSIDE SAFELY)
// ========================= */


// /* Lazy DB connection (IMPORTANT FIX) */
// let isConnected = false;

// const ensureDB = async () => {
//   if (!isConnected) {
//     await connectDB();
//     isConnected = true;
//   }
// };

// app.use(async (req, res, next) => {
//   await ensureDB();
//   next();
// });




// /* =========================
//    STATIC FILES
// ========================= */

// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// /* =========================
//    ROUTES
// ========================= */

// app.use("/api/auth", authRoutes);
// app.use("/api/files", fileRoutes);

// /* =========================
//    TEST ROUTE
// ========================= */

// app.get("/", (req, res) => {
//   res.send("Backend is Running...");
// });

// app.get("/debug-env", (req, res) => {
//   res.json({
//     mongo: !!process.env.MONGO_URI,
//     jwt: !!process.env.JWT_SECRET,
//   });
// });

// const PORT = process.env.PORT || 5001;

// // if (require.main === module) {
// //   app.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT}`);
// //   });
// // }

// module.exports = app;

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db");

const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

/* =========================
   CONNECT DB
========================= */
connectDB();

/* =========================
   CORS (FINAL FIX - IMPORTANT)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://securecloud-frontend.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman or server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true); // DEV SAFE MODE (no blocking)
    },
    credentials: true,
  })
);

/* IMPORTANT: preflight */
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("SecureCloud API Running");
});

/* =========================
   EXPORT FOR VERCEL
========================= */
module.exports = app;