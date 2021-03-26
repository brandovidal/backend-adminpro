/*
    Route: "/api/all" 
*/

const { validateJWT } = require("../middlewares/validate-jwt");

const { getAll, getDocumentCollection } = require("../controllers/search");

const { Router } = require("express");

const router = new Router();

router.get("/:term", validateJWT, getAll);
router.get("/collection/:table/:term", validateJWT, getDocumentCollection);

module.exports = router;
