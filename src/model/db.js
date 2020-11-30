const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.LOCAL ? false : { rejectUnauthorized: false },
});

// Returns a promise, when promise is fulfilled, results received, when rejected, error received
const getProducts = async () => pool.query("SELECT * FROM product");

const getProduct = async (request) =>
  pool.query(
    `SELECT * FROM product WHERE product_number = ${request.params.productNumber}`
  );

module.exports = {
  getProducts: getProducts,
  getProduct: getProduct,
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
