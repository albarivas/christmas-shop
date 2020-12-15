const compression = require("compression");
const helmet = require("helmet");
const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./src/routers/router");

const API_HOST = process.env.HOST_NAME || "localhost";
const API_PORT = process.env.PORT || 5000;
const STATIC_DIR = "./dist";

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.static(STATIC_DIR));
app.use("/api/v1/", router);
app.listen(API_PORT, () =>
  console.log(`✅  API Server started: http://${API_HOST}:${API_PORT}`)
);
