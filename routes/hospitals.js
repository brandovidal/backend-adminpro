/*
    Route: "/api/hospitals" 
*/

const { Router } = require("express");
const { check } = require("express-validator");

//  VALIDATES
const { validateFields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitals");

const router = Router();

router.get("/", validateJWT, getHospitals);
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre del hospital es necesario").not().isEmpty(),
    validateFields,
  ],
  createHospital
);
router.put("/:id", [], updateHospital);
router.delete("/:id", [], deleteHospital);

module.exports = router;