import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 

let getClosings = (uid) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT closings FROM tables4u.Restaurants WHERE uid = ?;", [uid], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0].closings);
      })
  })
}
let updateClosings = (uid, closings) => {
  return new Promise((resolve, reject) => {
      pool.query("UPDATE tables4u.Restaurants SET closings = ? WHERE uid = ?;", [closings, uid], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0]);
      })
  })
}
const newClosings = event.dates

const parsedClosings = [];
for (let i=0; i<newClosings.length; i++)
  if(Date.parse(newClosings[i]) > Date.now() && !newClosings.includes(newClosings[i], i+1))
    parsedClosings.push(newClosings[i]);


let u = await updateClosings(event.uid, JSON.stringify(parsedClosings))
let closingsString = await getClosings(event.uid)

pool.end();

return {
  statusCode: 200,
  body: {
    "uid": event.uid,
    "dates": closingsString
  }
}
}
