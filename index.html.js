'use strict'

export default (title =>
`
  <!doctype html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
      <div id="root"></div>
      <script>
      </script>
      <script type="text/javascript" src="bundle.js"></script>
    </body>
  </html>
`
)
