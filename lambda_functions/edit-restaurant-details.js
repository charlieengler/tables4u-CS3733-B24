import mysql from 'mysql2';

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    });

    const updateRestaurantDetails = (uid, name, address, city, state, zipcode) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE tables4u.Restaurants SET name = ?, address = ?, city = ?, state = ?, zipcode = ? WHERE uid = ?;", [name, address, city, state, zipcode, uid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    const getRestaurantDetails = uid => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tables4u.Restaurants WHERE uid = ?;", [uid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    const updateManagerDetails = (eid, username, password) => {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE tables4u.Employees SET username = ?, password = ? WHERE eid = ?;", [username, password, eid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    const getManagerDetails = eid => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tables4u.Employees WHERE eid = ?;", [eid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    try {
        await updateRestaurantDetails(event.uid, event.name, event.address, event.city, event.state, event.zipcode);
    } catch(err) {
        pool.end();
        return {
            statusCode: 400,
            body: {
                "error": "Error updating restaurant: " + err,
            }
        }
    }
    
    try {
        await updateManagerDetails(event.eid, event.username, event.password);
    } catch(err) {
        pool.end();
        return {
            statusCode: 400,
            body: {
                "error": "Error updating manager: " + err,
            }
        }
    }

    try {
        const resDetails = await getRestaurantDetails(event.uid);

        try {
            const manDetails = await getManagerDetails(event.eid);

            if(resDetails != null && manDetails != null) {
                pool.end();
                return {
                    statusCode: 200,
                    body: {
                        "resDetails": resDetails,
                        "manDetails": {
                            email: manDetails.email,
                            username: manDetails.username,
                        },
                    }
                }
            }
            
            pool.end();
            return {
                statusCode: 400,
                body: {
                    "error": "Manager or restaurant was null",
                }
            }
        } catch(manErr) {
            pool.end();
            return {
                statusCode: 400,
                body: {
                    "error": "Manager Error: " + manErr,
                }
            }
        }
    } catch(resErr) {
        pool.end();
        return {
            statusCode: 400,
            body: {
                "error": "Restaurant Error: " + resErr,
            }
        }
    }
}