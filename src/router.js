const router = require("express").Router();
//--methods--//
const { generateTaskList } = require("./Services/openai");

//--OpenAI endpoints--//
router.post("/generate-tasklist", generateTaskList);

module.exports = router;