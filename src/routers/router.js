var router = require("express").Router();
const db = require("../model/db");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get("/products", (request, response) => {
  console.log('API call - getProducts');
  executeQueryAndBuildResponse(db.getProducts, request, response);
});
router.get("/product/:productNumber", (request, response) => {
  console.log('API call - getProduct - ' + request.params.productNumber);
  executeQueryAndBuildResponse(db.getProduct, request, response);
});
//router.post('/product', addproduct)

const executeQueryAndBuildResponse = async (queryFunction, request, response) => {
  try {
    const results = await queryFunction(request);
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
