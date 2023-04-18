const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const route = require('./routes/route');
const mongoose = require('mongoose');

const app = express();
const appEnv = process.env.APP_ENV_MODE
console.log(`App Env => ${appEnv}`);
app.use(bodyParser.json());
//to accept multipart form
app.use(express.urlencoded({ extended: false}));
//connect to db
mongoose.connect(process.env[`MONGO_${appEnv}`], {
  useNewUrlParser: true
})
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

module.exports = app;
