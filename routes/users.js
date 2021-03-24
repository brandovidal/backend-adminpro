/*
    Route: "/api/users" 
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");

const { getUsers, createUser, updateUser } = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.post(
  "/",
  [
    check("name", "El nombre es obligatoria").not().isEmpty(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    check("email", "El email es obligatoria").isEmail(),
    validateFields,
  ],
  createUser
);
router.put(
  "/:id",
  [
    check("name", "El nombre es obligatoria").not().isEmpty(),
    check("email", "El email es obligatoria").isEmail(),
    check("role", "El rol es obligatoria").not().isEmpty(),
  ],
  updateUser
);

module.exports = router;
