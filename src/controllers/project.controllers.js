const {
    pool
} = require('../../database');


module.exports = {

    // GET
    getProjects: async (req, res, next) => {
        try {
            const projects = await pool.query("SELECT * FROM project")
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
            name,
            image_url
        } = req.body;

        try {
            await pool.query(`INSERT INTO project SET ?`, [{
                name,
                image_url
            }]);
            return res.status(201).json({serverMessage : "Project created"});
        } catch (error) {
            next(error);
            console.log(error);
        }
    }
}