const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const path = require('path');
const router = require('./routers/router');

const PORT = process.env.PORT || 5000;

express()
  .use(helmet())
  .use(compression())
  .use(cors())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .use('/api/v1/', router)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
