const express = require('express');
const { route } = require('./manga');
const router = express.Router();

router.get('/', (request, response) => {
    response.send("walla");
});

module.exports = router;