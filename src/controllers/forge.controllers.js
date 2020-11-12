var Axios = require("axios");
const querystring = require("querystring");
const fs = require("fs-extra");

var Buffer = require("buffer").Buffer;
String.prototype.toBase64 = function () {
    return new Buffer(this).toString("base64");
};


const {
    pool
} = require('../../database');

const {
    bucketKeyFormat
} = require('../utils/forge.utils');


module.exports = {
    // GET
    getPrivateToken: (req, res, next) => {
        Axios({
                method: "POST",
                url: "https://developer.api.autodesk.com/authentication/v1/authenticate",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                data: querystring.stringify({
                    client_id: process.env.FORGE_CLIENT_ID,
                    client_secret: process.env.FORGE_CLIENT_SECRET,
                    grant_type: "client_credentials",
                    scope: process.env.FORGE_PRIVATE_SCOPES
                })
            })
            .then(response => {
                let access_token = response.data.access_token;
                return res.status(201).json(access_token);
            })
            .catch(function (error) {
                next(error)
                return res.status(401).json(error);
            });
    },

    //POST
    createBucket: (req, res, next) => {
        const {
            projectName,
            access_token,
            projectId
        } = req.body;

        const bucketKey = bucketKeyFormat(projectName);

        Axios({
                method: "POST",
                url: "https://developer.api.autodesk.com/oss/v2/buckets",
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + access_token
                },
                data: {
                    bucketKey: bucketKey,
                    policyKey: "transient"
                }
            })
            .then(async function (response) {
                await pool.query(
                    `UPDATE project set bucket_key = '${response.data.bucketKey}' WHERE id = ${projectId}`
                );

                return res.status(201).json({
                    servermessage: "File was created successfully"
                });
            })
            .catch(function (error) {
                if (error.response && error.response.status == 409) {
                    return res.status(409).json({
                        servermessage: "Bucket already exists, skip creation."
                    });
                }
                console.log({
                    servermessage: "Failed to create a new bucket"
                });
                return res.status(401).json({
                    servermessage: "Failed to create a new bucket"
                });
            });
    },

    createObject: (req, res, next) => {
        const {
            access_token,
            bucketKey
        } = req.body;

        fs.readFile(req.file.path, function (err, filecontent) {
            if (err) return res.status(401).json(err);

            Axios({
                    method: "PUT",
                    url: "https://developer.api.autodesk.com/oss/v2/buckets/" +
                        encodeURIComponent(bucketKey) +
                        "/objects/" +
                        encodeURIComponent(Date.now() + "_" + req.file.originalname),
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    headers: {
                        Authorization: "Bearer " + access_token,
                        "Content-Disposition": Date.now() + "_" + req.file.originalname,
                        "Content-Length": filecontent.length
                    },
                    data: filecontent
                })
                .then(async function (response) {
                    var urn = await response.data.objectId.toBase64();
                    return res.status(201).json(urn);
                })
                .catch(function (error) {
                    return res.status(401).json(error);
                });
        });

    },

    traslateObject: (req, res, next) => {
        const {
            access_token,
            urn
        } = req.body;

        const format_type = "svf";
        const format_views = ["2d", "3d"];

        Axios({
                method: "POST",
                url: "https://developer.api.autodesk.com/modelderivative/v2/designdata/job",
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + access_token,
                    'x-ads-force': true
                },
                data: JSON.stringify({
                    input: {
                        urn: urn
                    },
                    output: {
                        formats: [{
                            type: format_type,
                            views: format_views,
                            "advanced": {
                                "generateMasterViews": true
                            }
                        }]
                    }
                })
            })
            .then(() => {
                return res.status(201).json({
                    "servermessage": "Se convirtio el modelo con exito"
                });
            })
            .catch(error => {
                return res.status(error).json({
                    "serverMessage": error
                });
            });
    }

}