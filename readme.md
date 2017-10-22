# koa2-react-redux-webpack-boilerplate


Minimalistic boilerplate for koa2, react, redux with the help of babel and webpack.

What's __not__ included:
- HMR
- Dev-Server
- Tests
- Prod/Dev setup
- Server-side rendering

## Extensions:
Please see the extensions folder for additional functionality like a REST API or db access etc.
More releases will be coming soon...

It's just a very basic setup with minimal dependencies and files.

[Project setup guide.](docs/project-setup.md)

## Installation

    fork this repo & git clone the repo

## Command

#### Setup

    npm install

#### Develop

    npm run build

#### Test

    npm start

## Dependencies

- Test:
    + left out for simplicity reasons
- Build:  
    + [babel](http://babeljs.io/)
      + tools: babel-register/ babel-polyfill
      + presets: [ "es2015", "stage-0", "react" ]
    + [webpack](https://webpack.github.io/)
      + loaders: babel-loader
- Core:
    + [koa2](https://github.com/koajs/koa/tree/v2.x)
      + file-serving: [koa-static](https://github.com/koajs/static)
    + [react](https://facebook.github.io/react/)
      + redux-bindings: [react-redux](https://github.com/reactjs/react-redux)
    + [redux](http://redux.js.org/)


## License

MIT
