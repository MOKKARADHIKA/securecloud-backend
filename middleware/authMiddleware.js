// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {

//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "No Token Provided"
//     });
//   }

//   try {

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     req.user = decoded;

//     next();

//   } catch (error) {

//     return res.status(401).json({
//       success: false,
//       message: "Invalid Token"
//     });

//   }
// };

// module.exports = authMiddleware;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No Token Provided",
      });
    }

    // ✅ Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token format invalid (use Bearer token)",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

module.exports = authMiddleware;