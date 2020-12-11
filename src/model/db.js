const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.LOCAL ? false : { rejectUnauthorized: false },
});

// Returns a promise, when promise is fulfilled, results received, when rejected, error received
const getProducts = async () => pool.query("SELECT * FROM product");

const getProductsByFamilyMember = async (familyMemberId) =>
  pool.query(
    `SELECT product.id, product.product_name, product.product_description, product.picture, family_member_product.units
     FROM family_member_product 
     INNER JOIN product ON product.id = family_member_product.product 
     WHERE family_member_product.family_member = $1`,
    [parseInt(familyMemberId)]
  );

const getProduct = async (productId) =>
  pool.query(`SELECT * FROM product WHERE id = $1`, [productId]);

const purchaseProducts = async (familyMemberId, productId, unitsToPurchase) => {
  // TODO: pasing URL parameters to the correct type should be done in an upper layer
  console.log("Purchasing product:");
  console.log("familyMember" + familyMemberId);
  console.log("productId" + productId);
  console.log("unitsToPurchase" + unitsToPurchase);
  const connection = await pool.connect();
  try {
    await connection.query("BEGIN");

    // Retrieve family member
    const familyMemberRows = await connection.query(
      `SELECT credits_available FROM family_member WHERE id = $1`,
      [parseInt(familyMemberId)]
    );
    if (familyMemberRows.rows.length === 0) {
      throw "Unknown family member";
    }
    const familyMember = familyMemberRows.rows[0];

    // Retrieve product
    const productRows = await connection.query(
      `SELECT units_in_inventory, credits FROM product WHERE id = $1`,
      [productId]
    );
    if (productRows.rows.length === 0) {
      throw "Unknown product";
    }
    const product = productRows.rows[0];

    // Validations
    if (product.credits * unitsToPurchase > familyMember.creditsAvailable) {
      throw "Not enough credits";
    }
    if (product.units_in_inventory < unitsToPurchase) {
      throw "Not enough units in inventory";
    }

    // Insert or update family member product
    const familyMemberProduct = await connection.query(
      "SELECT units FROM family_member_product WHERE family_member = $1 AND product = $2",
      [parseInt(familyMemberId), productId]
    );

    if (familyMemberProduct.rows.length === 0) {
      await connection.query(
        "INSERT INTO family_member_product (family_member, product, units) VALUES ($1,$2,$3)",
        [parseInt(familyMemberId), productId, unitsToPurchase]
      );
    } else {
      await connection.query(
        "UPDATE family_member_product SET units = $1 WHERE family_member = $2 AND product = $3",
        [unitsToPurchase, parseInt(familyMemberId), productId]
      );
    }
    console.log(familyMember.credits_available);
    console.log(product.credits);
    // Update family member credits
    await connection.query(
      "UPDATE family_member SET credits_available = $1 WHERE id = $2",
      [
        familyMember.credits_available - product.credits * unitsToPurchase,
        familyMemberId,
      ]
    );

    // Update product inventory
    await connection.query(
      "UPDATE product SET units_in_inventory = $1 WHERE id = $2",
      [product.units_in_inventory - unitsToPurchase, productId]
    );
  } catch (error) {
    await connection.query("ROLLBACK");
    console.log(error);
    throw error;
  } finally {
    connection.release();
  }
};

const getFamilyMembers = async () => pool.query("SELECT * FROM family_member");

const getFamilyMember = async (familyMemberId) =>
  pool.query("SELECT * FROM family_member WHERE id = $1", [
    parseInt(familyMemberId),
  ]);

module.exports = {
  getProducts,
  getProductsByFamilyMember,
  getProduct,
  purchaseProducts,
  getFamilyMembers,
  getFamilyMember,
};
