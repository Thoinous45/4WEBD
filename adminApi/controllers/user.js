const mongoose  = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection=require("../dbAccess");
const {Admin,operator,user}=require("../dbAccess");
const Operator = connection.operator;
const User = connection.user;
//ADMIN 

exports.createAdmin = (req, res, next) => {
  
      const admin = new Admin({
        email: req.body.email,
        password: "test",
        right: "Admin",
      });

      admin
        .save()
        .then(() => res.status(201).json({ message: "Administrateur créé !" }))
        .catch((err) =>
          res.status(401).json({ message: "erreur serveur ou donnée invalide" })
        );
    
      res.status(500).json({ message: "erreur serveur ou donnée invalide", Admin })
   
};

exports.createOperator = (req, res, next) => {
  bcrypt
    .hash("operator123!", 10)
    .then((hash) => {
      const operator = new Operator({
        email: req.body.email,
        password: hash,
        right: "Operator",
      });

      operator
        .save()
        .then(() => res.status(201).json({ message: "Operateur créé !" }))
        .catch((err) => res.status(401).json({ err }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userPower = decodedToken.userRight;

  if (userPower == "Admin") {
    Admin.findOne({ email: req.body.email })
      .then((admin) => {
        bcrypt
          .compare(req.body.password, admin.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ error: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              adminId: admin._id,
              token: jwt.sign(
                { Id: admin._id, userRight: admin.right },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "1d",
                }
              ),
            });
            bouncer.reset(req);
          })
          .catch((error) =>
            res.status(400).json({
              error,
              message: "erreur serveur ou identifiant invalide",
            })
          );
      })
      .catch((error) =>
        res
          .status(500)
          .json({ error, message: "erreur serveur ou identifiant invalide" })
      );
  } else {
    res.status(401).json({
      message: "vous n'avez pas les droits pour cette requête",
    });
  }
};

exports.getOneAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    if (userPower == "Admin") {
      Admin.findOne({ _id: req.params.id })
        .select("-password")
        .then((admin) => {
          res.status(200).json(admin);
        })
        .catch((err) =>
          res
            .status(401)
            .json({ err, message: "erreur serveur ou identifiant invalide" })
        );
    } else {
      res.status(402).json({
        message: "vous n'avez pas les droits pour cette requête",
      });
    }
  } else {
    res.status(401).json({
      error:
        "token invalide ou vous devez être login pour voir ces informations !",
    });
  }
};

exports.getOneOperator = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    if (userPower == "Admin") {
      Operator.findOne({ _id: req.params.id })
        .select("-password")
        .then((operator) => {
          res.status(200).json(operator);
        })
        .catch((err) =>
          res
            .status(401)
            .json({ err, message: "erreur serveur ou identifiant invalide" })
        );
    } else {
      res.status(402).json({
        message: "vous n'avez pas les droits pour cette requête",
      });
    }
  } else {
    res.status(401).json({
      error:
        "token invalide ou vous devez être login pour voir ces informations !",
    });
  }
};

exports.getOneUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    if (userPower == "Admin") {
      User.findOne({ _id: req.params.id })
        .select("-password")
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) =>
          res
            .status(401)
            .json({ err, message: "erreur serveur ou identifiant invalide" })
        );
    } else {
      res.status(402).json({
        message: "vous n'avez pas les droits pour cette requête",
      });
    }
  } else {
    res.status(401).json({
      error:
        "token invalide ou vous devez être login pour voir ces informations !",
    });
  }
};

exports.getAllAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  //vérif que l'utilisateur est log
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    if (userPower == "Admin") {
      Admin.find()
        .select("-password")
        .then((admin) => {
          res.status(200).json(admin);
        })

        .catch((err) => res.status(401).json({ err }));
    } else {
      res.status(401).json({
        error:
          "token invalide ou vous devez être login pour voir ces informations !",
      });
    }
  } else {
    res.status(401).json({
      message: "vous n'avez pas les droits pour cette requête",
    });
  }
};

exports.getAllOperator = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  //vérif que l'utilisateur est log
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    if (userPower == "Admin") {
      Operator.find()
        .select("-password")

        .then((user) => {
          res.status(200).json(user);
        })

        .catch((err) => res.status(401).json({ err }));
    } else {
      res.status(401).json({
        error:
          "token invalide ou vous devez être login pour voir ces informations !",
      });
    }
  } else {
    res.status(401).json({
      message: "vous n'avez pas les droits pour cette requête",
    });
  }
};

exports.getAllUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  //vérif que l'utilisateur est log
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    if (userPower == "Admin") {
      User.find()
        .select("-password")
        .then((user) => {
          res.status(200).json(user);
        })

        .catch((err) => res.status(401).json({ err }));
    } else {
      res.status(401).json({
        error:
          "token invalide ou vous devez être login pour voir ces informations !",
      });
    }
  } else {
    res.status(401).json({
      message: "vous n'avez pas les droits pour cette requête",
    });
  }
};
