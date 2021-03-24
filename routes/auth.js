/*
    Route: "/api/login" 
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");
const { login } = require("../controllers/auth");

const router = Router();

router.post(
  "/",
  [
    check("password", "La contraseña es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validateFields
  ],
  login
);

module.exports = router;
