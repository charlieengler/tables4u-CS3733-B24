import mysql from 'mysql2';
import jwt from 'jsonwebtoken';

const redirect = accessLevel => {
    if(accessLevel == 'A') {
        return '/administrator';
    } else if(accessLevel == 'M') {
        return '/restaurant-manager';
    } else {
        return '/';
    }
}

export const handler = async (event) => {
    // get credentials from the db_access layer (loaded separately via AWS console)
    const pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    });

    const getEmployee = (username, password) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT eid, access_level FROM tables4u.Employees WHERE username = ? AND password = ?;", [username, password], (error, rows) => {
                if(error) {
                    reject(error);
                }

                resolve(rows[0]);
            })
        })
    }

    try {
        const employee = await getEmployee(event.username, event.password);

        if (employee == null) {
            return {
                statusCode: 400,
                body: {
                    error: "Invalid username or password"
                }
            };
        }

        const token = jwt.sign(
            {
                eid: employee.eid,
                username: event.username,
                access_level: employee.access_level,
            },
            process.env["JWT_SECRET"],
            { expiresIn: "5d" },
        );

        return {
            statusCode: 200,
            body: {
                token: token,
                redirect: redirect(employee.access_level),
            },
        };
    } catch(error) {

    }
    
    pool.end()


    return {
        statusCode: 400,
        body: {
            "error": "Invalid username or password"
        }
    }
}