module.exports = {

  // GET
  getTasks: async (req, res, next) => {
    try {
      const tasks = await pool.query("SELECT * FROM task ")
      return res.status(200).json(tasks);
    } catch (error) {
      next(error)
      console.log(error)
    }
  },

  getTask: async (req, res, next) => {
    const taskId = req.params.taskId;
    try {
      const task = await pool.query("SELECT * FROM task WHERE id = ?", taskId);
      return res.status(200).json(task);

    } catch (error) {
      next(error)
      console.log(error)
    }
  },

  //POST
  postTask: async (req, res, next) => {
    const {
      title
    } = req.body;

    try {
      const newTask = await pool.query('INSERT INTO task SET ?', [title]);
      return res.status(201).send(newTask);
    } catch (error) {
      next(error);
      console.log(error);
    }
  },

  //PUT
  putTask: async (req, res, next) => {
    const {
      title
    } = req.body;

    const taskId = req.params.taskId;

    try {
      const newTask = await pool.query('UPDATE task SET ? WHERE id = ?', [title, taskId]);
      return res.status(201).send(newTask);
    } catch (error) {
      next(error);
      console.log(error);
    }
  },

  //PATCH
  patchTask: async (req, res, next) => {

  },

  //DELETE
  deleteTask: async (req, res, next) => {
    const taskId = req.params.taskId;
    try {
      await pool.query('DELETE FROM task WHERE id = ?', [taskId]);
      return res.status(201).json({serverMessage: "Task deleted"});

    } catch (error) {
      next(error);
      return res.status(400).json(error)
    }
  }
}