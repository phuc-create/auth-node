const { check } = require("express-validator");
//VALIDATE REGISTER
exports.validateRegister = [
  check("username", "User name is required!")
    .isLength({
      min: 4,
      max: 32,
    })
    .withMessage("User name must have 4 to 32 characters"),
  check("email", "Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  check("password", "Password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
      max: 16,
    })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain number"),
];
//VALIDATE LOGIN
exports.validateLogin = [
  check("email", "Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  check("password", "Password is required").notEmpty(),
  check("password")
    .isLength({
      min: 6,
      max: 16,
    })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain number"),
];
//VALIDATE FORGET PASSWORD
exports.validateForgetPassword = [
  check("email", "Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
];
//VALIDATE RESET PASSWORD
exports.validateResetPassword = [
  check("password")
    .not()
    .isEmpty()
    .isLength({
      min: 6,
      max: 16,
    })
    .withMessage("Password must contain at least 6 characters"),
  check("password", "Password is required").notEmpty(),
];
