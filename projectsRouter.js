const express = require('express')
const actionDb = require('./data/helpers/actionModel.js');
const projectDb = require('./data/helpers/projectModel.js');
const router = express.Router();
// -/api/projects
//NAME- required
//DESCRIPTION- required

// | POST   | /api/projects
//| Creates a project using the information sent inside the `request body`.
router.post('/', validateproject, async (req, res) => {
  try {
      const project = await projectDb.insert(req.body)
      res.send(project)
  } catch {
    res.status(500).json({
      message: "Error creating the project."
    })
  }
})

// | GET    | /api/projects
//| Returns an array of all the project objects contained in the database.                                                                                                         |
router.get('/', async (req, res) => {
  try {
    const projects = await projectDb.get()
    res.json(projects)
  } catch {
    res.status(500).json({
      message: "Error retrieving the projects."
    })
  }
})

// | GET    | /api/projects/:id
//| Returns the project object with the specified id.                                                                                                                              |
router.get('/:id', validateprojectId, async (req, res) => {
  try {
    res.json(req.project)
  } catch {
    res.status(500).json({
      message: "Error retrieving the project."
    })
  }
})

// | DELETE | /api/projects/:id
//| Removes the project with the specified id and returns the **deleted project object**. You may need to make additional calls to the database in order to satisfy this requirement. |
router.delete('/:id', validateprojectId, async (req, res) => {
  try {
    const project = await projectDb.remove(req.params.id)
    res.send("Deleted")
  } catch {
    res.status(500).json({
      message: "Error deleting the project."
    })
  }
})

// | PUT    | /api/projects/:id
//| Updates the project with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.                                           |
router.put('/:id', validateprojectId, async (req, res) => {
  try {
    const project = await projectDb.update(req.params.id, req.body)
    res.json(project)
  } catch {
    res.status(500).json({
      message: "Error editing the project."
    })
  }
})

//   - `validateprojectId` validates the project id on every request that expects a project id parameter
async function validateprojectId(req, res, next) {
  try{
    const { id } = req.params;
    const project = await projectDb.get(id)
    if(project) {
      //   - if the `id` parameter is valid, store that project object as `req.project`
      req.project = project;
      console.log("foundproject")
      next();
    } else {
        //   - if the `id` parameter does not match any project id in the database, cancel the request and respond with status `400` and `{ message: "invalid project id" }`
        res.status(400).json({ message: "invalid project id" })
    }
  }
  catch {
    res.status(500).json({ message: "err" })
  }
};


//   - `validateproject` validates the `body` on a request to create a new project
function validateproject(req, res, next) {
  if(req.body){
    if(req.body.name && req.body.description) {
      next();
    }else {
      //   - if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ message: "missing required name field" }`
      res.status(400).json({ message: "missing required name and/or description field" })
    }
  }
  else{
    //   - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing project data" }
    res.status(400).json({ message: "missing project data" })
  }
};







module.exports = router
