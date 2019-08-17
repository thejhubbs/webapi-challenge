const express = require('express');
const server = express();
//Include both projects & actions router.
const ProjectsRouter = require('./projectsRouter.js')
//const ActionsRouter = require('./actionsRouter.js')

//Quick logger just for debugging.
server.use(logger);

server.use(express.json());

server.use('/api/projects', ProjectsRouter)
//server.use('/api/projects/actions', ActionsRouter)

server.get('/', (req, res) => {
  res.send(`<h2>SprintAPI</h2>`)
});

function logger(req, res, next) {
  console.log(`${req.method}: "${req.url}" @ ${Date.now()}`);
  next();
};

module.exports = server;
