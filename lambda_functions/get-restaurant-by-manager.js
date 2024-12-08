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

    const getRestaurantByManager = eid => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tables4u.Restaurants WHERE manager = ?;", [eid], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows[0]);
            })
        })
    }

    const restaurant = await getRestaurantByManager(event.eid);
    if (restaurant != null) {
        pool.end();
        return {
            statusCode: 200,
            body: {
                "uid": restaurant.uid,
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