import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 

let getClosings = (restaurantName) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT closings FROM tables4u.Restaurants WHERE name = ?;", [restaurantName], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0].closings);
      })
  })
}
let updateClosings = (restaurantName, closings) => {
  return new Promise((resolve, reject) => {
      pool.query("UPDATE tables4u.Restaurants SET closings = ? WHERE name = ?;", [closings,restaurantName], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0]);
      })
  })
}
let newClosings = event.dates
if(newClosings.length==0){
  return {
    statusCode: 400,
    body: {
      "error":"No Dates Given"
    }
  }
}

for (let i=0; i<newClosings.length; i++){
  if(Date.parse(newClosings[i])<=Date.now())
  {
    return {
      statusCode: 400,
      body: {
        "error": "Dates must be in the future"}
    }
  }
  
}

let closingsString = await getClosings(event.restaurantName)

if(closingsString==null){
  closingsString = JSON.stringify(newClosings)
}
else{
  let closingsArray = JSON.parse(closingsString)
  closingsArray=closingsArray.concat(newClosings)
  closingsString = JSON.stringify(closingsArray)
}

let u = await updateClosings(event.restaurantName, closingsString)
pool.end()

return {
  statusCode: 200,
  body: {
    "restaurant": event.restaurantName,
    "dates": closingsString
  }
}
}
