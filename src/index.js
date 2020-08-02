const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(require('./routes'));


app.listen(3000, () => console.log('server started'));