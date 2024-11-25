import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
}); 
let getuid = (restaurantName) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT uid FROM tables4u.Restaurants WHERE name =?;", [restaurantName], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0].uid);
      })
  })
}
let getManager = (uid) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT manager FROM tables4u.Restaurants WHERE uid =?;", [uid], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0].manager);
      })
  })
}
let deleteTables = (uid) => {
return new Promise((resolve, reject) => {
    pool.query("DELETE FROM tables4u.Tables WHERE restaurant =?;", [uid], (error, rows) => {
        if (error) { return reject(error); }
        return resolve(rows);
    })
})
}
let deleteReservations = (uid) => {
  return new Promise((resolve, reject) => {
      pool.query("DELETE FROM tables4u.Reservations WHERE restaurant =?;", [uid], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}
let deleteRestaurant = (uid) => {
  return new Promise((resolve, reject) => {
      pool.query("DELETE FROM tables4u.Restaurants WHERE uid =?;", [uid], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}
let deleteManager = (eid) => {
  return new Promise((resolve, reject) => {
      pool.query("DELETE FROM tables4u.Employees WHERE eid =?;", [eid], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}
let uid = event.restaurant
if(isNaN(uid)){
  uid = parseInt(event.restaurant)
}
if(isNaN(uid)){
  uid = await getuid(event.restaurant)
}
let manager = await getManager(uid)
//Delete Reservations
await deleteReservations(uid)
//Delete Tables
await deleteTables(uid)
//Delete Restaurant
await deleteRestaurant(uid)
//Delete Manager
await deleteManager(manager)
pool.end()

return {
  statusCode: 200,
  body: {
    "restaurant": uid,
    "manager": manager}
}
}
