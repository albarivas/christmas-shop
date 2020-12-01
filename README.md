# Christmas Shop

Online Shop to buy Christmas items with credits won on familiar Christmas games.
Built with Node.js app using [Express 4](http://expressjs.com/).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/albarivas/christmas-shop # or clone your own fork
$ cd christmas-shop
$ npm install
```

Install postgres and psql locally. Follow the instructions from the [heroku site](https://devcenter.heroku.com/articles/heroku-postgresql). Then create an initialize a local db:

```sh
$ createdb christmas_shop
$ cat init.sql | psql christmas_shop
```

Run the app locally for development, with hot reloading enabled.

```sh
$ npm run watch
```

Your app should now be running on [localhost:3001](http://localhost:3001/).

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
