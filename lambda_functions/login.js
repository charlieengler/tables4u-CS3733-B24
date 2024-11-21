import mysql from 'mysql2';
import jwt from 'jsonwebtoken';

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    });

    let getEmployee = (username, password) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT eid, access_level FROM tables4u.Employees WHERE username = ? AND password = ?;", [username, password], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    let result = await getEmployee(event.username, event.password);

    pool.end()
    if (result != null) {
        const token = jwt.sign(
            {
                eid: result.eid,
                username: event.username,
                access_level: result.access_level,
            },
            process.env["JWT_SECRET"],
            { expiresIn: "5d" },
        );

        const redirect = () => {
            if(result.access_level == 'A') {
                return '/administrator';
            } else if(result.access_level == 'M') {
                return '/restaurant-manager';
            } else {
                return '/';
            }
        }

        return {
            statusCode: 200,
            body: {
                token: token,
                redirect: redirect(),
            },
        };
    }
    return {
        statusCode: 400,
        body: {
            "error": "Invalid username or password"
        }
    }
}