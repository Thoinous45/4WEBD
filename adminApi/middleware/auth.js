// verification du token de l'utilisateur

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    

    if (!decodedToken) {
      throw "Utilisateur non autorisé";
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({message:"token invalide ou inexistant", error: error | "Requête non authentifiée !" });
  }
};
