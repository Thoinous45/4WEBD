const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Operator = require("../models/operator");
const User = require("../models/user");

require("dotenv").config();

exports.createAdmin = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new Admin({
        email: req.body.email,
        password: hash,
        right: "Admin",
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((err) => res.status(401).json({ err }));
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error, message: "erreur serveur ou donnée invalide" })
    );
};

exports.createOperator = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    if (userPower == "Admin") {
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

exports.login = (req, res, next) => {
  Admin.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          return res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              {
                userRight: user.right,
                userEmail: user.email,
              },
              process.env.TOKEN_KEY,
              {
                expiresIn: "1d",
              }
            ),
          });
        })
        .catch((error) =>
          res.status(400).json({
            error,
            message: "erreur serveur ou identifiant invalide",
            user,
          })
        );
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error, message: "erreur serveur ou identifiant invalide" })
    );
};

exports.modifyAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    if (userPower == "Admin") {
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const user = new Admin({
            email: req.body.email,
            password: hash,
            right: "Admin",
          });

          user
            .updateOne({ _id: req.params.id }, user)
            .then(() => res.status(201).json({ message: "Administrateur modifié !" }))
            .catch((err) => res.status(401).json({ err }));
        })
        .catch((error) =>
          res
            .status(500)
            .json({ error, message: "erreur serveur ou donnée invalide" })
        );
    } else {
      res.status(402).json({
        message: "vous n'avez pas les droits pour cette requête",
      });
    }
  }
}

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


exports.deleteOperator = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;

  Operator.findOne({ _id: req.params.id })
    .then((user) => {
      if (user._id == userId) {
        user
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "utilisateur supprimé" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({
          message: "Vous ne disposez pas des droits pour supprimer cet user !",
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};