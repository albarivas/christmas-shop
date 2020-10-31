const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const http = require("http");
const socketio = require("socket.io");
const faye = require("faye");
const nforce = require("nforce");

const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.LOCAL ? false : { rejectUnauthorized: false },
});

const handleResponse = (response, error, results) => {
  if (error) {
    response.status(400).json({ status: "error", message: `Error:${error}` });
  }
  response.status(200).json(results.rows);
};

const getOrders = async (request, response) => {
  pool.query("SELECT * FROM sales_order", handleResponse.bind(null, response));
};

const getOrder = async (request, response) => {
  pool.query(
    `SELECT * FROM sales_order WHERE order_number = ${request.params.orderNumber}`,
    handleResponse.bind(null, response)
  );
};

const getOrderLines = async (request, response) => {
  pool.query(
    `SELECT * FROM order_line WHERE order_number = ${request.params.orderNumber}`,
    handleResponse.bind(null, response)
  );
};

const addOrder = async (request, response) => {
  const {
    order_number,
    session_id,
    sales_org,
    sold_to,
    ship_to,
    bill_to,
    delivery_terms,
    delivery_date,
    status,
    lines,
  } = request.body;

  const error = createOrder(
    order_number,
    session_id,
    sales_org,
    sold_to,
    ship_to,
    bill_to,
    delivery_terms,
    delivery_date,
    status,
    lines
  );

  if (error != null) {
    response.status(400).json({ status: "error", message: `Error:${error}` });
  } else {
    response.status(201).json({ status: "success", message: "Order added." });
  }
};

const createOrder = async (
  order_number,
  session_id,
  sales_org,
  sold_to,
  ship_to,
  bill_to,
  delivery_terms,
  delivery_date,
  status,
  lines
) => {
  console.log("createOrder called");
  const connection = await pool.connect();
  try {
    await connection.query("BEGIN");
    await connection.query(
      "INSERT INTO sales_order (order_number, session_id, sales_org, sold_to, ship_to, bill_to, delivery_terms, delivery_date, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        order_number,
        session_id,
        sales_org,
        sold_to,
        ship_to,
        bill_to,
        delivery_terms,
        delivery_date,
        status,
      ]
    );
    if (lines.length > 0) {
      const formattedLines = lines.map((line) => {
        const {
          order_line_number,
          step,
          order_number,
          quantity,
          item,
          product_number,
          delivery_schedule,
          plant,
        } = line;
        return `(${order_line_number}, '${step}', ${order_number}, ${quantity}, '${item}', ${product_number}, '${delivery_schedule}', '${plant}')`;
      });
      const linesInsertStatement = `INSERT INTO order_line (order_line_number, step, order_number, quantity, item, product_number, delivery_schedule, plant) VALUES ${formattedLines.join(
        ","
      )}`;

      await connection.query(linesInsertStatement);
    }
    await connection.query("COMMIT");
    return null;
  } catch (error) {
    console.log(error);
    await connection.query("ROLLBACK");
    return error;
  } finally {
    connection.release();
  }
};

const changeOrderStatus = async (request, response) => {
  const { status } = request.body;

  pool.query(
    `UPDATE sales_order SET STATUS = $1 WHERE order_number = ${request.params.orderNumber}`,
    [status],
    (error, results) => {
      if (error) {
        response
          .status(400)
          .json({ status: "error", message: `Error:${error}` });
      }
      response
        .status(201)
        .json({ status: "success", message: "Order status changed." });
    }
  );
};

const app = express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/index"))
  .get("/orders", getOrders)
  .get("/orders-platform-events", (req, res) =>
    res.render("pages/platformEvents")
  )
  .get("/order/:orderNumber", getOrder)
  .get("/order/:orderNumber/lines", getOrderLines)
  .post("/order", addOrder)
  .post("/order/:orderNumber", changeOrderStatus);

const server = http.Server(app);
const io = socketio(server);

const bayeux = new faye.NodeAdapter({ mount: "/faye", timeout: 45 });
bayeux.attach(server);
bayeux.on("disconnect", function (clientId) {
  console.log("Bayeux server disconnect");
});

server.listen(PORT, () => console.log(`Express server listening on ${PORT}`));

// Connect to Salesforce
const SF_CLIENT_ID = process.env.SF_CLIENT_ID;
const SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET;
const SF_USER_NAME = process.env.SF_USER_NAME;
const SF_USER_PASSWORD = process.env.SF_USER_PASSWORD;

const org = nforce.createConnection({
  clientId: SF_CLIENT_ID,
  clientSecret: SF_CLIENT_SECRET,
  environment: "production",
  redirectUri: "http://localhost:3000/oauth/_callback",
  mode: "single",
  autoRefresh: true,
});

org.authenticate(
  { username: SF_USER_NAME, password: SF_USER_PASSWORD },
  (err) => {
    if (err) {
      console.error("Salesforce authentication error");
      console.error(err);
    } else {
      console.log("Salesforce authentication successful");
      console.log(org.oauth.instance_url);
      subscribeToPlatformEvents();
    }
  }
);

const subscribeToPlatformEvents = () => {
  var client = new faye.Client(org.oauth.instance_url + "/cometd/40.0/");
  client.setHeader("Authorization", "OAuth " + org.oauth.access_token);
  client.subscribe("/event/Order__e", function (message) {
    // Send message to all connected Socket.io clients --> eg: to show them on a page for debugging
    io.of("/").emit("order", {
      orderNumber: message.payload.Order_Number__c,
      sessionId: message.payload.Session_Id__c,
      salesOrg: message.payload.Sales_Org__c,
      soldTo: message.payload.Sold_To__c,
      shipTo: message.payload.Ship_To__c,
      billTo: message.payload.Bill_To__c,
      deliveryTerms: message.payload.Delivery_terms__c,
      deliveryDate: message.payload.Delivery_date__c,
      status: message.payload.Status__c,
    });
    // Create order
    createOrder(
      message.payload.Order_Number__c,
      message.payload.Session_Id__c,
      message.payload.Sales_Org__c,
      message.payload.Sold_To__c,
      message.payload.Ship_To__c,
      message.payload.Bill_To__c,
      message.payload.Delivery_Terms__c,
      message.payload.Delivery_Date__c,
      message.payload.Status__c,
      []
    );
  });
};
