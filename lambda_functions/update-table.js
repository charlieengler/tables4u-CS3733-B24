import mysql from 'mysql2';

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    });

    const updateTable = (seatCount, numTables, uid) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tables4u.Tables WHERE restaurant = ? AND seats = ?;", [uid, seatCount], (error, rows) => {
                if(!rows)
                    rows = [];

                if(rows.length > numTables) {
                    for(let i = 0; i < rows.length - numTables; i++) {
                        pool.query("DELETE FROM tables4u.Tables WHERE restaurant = ? AND seats = ? LIMIT 1;", [uid, seatCount], (error, delRows) => {
                            if (error) { reject(error); }
                            numTables--;
                        });
                    }

                    pool.query("SELECT * FROM tables4u.Tables WHERE restaurant = ?;", [uid, seatCount], (error, finRows) => {
                        if (error) { reject(error); }
                        resolve(finRows);
                    });
                } else if(rows.length < numTables) {
                    for(let i = 0; i < numTables - rows.length; i++) {
                        pool.query("INSERT INTO tables4u.Tables(seats, restaurant) VALUES (?, ?);", [seatCount, uid], (error, rows) => {
                            if (error) { reject(error); }
                        });
                    }

                    pool.query("SELECT * FROM tables4u.Tables WHERE restaurant = ?;", [uid, seatCount], (error, finRows) => {
                        if (error) { reject(error); }
                        resolve(finRows);
                    });
                } else {
                    resolve(rows);
                }
            });
        })
    }

    try {
        const tables = await updateTable(event.seatCount, event.numTables, event.uid);

        pool.end();
        return {
            statusCode: 200,
            body: {
                "tables": tables,
            }
        }
    } catch (err) {
        pool.end();
        return {
            statusCode: 400,
            body: {
                "error": err
            }
        }
    }
}