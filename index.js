require("dotenv/config");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const express = require("express");
const path = require("path");
const router = require("./src/routers/router");

const API_HOST = process.env.HOST || "localhost";
const API_PORT = process.env.API_PORT || 3002;
const IMAGES_DIR = "./images";

express()
  .use(helmet())
  .use(compression())
  .use(cors())
  .use(express.static(IMAGES_DIR))
  .set("views", path.join(__dirname, "src/views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .use("/api/v1/", router)
  .listen(API_PORT, () =>
    console.log(`✅  API Server started: http://${API_HOST}:${API_PORT}`)
  );
