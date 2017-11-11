# Extension 01 - REST API Postgres

This is the first extension that includes a REST API at the backend with a connection to a postgres db.

__Note:__  
This is only very basic functionality without any intent to serve as a "real world" boilerplate.

What's __not__ included:
- User management
- Any kind of authentication
- API test
- Production setup

[Project setup guide.](./docs/extensions01_setup.md)

## Installation

    Move all files that are in the 01_REST_API_POSTGRES folder to the root and make sure to override the exsisting ones.

#### Setup

        npm install
        npm install --only-dev

#### Build

        npm run build

#### Test

        npm run test

#### Start

        npm start

## Additional Dependencies

- Test:
   + framework [mocha](https://github.com/mochajs/mocha)
   + assertion [chai](https://github.com/chaijs/chai)  
      + http requests: [chai-http](https://github.com/chaijs/chai-http)

- Core:
   + node postgress client [pg](https://github.com/brianc/node-postgres)
   + server side routing [koa-router](https://github.com/alexmingoia/koa-router)
   + db response parser [koa-bodyparser](https://github.com/koajs/bodyparser)

## License

MIT
