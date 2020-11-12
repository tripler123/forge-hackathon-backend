const router = require('express').Router();

const {
  getTasks,
  getTask,
  getProjectTask,
  postTask,
  putTask,
  deleteTask
} = require('../controllers/task.controller');

router.get('/', getTasks); // Get all tasks
router.get('/:taskId', getTask); // Get specific task
router.get('/project/:projectId', getProjectTask); // Get all project's tasks
router.post('/', postTask); // Create task

router.delete('/:taskId', deleteTask); // Delete task
router.put('/:taskId', putTask); // Update task

module.exports = router;