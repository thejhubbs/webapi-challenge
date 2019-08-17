const server = require('./server.js')


// we can now use that port, if set up by heroku or read from .env or 4000 as a default if not set
server.listen(4000, () => {
  console.log("\n*** Server is now listening on port 4000 ***\n")
})
