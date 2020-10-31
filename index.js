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

const getInvoices = async (request, response) => {
  pool.query('SELECT * FROM invoice', handleResponse.bind(null, response));
};

const getInvoice = async (request, response) => {
  pool.query(
    `SELECT * FROM invoice WHERE invoice_number = ${request.params.invoiceNumber}`,
    handleResponse.bind(null, response)
  );
};

const getInvoiceLines = async (request, response) => {
  pool.query(
    `SELECT * FROM invoice_line WHERE invoice_number = ${request.params.invoiceNumber}`,
    handleResponse.bind(null, response)
  );
};

const addInvoice = async (request, response) => {
  const {
    invoice_number,
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
      'INSERT INTO invoice (invoice_number, session_id, order_number, sold_to, ship_to, bill_to, customer_number, total_value, total_taxes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [
        invoice_number,
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
        invoice_line_number,
        invoice_number,
        quantity,
        item,
        product_number,
        price,
        vat
      } = line;
      return `(${invoice_line_number}, ${invoice_number}, ${quantity}, '${item}', ${product_number}, ${price}, ${vat})`;
    });
    const linesInsertStatement = `INSERT INTO invoice_line (invoice_line_number,invoice_number, quantity, item, product_number, price, vat) VALUES ${formattedLines.join(
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
};

express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/invoices', getInvoices)
  .get('/invoice/:invoiceNumber', getInvoice)
  .get('/invoice/:invoiceNumber/lines', getInvoiceLines)
  .post('/invoice', addInvoice)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
