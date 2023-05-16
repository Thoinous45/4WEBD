const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//user+admin+SuperAdmin request

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hash,
        right: "User",
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

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
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
                userId: user._id,
                userRight: user.right,
                userFirstname: user.firstname,
                userLastname: user.lastname,
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

exports.deleteUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;

  User.findOne({ _id: req.params.id })
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

exports.modifyUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;

  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user._id == userId) {
        let userMod = null;
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            userMod = req.body
              ? {
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  password: hash,
                }
              : { ...req.body };

            User.findOneAndUpdate({ _id: req.params.id, ...userMod })
              .then(() =>
                res.status(201).json({ message: "Utilisateur modifié !" })
              )
              .catch((error) => res.status(500).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.status(401).json({
          message: "Vous ne disposez pas des droits pour modifier cet user!",
        });
      }
    })
    .catch((error) =>
      res
        .status(500)
        .json({ message: "erreur ID utilisateur ou serveur", error })
    );
};
