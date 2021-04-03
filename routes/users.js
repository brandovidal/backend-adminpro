/*
    Route: "/api/users" 
*/

const { Router } = require("express");
const { check } = require("express-validator");

//  VALIDATES
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT, validateAdminRole, validateAdminRoleOrOwnUser } = require("../middlewares/validate-jwt");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = Router();

router.get("/", getUsers);
router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validateFields,
  ],
  createUser
);
router.put(
  "/:id",
  [
    validateJWT,
    validateAdminRoleOrOwnUser,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El rol es obligatorio").not().isEmpty(),
    validateFields,
  ],
  updateUser
);
router.delete("/:id", validateJWT, deleteUser);

module.exports = router;
