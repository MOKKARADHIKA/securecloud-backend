// const roleMiddleware = (role) => {
//   return (req, res, next) => {

//     if (req.user.role !== role) {
//       return res.status(403).json({
//         success: false,
//         message: "Access Denied"
//       });
//     }

//     next();
//   };
// };

// module.exports = roleMiddleware;


const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.trim();

    console.log("ROLE CHECK:", userRole);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;