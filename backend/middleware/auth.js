import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    
    token = token.split(" ")[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      }

      req.user = decoded;
      next(); 
    });
  } else {
    return res.status(401).json({ message: "Token not provided" });
  }
};
export default verifyToken;

