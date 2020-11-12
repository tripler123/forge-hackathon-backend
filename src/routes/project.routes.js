const express = require("express");
const router = express.Router();

const { pool } = require("../../database");

const { getProjects, getProject, postProject } = require('../controllers/project.controllers')


// GET /project
router.get('/', getProjects);

// GET /project/:projectId
router.get('/:projectId', getProject);

// POST /project/
router.post('/', postProject);



module.exports = router;
