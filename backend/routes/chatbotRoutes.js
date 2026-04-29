const express = require("express");
const router = express.Router();

const { chatbot } = require("../controllers/chatbotController");

router.post("/chatbot", chatbot);

module.exports = router;
