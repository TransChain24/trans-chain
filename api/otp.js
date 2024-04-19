const { Router } = require("express");
const otp = Router();
const otpModel = require("./../models/otp");
const nodemailer = require("nodemailer");

otp.get("/sendOtp/:emailID", async (req, res) => {
  try {
    const { emailID } = req.params;
    let otp = Math.floor(1000 + Math.random() * 1000);
    console.log(emailID);

    let trasporter = nodemailer.createTransport({
      service: "email",
      host: "smtp.gmail.com",
      auth: {
        user: "transchain24@gmail.com",
        pass: "gtvd jmck ofkw xcwd",
      },
    });

    let mailOption = {
      from: "transchain24@gmail.com",
      to: `${emailID}`,
      subject: "TransChain OTP",
      text: `${otp} is your email verification code. Do not share this with anyone.`,
    };

    trasporter.sendMail(mailOption, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Otp sent on Email...");
      }
    });

    const data = new otpModel({ emailID: emailID, otp: otp });
    let saveData = await data.save();
    setTimeout(async () => {
      let deleteOtp = await otpModel.findOneAndDelete({ otp: otp });
    }, 5 * 60 * 1000);

    if (saveData) {
      res.send({ otp });
    } else {
      res.send("Otp error..");
    }
  } catch (error) {
    res.send(error);
  }
});

otp.get("/verifyOtp/:emailID/:otp", async (req, res) => {
  try {
    const removeOtp = await otpModel.findOneAndDelete({
      otp: req.params.otp,
      emailID: req.params.emailID,
    });
    if (removeOtp) {
      res.send({ status: true });
    } else {
      res.send({ status: "otp is wrong.." });
    }
  } catch (error) {
    res.send(error);
  }
});

module.exports = otp;
