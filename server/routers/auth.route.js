const express = require("express");
const router = express.Router();
const {
  registerController,
  activationController,
  loginController,
  forgetPasswordController,
  resetPasswordController,
  googleController,
  facebookController,
} = require("../controllers/auth.controller");
const {
  validateRegister,
  validateLogin,
  validateForgetPassword,
  validateResetPassword,
} = require("../helper/valid");
router.post("/register", validateRegister, registerController);
router.post("/activation", activationController);
router.post("/login/individual", validateLogin, loginController);
router.put("/forget", validateForgetPassword, forgetPasswordController);
router.post("/reset", validateResetPassword, resetPasswordController);
//LOGIN WITH GOOGLE
router.post("/google/login", googleController);
//LOGIN WITH FACEBOOK
router.post("/facebook/login", facebookController);

module.exports = router;
