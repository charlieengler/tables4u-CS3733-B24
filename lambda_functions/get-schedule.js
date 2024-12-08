import mysql from 'mysql2';

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    });

    const getSchedule = sid => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tables4u.Schedules WHERE sid = ?;", [sid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    const schedule = await getSchedule(event.sid);
    if (schedule != null) {
        pool.end();
        return {
            statusCode: 200,
            body: {
                "schedule": schedule,
            }
        }
    }

    pool.end();
    return {
        statusCode: 400,
        body: {
            "error": "Couldn't find schedule."
        }
    }
}