import mysql from 'mysql'

export const handler = async (event) => {
  
    // get credentials from the db_access layer (loaded separately via AWS console)
    var pool = mysql.createPool({
        host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
        user: "charlieengler",
        password: "nTAR9EBBSsJcS8Gb",
        database: "tables4u"
    }); 


    let cancelReservation = (confCode) => {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM Reservations WHERE confirmation_code =?;", [confCode], (error, rows) => {
            if (error) { return reject(false); }
            return resolve(true);
        })
    })
    }

    let result = await cancelReservation(event.confCode)
    pool.end()

    if(result){
        return{
            statusCode: 200,
            body: "Reservation Cancelled"
        }
    }
    else{
        return{
            statusCode: 400,
            body: {
                "error": "Reservation does not exist"
              }
        }
    }

}
