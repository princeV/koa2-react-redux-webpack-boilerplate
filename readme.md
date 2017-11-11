# koa2-react-redux-webpack-boilerplate


Minimalistic boilerplate for koa2, react, redux with the help of babel and webpack.

What's __not__ included:
- HMR
- Dev-Server
- Tests (API tests available in extension)
- Prod/Dev setup
- Server-side rendering

__Note:__  
This is only very basic functionality without any intent to serve as a "real world" boilerplate.
It's more ment to be like a quick start to try and learn.

[Project setup guide.](./docs/project-setup.md)

## Extensions:
Please see the [extensions](extensions/) folder for additional functionality like a REST API or db access etc.
More releases will be coming soon...

## Installation

    fork this repo & git clone the repo

## Command

#### Setup

    npm install
    npm install --only-dev

#### Build

    npm run build

#### Start

    npm start

## Dependencies

- Test:
    + left out for simplicity reasons (included in API extension)
- Build:  
    + [babel](http://babeljs.io/)
      + tools: babel-register/ babel-polyfill
      + presets: [ "es2015", "stage-0", "react" ]
    + [webpack](https://webpack.github.io/)
      + loaders: babel-loader
- Core:
    + [koa2](https://github.com/koajs/koa/)
      + file-serving: [koa-static](https://github.com/koajs/static)
    + [react](https://facebook.github.io/react/)
      + redux-bindings: [react-redux](https://github.com/reactjs/react-redux)
    + [redux](http://redux.js.org/)


## License

MIT
