import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 

let employeeID = (username, password) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT eid FROM tables4u.Employees WHERE username = ? AND password = ?;", [username, password], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}

let result = await employeeID(event.username, event.password)
pool.end()
if(result.length>0){
  return {
    statusCode: 200,
    body: {
      "username": event.username, 
      "access:": result[0].access_level,
      "token": result[0].eid}
  }
}
return {
  statusCode: 400,
  body: {
    "error": "Invalid username or password"
  }
}
}
