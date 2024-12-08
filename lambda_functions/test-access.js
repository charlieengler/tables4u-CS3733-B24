import mysql from 'mysql2';
import jwt from 'jsonwebtoken';

export const handler = async (event) => {
    const response = {
        statusCode: 400,
        body: 'Failed to generate response',
    };

    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    });

    const getAccessLevel = (eid, username) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT access_level FROM tables4u.Employees WHERE eid = ? AND username = ?;", [eid, username], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0].access_level);
            })
        })
    }

    try {
        const decodedToken = await jwt.verify(event.token, process.env["JWT_SECRET"]);

        const accessLevel = await getAccessLevel(decodedToken.eid, decodedToken.username);

        response.statusCode = 200;
        response.body = {
            access_level: accessLevel,
        };
    } catch(error) {
        response.statusCode = 401;
        response.body = 'Unabled to decrypt token: ' + error;
    }

    pool.end();
    return response;
};