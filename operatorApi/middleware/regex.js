// vérification des saisies utilisateur

exports.pseudoValidation =(req,res,next)=>{
  var regexarticle = new RegExp("^[a-zA-Z0-9]+$");
  // exclut tous ce qui n'est pas alphanumérique 
  if (
    !regexarticle.test(req.body.pseudo)
  ) {
    res.status(400).json({
      error:
        "Veillez à n'utiliser que des chiffres et des lettres pour votre pseudo sans espace",
    });
  } else {
    next();
  }
}


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
