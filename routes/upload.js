/*
    Route: "/api/all" 
*/

const { validateJWT } = require("../middlewares/validate-jwt");
const expressFileUpload = require("express-fileupload");

const { Router } = require("express");
const { uploadFile, getFile } = require("../controllers/upload");

const router = new Router();
router.use(expressFileUpload());

router.put("/:type/:id", validateJWT, uploadFile);
router.get("/:type/:img", getFile);

module.exports = router;
