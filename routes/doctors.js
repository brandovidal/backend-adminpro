/*
    Route: "/api/doctors" 
*/

const { Router } = require("express");
const { check } = require("express-validator");

//  VALIDATES
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctors");

const router = Router();

router.get("/", validateJWT, getDoctors);
router.get("/:uid", validateJWT, getDoctorById);
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre del medico es necesario").not().isEmpty(),
    check("hospital", "El hospital id debe ser valido").isMongoId(),
    validateFields,
  ],
  createDoctor
);
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "El nombre del medico es necesario").not().isEmpty(),
    check("hospital", "El hospital id debe ser valido").isMongoId(),
    validateFields,
  ],
  updateDoctor
);
router.delete("/:id", validateJWT, deleteDoctor);

module.exports = router;
