const Operator = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bouncer = require("express-bouncer")(120000, 1.8e6, 5);

//Operator Request


exports.login = (req, res, next) => {
  Operator.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id, userRight: user.right },
              process.env.TOKEN_KEY,
              {
                expiresIn: "1d",
              }
            ),
          });
          bouncer.reset(req);
        })
        .catch((error) =>
          res
            .status(400)
            .json({ error, message: "erreur serveur ou identifiant invalide" })
        );
    })
    .catch((error) =>
      res
        .status(500)
        .json({ error, message: "erreur serveur ou identifiant invalide" })
    );
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

exports.modifyOperator = (req, res, next) => {
    console.log(req)
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    const userPower = decodedToken.userRight;

    Operator.findOne({_id: req.params.id}).then((user) => {
        if (user._id == userId || userPower === 1 || userPower === 2) {
            bcrypt
                .hash(req.body.password, 10)
                .then((hash) => {
                    const userMod = req.body
                        ? {
                            password: hash,
                        }
                        : {...req.body};

          Operator.updateOne({ ...userMod, _id: req.params.id })
            .then(() =>
              res.status(201).json({ message: "Utilisateur modifié !" })
            )
            .catch((err) => res.status(401).json({ err }));
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
      res.status(401).json({
        message: "Vous ne disposez pas des droits pour modifier cet user!",
      });
    }
  });
};
