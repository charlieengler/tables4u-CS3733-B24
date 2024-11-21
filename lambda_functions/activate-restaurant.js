import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 
let AccessLevel = (token) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT access_level FROM tables4u.Employees WHERE eid = ? ;", [token], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0]);
      })
  })
}



let setActive = (restaurant) => {
  return new Promise((resolve, reject) => {
      pool.query("UPDATE tables4u.Restaurants SET isActive =true WHERE name = ?;", [restaurant], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}
let a = await AccessLevel(event.token)
a = a.access_level
// return{body:{"equal":a==="M","access":a}}
if(! (a==="M")){
  pool.end()
  return {
    statusCode: 400,
    body: {
      "error": "Invalid Permissions",
      "access": a}
  }
}
let result = await setActive(event.restaurant)
pool.end()

return {
  statusCode: 200,
  body: {
    "restaurant": event.restaurant,
    "access": a}
}
}
