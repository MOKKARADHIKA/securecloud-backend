





const File = require("../models/File");
const CryptoJS = require("crypto-js");
const supabase = require("../config/supabase");
const fs = require("fs");

const testSupabase = async () => {
  console.log("SUPABASE URL =", process.env.SUPABASE_URL);

  const { data, error } = await supabase.storage.listBuckets();

  console.log("BUCKETS =", data);
  console.log("ERROR =", error);
};

testSupabase();

// // UPLOAD FILE
// const uploadFile = async (req, res) => {
//   try {
//     const keywordArray = (req.body.keywords || "")
//       .toString()
//       .split(",")
//       .map((k) => k.trim())
//       .filter(Boolean);

//     const encryptedName = CryptoJS.AES.encrypt(
//       req.file.originalname,
//       process.env.AES_SECRET
//     ).toString();

// const uploadFile = async (req, res) => {
//   try {

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file received"
//       });
//     }

//     console.log("FILE =", req.file);
//     console.log("BODY =", req.body);

//     const keywordArray = (req.body.keywords || "")
//       .toString()
//       .split(",")
//       .map((k) => k.trim())
//       .filter(Boolean);

//     const encryptedName = CryptoJS.AES.encrypt(
//       req.file.originalname,
//       process.env.AES_SECRET
//     ).toString();

//     // rest of code...

//     const file = await File.create({
//   fileName: req.file.originalname,
//   storedFileName: req.file.filename, // IMPORTANT
//   encryptedFileName: encryptedName,
//   filePath: req.file.path,
//   keywords: keywordArray,
// });

//     res.json({
//       success: true,
//       file,
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };


// const uploadFile = async (req, res) => {
//   try {

//     console.log("REQ.FILE =", req.file);
//     console.log("REQ.BODY =", req.body);

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file received by multer"
//       });
//     }

//     const keywordArray = (req.body.keywords || "")
//       .toString()
//       .split(",")
//       .map((k) => k.trim())
//       .filter(Boolean);

//     const encryptedName = CryptoJS.AES.encrypt(
//       req.file.originalname,
//       process.env.AES_SECRET
//     ).toString();

//     // remaining code...

//     const file = await File.create({
//       fileName: req.file.originalname,
//       storedFileName: req.file.filename,
//       encryptedFileName: encryptedName,
//       filePath: req.file.path,
//       keywords: keywordArray,
//     });

//     res.json({
//       success: true,
//       file,
//     });

//   } catch (err) {
//     console.log("UPLOAD ERROR =", err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// ------------------------------------------DOWNLOAD FILE------------------------------------



// const downloadFile = async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);

//     if (!file) {
//       return res.status(404).json({
//         success: false,
//         message: "File not found",
//       });
//     }

//     const downloadUrl = cloudinary.url(file.storedFileName, {
//       resource_type: "raw",
//       type: "upload",
//       flags: "attachment",
//       secure: true,
//     });

//     res.json({
//       success: true,
//       downloadUrl,
//     });

//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const { data } = supabase.storage
      .from("securecloud")
      .getPublicUrl(file.storedFileName);

    return res.json({
      success: true,
      downloadUrl: data.publicUrl,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};




// ----------------UPLOAD FILE-------------------------------




// const uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file received",
//       });
//     }

//     const keywordArray = (req.body.keywords || "")
//       .toString()
//       .split(",")
//       .map((k) => k.trim())
//       .filter(Boolean);

//     // Upload file to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       resource_type: "raw",      // for PDFs and documents
//       folder: "securecloud",
//       use_filename: true,
//       unique_filename: true,
//     });

//     console.log("Cloudinary Upload Result:");
// console.log(result);

//     // Delete local temporary file
//     fs.unlinkSync(req.file.path);

//     const encryptedName = CryptoJS.AES.encrypt(
//       req.file.originalname,
//       process.env.AES_SECRET
//     ).toString();

//     // const file = await File.create({
//     //   fileName: req.file.originalname,
//     //   storedFileName: result.public_id,
//     //   encryptedFileName: encryptedName,
//     //   filePath: result.secure_url,
//     //   keywords: keywordArray,
//     // });

//     const file = await File.create({
//   fileName: req.file.originalname,
//   storedFileName: result.public_id,
//   encryptedFileName: encryptedName,
//   filePath: result.secure_url,
//   keywords: keywordArray,
// });
//     res.json({
//       success: true,
//       file,
//     });

//   } catch (err) {
//     console.log("UPLOAD ERROR:", err);

//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file received",
      });
    }

    console.log("FILE RECEIVED ✔", req.file.originalname);
    console.log("BUFFER EXISTS ✔", !!req.file.buffer);

    const keywordArray = (req.body.keywords || "")
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);

    // IMPORTANT: use buffer (NOT fs)
    const fileBuffer = req.file.buffer;

    const fileName = `${Date.now()}-${req.file.originalname}`;

    // SUPABASE UPLOAD
    const { data, error } = await supabase.storage
      .from("securecloud")
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.log("SUPABASE ERROR ❌", error);
      return res.status(500).json({ success: false, message: error.message });
    }

    // PUBLIC URL
    const publicUrl = supabase.storage
      .from("securecloud")
      .getPublicUrl(fileName).data.publicUrl;

    // OPTIONAL ENCRYPTION
    const encryptedName = CryptoJS.AES.encrypt(
      req.file.originalname,
      process.env.AES_SECRET
    ).toString();

    // SAVE TO MONGO
    const file = await File.create({
      fileName: req.file.originalname,
      storedFileName: fileName,
      encryptedFileName: encryptedName,
      filePath: publicUrl,
      keywords: keywordArray,
    });

    return res.json({
      success: true,
      file,
    });

  } catch (err) {
    console.log("UPLOAD ERROR ❌", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// GET ALL FILES
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });

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
};

// SEARCH FILES
const searchFiles = async (req, res) => {
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
};

// DELETE FILE
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    await File.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//RENAME
// RENAME FILE
const renameFile = async (req, res) => {
  try {
    const { newName } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    file.fileName = newName;

    await file.save();

    res.json({
      success: true,
      message: "File renamed successfully",
      file,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
  searchFiles,
  deleteFile,
    renameFile,
      downloadFile,
};