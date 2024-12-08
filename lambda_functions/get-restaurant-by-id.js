import mysql from 'mysql2';

export const handler = async (event) => {

    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    });

    // TODO: Add a token checking function to check for ownership

    const getRestaurantById = uid => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tables4u.Restaurants WHERE uid = ?;", [uid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    const getTables = uid => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tables4u.Tables WHERE restaurant = ?;", [uid], (error, rows) => {
                if (error) { reject(error); }
                resolve(rows);
            });
        })
    }

    const restaurant = await getRestaurantById(event.uid);
    const tables = await getTables(event.uid);
    if (restaurant != null && tables != null) {
        pool.end();
        return {
            statusCode: 200,
            body: {
                "uid": event.uid,
                "name": restaurant.name,
                "address": restaurant.address,
                "state": restaurant.state,
                "city": restaurant.city,
                "zipcode": restaurant.zipcode,
                "manager": restaurant.manager,
                "isActive": restaurant.isActive,
                "closings": restaurant.closings,
                "schedule_monday": restaurant.schedule_monday,
                "schedule_tuesday": restaurant.schedule_tuesday,
                "schedule_wednesday": restaurant.schedule_wednesday,
                "schedule_thursday": restaurant.schedule_thursday,
                "schedule_friday": restaurant.schedule_friday,
                "schedule_saturday": restaurant.schedule_saturday,
                "schedule_sunday": restaurant.schedule_sunday,
                "tables": tables,
            }
        }
    }

    pool.end();
    return {
        statusCode: 400,
        body: {
            "error": "Failed to find restaurant."
        }
    }
}