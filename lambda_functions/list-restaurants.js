import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 

let listRestaurants = () => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM tables4u.Restaurants;", (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}

let result = await listRestaurants()
pool.end()
if(result.length==0){
  return {
    statusCode: 400,
    body: {
      "error": "No Restaurants Exist"}
  }
}
return {
  statusCode: 200,
  body: {
    "restaurants": result}
}
}
