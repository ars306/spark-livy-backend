const express = require("express");

const router = express.Router();

const sessionController = require("../controllers/session-controller");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

router.get("/", sessionController.getSessions);
router.get("/user", sessionController.getUserSession);
router.get("/:sessionId", sessionController.getSessionById);
router.get("/state/:sessionId", sessionController.getSessionState);
router.get("/log/:sessionId", sessionController.getSessionLog);
router.post("/new", sessionController.postSession);
router.delete("/delete/:sessionId", sessionController.deleteSession);

module.exports = router;
