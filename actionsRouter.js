const express = require('express')
const actionDb = require('./data/helpers/actionModel.js');
const projectDb = require('./data/helpers/projectModel.js');
const router = express.Router();
// -/api/projects/actions

async function getProject(req, res, next) {
  try {
    const project = await projectDb.get(req.params.projectId)
    req.project = project
    next();
  } catch {
    res.status(500).json({
      message: "Error finding associated project."
    })
  }
}

// | POST   | -/api/projects/actions
//| Creates a action using the information sent inside the `request body`.
router.post('/:projectId', validateaction, async (req, res) => {
  try {
      const action = await actionDb.insert(req.body)
      res.send(action)
  } catch {
    res.status(500).json({
      message: "Error creating the action."
    })
  }
})

// | GET    | -/api/projects/actions
//| Returns an array of all the action objects contained in the database.                                                                                                         |
router.get('/:projectId', getProject, async (req, res) => {
  console.log(req.project)
  try {
    const actions = await projectDb.getProjectActions(req.params.projectId)
    res.json(actions)
  } catch {
    res.status(500).json({
      message: "Error retrieving the actions."
    })
  }
})

// | GET    | -/api/projects/actions/:id
//| Returns the action object with the specified id.                                                                                                                              |
router.get('/:projectId/:id', validateactionId, async (req, res) => {
  try {
    const action = await actionDb.getById(req.params.id)
    res.json(action)
  } catch {
    res.status(500).json({
      message: "Error retrieving the action."
    })
  }
})

// | DELETE | -/api/projects/actions/:id
//| Removes the action with the specified id and returns the **deleted action object**. You may need to make additional calls to the database in order to satisfy this requirement. |
router.delete('/:id', validateactionId, async (req, res) => {
  try {
    const action = await actionDb.remove(req.params.id)
    res.send("Deleted")
  } catch {
    res.status(500).json({
      message: "Error deleting the action."
    })
  }
})

// | PUT    | -/api/projects/actions/:id
//| Updates the action with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.                                           |
router.put('/:id', validateactionId, async (req, res) => {
  try {
    const action = await actionDb.update(req.params.id, req.body)
    res.json(action)
  } catch {
    res.status(500).json({
      message: "Error editing the action."
    })
  }
})

//   - `validateactionId` validates the action id on every request that expects a action id parameter
async function validateactionId(req, res, next) {
  try{
    const { id } = req.params;
    const action = await actionDb.getById(id)
    if(action) {
      //   - if the `id` parameter is valid, store that action object as `req.action`
      req.action = action;
      console.log("foundaction")
      next();
    } else {
        //   - if the `id` parameter does not match any action id in the database, cancel the request and respond with status `400` and `{ message: "invalid action id" }`
        res.status(400).json({ message: "invalid action id" })
    }
  }
  catch {
    res.status(500).json({ message: "err" })
  }
};


//   - `validateaction` validates the `body` on a request to create a new action
function validateaction(req, res, next) {
  if(req.body){
    if(req.body.name) {
      next();
    }else {
      //   - if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ message: "missing required name field" }`
      res.status(400).json({ message: "missing required name field" })
    }
  }
  else{
    //   - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing action data" }
    res.status(400).json({ message: "missing action data" })
  }
};


//   - `validatePost` validates the `body` on a request to create a new post
function validatePost(req, res, next) {
  if(req.body){
    if(req.body.text) {
      next();
    }else {
      //   - if the request `body` is missing the required `text` field, cancel the request and respond with status `400` and `{ message: "missing required text field" }`
      res.status(400).json({ message: "missing required text field" })
    }
  }
  else{
    //   - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing post data" }`
    res.status(400).json({ message: "missing action data" })
  }

}

module.exports = router
