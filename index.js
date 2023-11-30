const express = require("express");
const cors = require("cors");
const connectDatabase = require("./src/database/mongoose");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
