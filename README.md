# Time Machine Order Fulfilment

Order Fulfilment REST API for Time Machine Project built with Node.js app using [Express 4](http://expressjs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/albarivas/time-machine-order-fulfilment # or clone your own fork
$ cd time-machine-order-fulfilment
$ npm install
```

Install postgres and psql locally. Follow the instructions from the [heroku site](https://devcenter.heroku.com/articles/heroku-postgresql). Then create an initialize a local db:

```sh
$ createdb order-fulfilment
$ cat init.sql | psql order-fulfilment
$ export LOCAL=TRUE
$ export DATABASE_URL=postgres://localhost/order-fulfilment
$ export SF_CLIENT_ID=YOUR_CLIENT_ID
$ export SF_CLIENT_SECRET=YOUR_CLIENT_SECRET
$ export SF_USER_NAME=YOUR_USER_NAME
$ export SF_USER_PASSWORD=YOUR_PASSWORD
```

Run the app locally.

```sh
$ heroku local web
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ heroku addons:create heroku-postgresql:hobby-dev
$ cat init.sql | heroku pg:psql
$ git push heroku master
$ heroku open
```

or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
