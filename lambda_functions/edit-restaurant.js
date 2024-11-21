import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 

let editRestaurant = (
    uid, 
    name, 
    address, 
    state, 
    zipcode, 
    isActive, 
    closings, 
    schedule_monday, 
    schedule_tuesday, 
    schedule_wednesday, 
    schedule_thursday, 
    schedule_friday, 
    schedule_saturday, 
    schedule_sunday, 
    manager) => {
  return new Promise((resolve, reject) => {
      pool.query(`UPDATE Restaurants SET 
        name = ?, 
        address = ?, 
        state = ?,
        zipcode = ?,
        isActive = ?,
        closings = ?,
        schedule_monday = ?, 
        schedule_tuesday = ?, 
        schedule_wednesday = ?, 
        schedule_thursday = ?, 
        schedule_friday = ?, 
        schedule_saturday = ?, 
        schedule_sunday = ?,
        manager = ? WHERE uid = ?`, [
        name, 
        address, 
        state, 
        zipcode, 
        isActive, 
        closings, 
        schedule_monday, 
        schedule_tuesday, 
        schedule_wednesday, 
        schedule_thursday, 
        schedule_friday, 
        schedule_saturday, 
        schedule_sunday, 
        manager, 
        uid], (error, rows) => {
          if (error) { return reject(error); }
          if ((rows)) {
            return resolve(true)
          }
          else {
            return resolve(false)
          }
      })
  })
}

let result = await editRestaurant(
    event.uid, 
    event.name, 
    event.address, 
    event.state, 
    event.zipcode, 
    event.isActive, 
    event.closings, 
    event.schedule_monday, 
    event.schedule_tuesday, 
    event.schedule_wednesday, 
    event.schedule_thursday, 
    event.schedule_friday, 
    event.schedule_saturday, 
    event.schedule_sunday, 
    event.manager
)

pool.end()
console.log(result)
if(result == true){
  return {
    statusCode: 200,
    body: {
      "id": event.uid, 
      "name:": event.name}
  }
}
return {
  statusCode: 400,
  body: {
    "error": "Invalid information"
  }
}
}
