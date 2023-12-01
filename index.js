const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./src/routers/routes");

app.use(cors());
app.use(express.json());

const sql = require('mssql');

require("dotenv").config();

app.use("/api", routes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
