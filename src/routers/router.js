var router = require("express").Router();
const db = require("../model/db");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get("/products", (request, response) => {
  executeQueryAndBuildResponse(response, db.getProducts);
});
router.get("/products/:familyMemberId", (request, response) => {
  executeQueryAndBuildResponse(
    response,
    db.getProductsByFamilyMember,
    request.params.familyMemberId
  );
});
router.get("/product/:productId", (request, response) => {
  executeQueryAndBuildResponse(
    response,
    db.getProduct,
    request.params.productId
  );
});
//router.post('/product', addproduct)

const executeQueryAndBuildResponse = async (
  response,
  queryFunction,
  ...params
) => {
  try {
    const results = await queryFunction(params);
    // Will only execute if promise is resolved
    if (results) {
      response.status(200).json(results.rows);
    } else {
      response.status(200).json([]);
    }
  } catch (error) {
    // Will execute if promise is rejected or if there's an error in the try block
    response.status(400).json({ status: "error", message: `Error:${error}` });
  }
};

module.exports = router;
