const express = require("express");

const router = express.Router();

const statementController = require("../controllers/statement-controller");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

router.post("/new/:sessionId", statementController.postStatement);
router.get("/:sessionId/:statementId", statementController.getStatementData);
router.get("/:sessionId", statementController.getSessionStatements);
router.post(
  "/cancel/:sessionId/:statementId",
  statementController.cancelStatement
);

module.exports = router;
