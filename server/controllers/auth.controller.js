const Users = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
//CUSTOM ERROR HANDLER TO GET USEFUL ERROR FROM DATABASE ERRORS
const { errorHandler } = require("../helper/dbErrHandlling");
//USING SEND EMAIL SENDGRID
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.MAIL_KEY);
exports.registerController = (req, res) => {
  const { username, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((err) => err.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    Users.findOne({ email }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "Email is taken",
        });
      }
    });
    const token = jwt.sign(
      {
        username,
        email,
        password,
      },
      process.env.ACCOUNT_ACTIVATION_SECRET,
      { expiresIn: "1h" }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account active link",
      html: `
        <h1>Please Click to link to active your account</h1>
        <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
        <hr/>
        <hr/>
        <p>This email contain sensitive infor</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
    };
    sendGridMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}`,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          error: errorHandler(err),
        });
      });
    // console.log({ username, email, password });
  }
};
//REGISTER DONE WHEN EMAIL SENT
exports.activationController = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.ACCOUNT_ACTIVATION_SECRET, (err, decode) => {
      if (err) {
        return res.status(400).json({ error: "Please Sign up again" });
      } else {
        const { username, email, password } = jwt.decode(token);
        const user = new Users({
          username,
          email,
          password,
        });
        user.save((err, user) => {
          if (err) {
            return res.status(401).json({ error: errorHandler(err) });
          } else {
            return res.json({
              success: true,
              message: "Register Successfully",
              user,
            });
          }
        });
      }
    });
  } else {
    return res.json({ error: "Somthing happened,please try again!" });
  }
};
exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((err) => err.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    Users.findOne({ email }).exec((err, user) => {
      if (err) {
        return res.status(400).json({ error: "Opp..User not found" });
      }
      if (!user.authenticate(password)) {
        return res
          .status(400)
          .json({ error: "Email or password does not match." });
      }
      const generateToken = jwt.sign(
        { _id: user._id },
        process.env.ACCOUNT_ACTIVATION_SECRET,
        { expiresIn: "7d" }
      );
      const { _id, username, email, role } = user;
      return res.json({
        success: true,
        message: "Login Successfully",
        token: generateToken,
        user: {
          _id,
          username,
          email,
          role,
        },
      });
    });
  }
};
exports.forgetPasswordController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((err) => err.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    Users.findOne({ email }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found with email",
        });
      } else {
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.RESET_PASSWORD_SECRET,
          { expiresIn: "10m" }
        );
        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Reset password link",
          html: `
        <h1>Please Click to link to reset your password</h1>
        <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
        <hr/>
        <hr/>
        <p>This email contain sensitive infor</p>
        <p>${process.env.CLIENT_URL}</p>
        `,
        };
        // sendGridMail
        //   .send(emailData)
        //   .then((sent) => {
        //     return res.json({
        //       message: `Email has been sent to ${email}`,
        //     });
        //   })
        //   .catch((err) => {
        //     return res.status(400).json({
        //       error: errorHandler(err),
        //     });
        //   });
        user.updateOne(
          {
            reset_pass_link: token,
          },
          (err, success) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            } else {
              sendGridMail
                .send(emailData)
                .then((sent) => {
                  return res.json({
                    message: `Email has been sent to ${email}`,
                  });
                })
                .catch((err) => {
                  return res.status(400).json({
                    error: errorHandler(err),
                  });
                });
            }
          }
        );
      }
    });
  }
};
exports.resetPasswordController = (req, res) => {
  const { password, token } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((err) => err.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    jwt.verify(token, process.env.RESET_PASSWORD_SECRET, (err, decode) => {
      if (err) {
        return res.status(400).json({
          error: "Expired link try again",
        });
      } else {
        Users.findOne({ reset_pass_link: token }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Somthing went wrong,try later",
            });
          } else {
            const updatePassword = { password: password, reset_pass_link: "" };
            user = _.extend(user, updatePassword);
            user.save((err, result) => {
              if (err) {
                return res.status(400).json({
                  error: "Error reseting password",
                });
              }
              res.json({
                success: true,
                message: "Reset password successfully",
              });
            });
          }
        });
      }
    });
  }
};

exports.googleController = (req, res) => {
  const ggclient = new OAuth2Client(process.env.GOOGLE_CLIENT);
  const { idToken } = req.body;
  //get token and veriify
  ggclient
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      //  console.log(response);
      const { email_verified, name, email } = response.payload;
      //check if email verify
      if (email_verified) {
        Users.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign(
              { _id: user._id },
              process.env.ACCOUNT_ACTIVATION_SECRET,
              { expiresIn: "7d" }
            );
            const { _id, email, username, role } = user;
            return res.json({
              token,
              user: {
                _id,
                email,
                username,
                role,
              },
            });
          } else {
            //if user not exists we create token and save in database
            let password = email + process.env.ACCOUNT_ACTIVATION_SECRET;
            const userGoogle = new Users({
              username: name,
              email,
              password,
            });
            userGoogle.save((err, data) => {
              if (err) {
                // console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "Login with google no available",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.ACCOUNT_ACTIVATION_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, username, role } = data;
              return res.json({
                token,
                user: {
                  _id,
                  email,
                  username,
                  role,
                },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google log in fail,try again",
        });
      }
    });
};
exports.facebookController = (req, res) => {
  const { userID, accessToken } = req.body;
  //  console.log(userID, accessToken);
  let url = `https://graph.facebook.com/v2.11/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;
  return fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      const { name, email } = data;
      // console.log(data);
      Users.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign(
            { _id: user._id },
            process.env.ACCOUNT_ACTIVATION_SECRET,
            { expiresIn: "7d" }
          );
          const { _id, email, username, role } = user;
          return res.json({
            token,
            user: {
              _id,
              email,
              username,
              role,
            },
          });
        } else {
          //if user not exists we create token and save in database
          let password = email + process.env.ACCOUNT_ACTIVATION_SECRET;
          const userFacebook = new Users({
            username: name,
            email,
            password,
          });
          userFacebook.save((err, data) => {
            if (err) {
              // console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
              return res.status(400).json({
                error: "Login with facebook no available",
              });
            }
            const token = jwt.sign(
              { _id: data._id },
              process.env.ACCOUNT_ACTIVATION_SECRET,
              { expiresIn: "7d" }
            );
            const { _id, email, username, role } = data;
            return res.json({
              token,
              user: {
                _id,
                email,
                username,
                role,
              },
            });
          });
        }
      });
    })
    .catch((err) => {
      res.status(400).json({ error: errorHandler(err) });
    });
};
