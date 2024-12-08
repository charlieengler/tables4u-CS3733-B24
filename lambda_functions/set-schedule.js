import mysql from 'mysql2';

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    });

    const setSchedule = (sid, opening, closing) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE tables4u.Schedules SET opening = ?, closing = ? WHERE sid = ?;", [opening, closing, sid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve("Successfully updated schedule.");
            })
        })
    }

    const getSchedule = sid => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tables4u.Schedules WHERE sid = ?;", [sid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    try {
        await setSchedule(event.sid, event.opening, event.closing);
        const result = await getSchedule(event.sid);
        pool.end()

        return {
            statusCode: 200,
            body: {
                "opening": result.opening,
                "closing": result.closing,
            }
        }
    } catch(error) {
        pool.end()

        return {
            statusCode: 400,
            body: {
                "error": error
            }
        }
    }
}