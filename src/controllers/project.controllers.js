const {
    pool
} = require('../../database');


module.exports = {

    // GET
    getProjects: async (req, res, next) => {
        try {
            const projects = await pool.query("SELECT * FROM project ")
            return res.status(200).json(projects);
        } catch (error) {
            next(error)
            console.log(error)
        }
    },

    getProject: async (req, res, next) => {
        const projectId = req.params.projectId;
        try {
            const project = await pool.query("SELECT * FROM project WHERE id = ?", projectId);
            return res.status(200).json(project);
        } catch (error) {
            next(error)
            console.log(error)
        }
    },

    // POST
    postProject: async (req, res, next) => {
        const {
            title
        } = req.body;

        try {
            const newProject = await pool.query(`INSERT INTO project SET ?`, [title]);
            return res.status(201).send(newProject);
        } catch (error) {
            next(error);
            console.log(error);
        }
    }
}