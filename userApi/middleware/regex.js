// vérification des saisies utilisateur


exports.authValidation = (req, res, next) => {
  var regexMail = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );
  let email = req.body.email;

  if (regexMail.test(email)) {
    next();
  } else {
    res
      .status(400)
      .json({ error: "Veillez à utiliser une adresse email valide" });
  }
};


exports.firstnameValidation = (req, res, next) => {
  //right me a regex for firstname: letter and éèàçù with one - or space
  var regexFirstname = new RegExp("^[a-zA-Zéèàçù]+$");
  let firstname = req.body.firstname;

  if (regexFirstname.test(firstname)) {
    next();
  } else {
    res.status(400).json({ error: "Veillez à utiliser un prénom valide" });
  }
};

exports.lastnameValidation = (req, res, next) => {
  var regexLastname = new RegExp("^[a-zA-Z]+$");
  let lastname = req.body.lastname;

  if (regexLastname.test(lastname)) {
    next();
  } else {
    res.status(400).json({ error: "Veillez à utiliser un nom valide" });
  }
}
