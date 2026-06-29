const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const File = require("../models/File");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  uploadFile,
  deleteFile,
   renameFile,
     downloadFile,
} = require("../controllers/fileController");

/* =========================
   MULTER STORAGE
========================= */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../uploads"));
//   },

//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // optional 10MB limit
});

/* =========================
   UPLOAD FILE
========================= */
// router.post(
//   "/upload",
//   upload.single("file"),

//   (req, res, next) => {
//     console.log("FILE:", req.file);
//     console.log("BODY:", req.body);
//     next();
//   },

//   uploadFile
// );

router.post(
  "/upload",
  authMiddleware,
  roleMiddleware("DATA_OWNER"),
  upload.single("file"),
  (req, res, next) => {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    next();
  },
  uploadFile
);
/* =========================
   GET ALL FILES
========================= */
router.get(
  "/all-files",
  authMiddleware,
  roleMiddleware("DATA_OWNER"),
  async (req, res) => {
  try {
    const files = await File.find();

    res.json({
      success: true,
      files,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
   SEARCH FILES
========================= */
router.get(
  "/search",
  authMiddleware,
  roleMiddleware("DATA_USER"),
  async (req, res) => {
  try {
    const keyword = req.query.keyword;

    const files = await File.find({
      keywords: {
        $regex: keyword,
        $options: "i",
      },
    });

    res.json({
      success: true,
      files,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
   DELETE FILE
========================= */
router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware("DATA_OWNER"),
  deleteFile
);
// RENAME
router.put(
  "/rename/:id",
  authMiddleware,
  roleMiddleware("DATA_OWNER"),
  renameFile
);








// 👇 ADD THIS HERE
router.get("/debug-supabase", async (req, res) => {
  console.log("URL:", process.env.SUPABASE_URL);
  console.log("KEY LAST 10:", process.env.SUPABASE_SERVICE_KEY?.slice(-10));

  const { data, error } = await supabase.storage.listBuckets();

  res.json({ data, error });
});




const fs = require("fs");

// router.get(
//   "/download/:filename",
//   authMiddleware,
//   roleMiddleware("DATA_USER"),
//   (req, res) => {

//     const filePath = path.join(
//       __dirname,
//       "../uploads",
//       req.params.filename
//     );

//     console.log("Downloading:", filePath);

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({
//         success: false,
//         message: "File not found",
//         path: filePath
//       });
//     }

//     res.download(filePath);
//   }
// );


// router.get(
//   "/download/:id",
//   authMiddleware,
//   roleMiddleware("DATA_USER", "DATA_OWNER"),
//   async (req, res) => {
//     try {
//       const file = await File.findById(req.params.id);

//       if (!file) {
//         return res.status(404).json({
//           success: false,
//           message: "File not found",
//         });
//       }

//       const filePath = path.join(
//         __dirname,
//         "../uploads",
//         file.storedFileName   // ✅ FIX HERE
//       );

//       if (!fs.existsSync(filePath)) {
//         return res.status(404).json({
//           success: false,
//           message: "File not found on server",
//         });
//       }

//       return res.download(filePath);

//     } catch (err) {
//       console.log(err);
//       res.status(500).json({
//         success: false,
//         message: err.message,
//       });
//     }
//   }
// );
router.get(
  "/download/:id",
  authMiddleware,
  roleMiddleware("DATA_USER", "DATA_OWNER"),
  downloadFile
);

module.exports = router;