var express = require("express");
var router = express.Router();

const userModel = require("../models/userModel");

const nodemailer = require("nodemailer");

const PDFDocument = require("pdfkit");

//function qui programme l'emailing
function sendEmail() {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "monemail",
        //il faut le récupérer dans les settings sécurité de gmail et ne pas avoir une adresse entreprise
        pass: "monmdp",
      },
    });
    //email with attachement
    const mail_configs2 = {
      from: "devDaly21@gmail.com",
      to: "daly@18avenue.fr",
      subject: "formulaire recherche client",
      text: "Just checking",
      attachments: [
        {
          filename: "edl.pdf",
          path: `${__dirname}/edl.pdf`,
        },
      ],
    };

    transporter.sendMail(mail_configs2, (error, info) => {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfully" });
    });
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
}

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// router d'enregistrement d'un nouvel utilisateur
router.post("/api/registerUser", async function (req, res, next) {
  var error = [];

  // Save a new user
  const userDataBase = await userModel.findOne({
    email: req.body.email,
  });
  if (userDataBase != null) {
    error.push("utilisateur déjà présent");
  }
  if (error.length === 0) {
    var newUser = new userModel({
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      userResearch: {
        transactionType: req.body.transactionType,
        location: {
          area1: req.body.location.area1,
          area2: req.body.location.area2,
          area3: req.body.location.area3,
          area4: req.body.location.area4,
          area5: req.body.location.area5,
          area6: req.body.location.area6,
        },
        numberOfRoom: req.body.numberOfRoom,
        surface: req.body.surface,
        maxBudget: req.body.maxBudget,
        sellForecast: req.body.sellForecast,
      },
    });

    var savedUser = await newUser.save();

    res.json({ user: savedUser, message: "Utilisateur bien enregistré" });
  }
});

// route de création du 1er PDF
router.post("/api/createPdf", async (req, res, next) => {
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
    font: "Courier",
  });
  const fs = require("fs");

  doc.fontSize(20).text(`Questionnaire Etat des lieux`);

  doc
    .fontSize(12)
    .text("Pensez-vous que l'appartement est relouable en l'état?");
  doc.fontSize(12).text(`Réponse:${req.body.question1}`);
  doc.fontSize(12).text("Y a-t-il des peintures dégradées dans le logement?");
  doc.fontSize(12).text(`Réponse:${req.body.question2}`);
  doc.fontSize(12).text("Y a-t-il des traces de moisissures dans le logement?");
  doc.fontSize(12).text(`Réponse:${req.body.question3}`);
  doc
    .fontSize(12)
    .text("Le plan de travail de la cuisine est-il en bonne état?");
  doc.fontSize(12).text(`Réponse:${req.body.question4}`);
  doc
    .fontSize(12)
    .text(
      "Dans quel état sont les joints silicones dans la salle de bain, et la cuisne??"
    );
  doc.fontSize(12).text(`Réponse:${req.body.question5}`);
  doc.fontSize(12).text("Le parquet est-il à poncer?");
  doc.fontSize(12).text(`Réponse:${req.body.question6}`);
  doc
    .fontSize(12)
    .text(
      "Etes-vous disposé(e) à nous laisser faire des visites avant votre départ ?"
    );
  doc.fontSize(12).text(`Réponse:${req.body.question7}`);

  doc.fontSize(12).text(`Nom:${req.body.lastName}`);
  doc.fontSize(12).text(`Email:${req.body.email}`);
  doc.fontSize(12).text(`Numéro de Téléphone:${req.body.phoneNumber}`);

  //voila cette ligne m'enregistre le  pdf !!
  doc.pipe(fs.createWriteStream("./routes/edl.pdf"));

  doc.end();

  res.json({ message: "ok", result: "pdf created" });
});

// route de création du 2e PDf
router.post("/api/createPdfFormulaire", async (req, res, next) => {
  console.log(req.body);

  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
    font: "Courier",
  });
  const fs = require("fs");

  doc.fontSize(20).text(`Formulaire recherche de biens`);

  doc.fontSize(12).text("Que recherchez vous ?");
  doc.fontSize(12).text(`Réponse:${req.body.transactionType}`);
  doc.fontSize(12).text("Vous recherchez un bien dans quel secteur ?");
  doc.fontSize(12).text(`Réponse:${req.body.location}`);
  doc.fontSize(12).text("De combien de chambre avez-vous besoin ?");
  doc.fontSize(12).text(`Réponse:${req.body.numberOfRoom}`);
  doc.fontSize(12).text("Quelle surface recherchez-vous :");
  doc.fontSize(12).text(`Réponse:${req.body.surface}`);
  doc.fontSize(12).text("Quel est votre budget max € :");
  doc.fontSize(12).text(`Réponse:${req.body.maxBudget}`);
  doc
    .fontSize(12)
    .text(
      "Dans le cadre d'un achat . Avez-vous prévu de vendre un bien pour faire cette acquisition ?"
    );
  doc.fontSize(12).text(`Réponse:${req.body.maxBudget}`);

  doc.fontSize(12).text(`Nom:${req.body.lastName}`);
  doc.fontSize(12).text(`Email:${req.body.email}`);
  doc.fontSize(12).text(`Numéro de Téléphone:${req.body.phoneNumber}`);

  //voila cette ligne m'enregistre le  pdf !!
  doc.pipe(fs.createWriteStream("./routes/edl.pdf"));

  doc.end();

  res.json({ message: "formulaire pdf created" });
});

// route d'envoie de l'email
router.get("/api/sendEmail", async (req, res, next) => {
  sendEmail()
    .then((result) => {
      console.log("--->", result);
      if (result) {
        res.send({ result: result });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err) {
        res.send({ error: err });
      }
    });
});

//Route pour une version démo uniquement
router.post("/api/sendEmailTuto", async (req, res, next) => {
  const userEmail = req.body.email;

  new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "devDaly21@gmail.com",
        pass: "hdqnuxzaramystpv",
      },
    });
    //email with attachement
    const mail_configs2 = {
      from: "devDaly21@gmail.com",
      to: userEmail,
      subject: "Web service test",
      text: "Merci d'avoir testé mon app!",
      attachments: [
        {
          filename: "edl.pdf",
          path: `${__dirname}/edl.pdf`,
        },
      ],
    };

    transporter.sendMail(mail_configs2, (error, info) => {
      if (error) {
        console.log(error);
        return res.send(reject({ message: `An error has occured` }));
      }
      return res.send(resolve({ message: "Email sent succesfully" }));
    });
  });
});

module.exports = router;
