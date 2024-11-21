import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 

let listActiveRestaurants = () => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT uid, name FROM tables4u.Restaurants WHERE isActive = 1;", (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}

let result = await listActiveRestaurants()
pool.end()
if(result.length==0){
  return {
    statusCode: 400,
    body: {
      "error": "No Active Restaurants"}
  }
}
return {
  statusCode: 200,
  body: {
    "activeRestaurants": result}
}
}
