// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Expect "Authorization: Bearer <token>"
    const auth = req.headers.authorization || "";
    const isBearer = auth.startsWith("Bearer ");
    if (!isBearer) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // { userId, iat, exp }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }
};
