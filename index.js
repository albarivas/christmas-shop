const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.LOCAL ? false : { rejectUnauthorized: false }
});

const handleResponse = (response, error, results) => {
  if (error) {
    response.status(400).json({ status: 'error', message: `Error:${error}` });
  }
  response.status(200).json(results.rows);
};

const getProducts = async (request, response) => {
  pool.query('SELECT * FROM product', handleResponse.bind(null, response));
};

const getProduct = async (request, response) => {
  pool.query(
    `SELECT * FROM product WHERE product_number = ${request.params.productNumber}`,
    handleResponse.bind(null, response)
  );
};

/*const addproduct = async (request, response) => {
  const {
    product_number,
    session_id,
    order_number,
    sold_to,
    ship_to,
    bill_to,
    customer_number,
    total_value,
    total_taxes
  } = request.body;

  const connection = await pool.connect();
  try {
    await connection.query('BEGIN');
    await connection.query(
      'INSERT INTO product (product_number, session_id, order_number, sold_to, ship_to, bill_to, customer_number, total_value, total_taxes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [
        product_number,
        session_id,
        order_number,
        sold_to,
        ship_to,
        bill_to,
        customer_number,
        total_value,
        total_taxes
      ]
    );
    const formattedLines = lines.map(line => {
      const {
        product_line_number,
        product_number,
        quantity,
        item,
        product_number,
        price,
        vat
      } = line;
      return `(${product_line_number}, ${product_number}, ${quantity}, '${item}', ${product_number}, ${price}, ${vat})`;
    });
    const linesInsertStatement = `INSERT INTO product_line (product_line_number,product_number, quantity, item, product_number, price, vat) VALUES ${formattedLines.join(
      ','
    )}`;

    await connection.query(linesInsertStatement);
    await connection.query('COMMIT');
    response.status(201).json({ status: 'success', message: 'Order added.' });
  } catch (error) {
    await connection.query('ROLLBACK');
    console.log(error);
    response.status(400).json({ status: 'error', message: `Error:${error}` });
  } finally {
    connection.release();
  }
};*/

express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/products', getProducts)
  .get('/product/:productNumber', getProduct)
//  .post('/product', addproduct)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
