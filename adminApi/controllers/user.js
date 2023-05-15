const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//ADMIN

exports.createAdmin = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        right: "Admin",
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((err) => res.status(401).json({ err }));
    })
    .catch((error) => res.status(500).json({ error }));
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



exports.modifyUser = (req, res, next) => {
  console.log(req);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;
  const userPower = decodedToken.userRight;

  User.findOne({ _id: req.params.id }).then((user) => {
    if (user._id == userId && userPower === 2){
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const userMod = req.body
            ? {
                password: hash,
              }
            : { ...req.body };

          User.updateOne({ ...userMod, _id: req.params.id })
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

exports.getOne = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    User.findOne({ _id: req.params.id })
      .select("-password")
      .then((user) => {
        test = user._id;
        if (userId == user._id && userPower === 2) {
          res.status(200).json(user);
        } else {
          res.status(401).json({
            message: "vous n'avez pas les droits pour cette requête",
            userId,
            test,
          });
        }
      })

      .catch((err) =>
        res
          .status(401)
          .json({ err, message: "erreur serveur ou identifiant invalide" })
      );
  } else {
    res.status(401).json({
      error:
        "token invalide ou vous devez être login pour voir ces informations !",
    });
  }
};

//admin+SuperAdmin request

exports.getAll = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  //vérif que l'utilisateur est log
  const userPower = decodedToken.userRight;

  if (decodedToken) {
    User.find()
      .select("-password")

      .then((user) => {
        if (userPower === 1 || userPower === 2) {
          res.status(200).json(user);
        } else {
          res
            .status(401)
            .json({ message: "vous n'avez pas les droits pour cette requête" });
        }
      })

      .catch((err) => res.status(401).json({ err }));
  } else {
    res.status(401).json({
      error:
        "token invalide ou vous devez être login pour voir ces informations !",
    });
  }
};
