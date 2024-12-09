const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("DNXT Vercel");
});

app.use(bodyParser.json());
app.use('/', routes); // Mount the routes

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


module.exports = app;

