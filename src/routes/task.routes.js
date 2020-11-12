const router = require('express').Router();

const {
  getTasks,
  getTask,
  postTask,
  putTask,
  deleteTask
} = require('../controllers/task.controller');

router.get('/', getTasks);
router.get('/:taskId', getTask);
router.post('/', postTask);
router.put('/:taskId', putTask);
router.delete('/:taskId', deleteTask);

module.exports = router;