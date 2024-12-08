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
let reopenings = event.dates
// Check dates were given
if(reopenings.length==0){
  pool.end();
  return {
    statusCode: 400,
    body: {
      "error":"No Dates Given"
    }
  }
}

let closingsString = await getClosings(event.restaurantName)
// Check if there are any closings
if(closingsString==null){
  pool.end();
  return {
    statusCode: 400,
    body: {
      "error": "Restaurant has no closings"
    }
  }
}

let closingsArray = JSON.parse(closingsString)
let newclosings = []
for (let i=0; i<closingsArray.length; i++){
  if(!reopenings.includes(closingsArray[i]))
  {
    newclosings.push(closingsArray[i])
  }
}
 if(newclosings.length==0){
  closingsString=null
 } 
 else{
  closingsString = JSON.stringify(newclosings)
 }
  


let u = await updateClosings(event.restaurantName, closingsString)
pool.end();

return {
  statusCode: 200,
  body: {
    "restaurant": event.restaurantName,
    "dates": event.dates
  }
}
}
