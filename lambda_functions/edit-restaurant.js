import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 


  let getRestaurant = (uid) => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM Restaurants WHERE uid = ?", [uid], (error, rows) => {
            if (error) { return reject(error); }
            return resolve(rows);
        })
    })
  }

//GET EVERYTHING FROM DB, EDIT IT, SEND EVERTYTHING BACK
  let editRestaurant = (
    uid,
    address, 
    state, 
    zipcode,  
    closings, 
    schedule_monday, 
    schedule_tuesday, 
    schedule_wednesday, 
    schedule_thursday, 
    schedule_friday, 
    schedule_saturday, 
    schedule_sunday) => {
      return new Promise((resolve, reject) => {
        pool.query(`UPDATE Restaurants SET  
          address = ?, 
          state = ?,
          zipcode = ?,
          closings = ?,
          schedule_monday = ?, 
          schedule_tuesday = ?, 
          schedule_wednesday = ?, 
          schedule_thursday = ?, 
          schedule_friday = ?, 
          schedule_saturday = ?, 
          schedule_sunday = ? WHERE uid = ?`, [  
          address, 
          state, 
          zipcode,
          closings, 
          schedule_monday, 
          schedule_tuesday, 
          schedule_wednesday, 
          schedule_thursday, 
          schedule_friday, 
          schedule_saturday, 
          schedule_sunday,  
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

  let assignTables = (table) => {
    return new Promise((resolve, reject) => {
      pool.query("INSERT INTO Tables (restaurant, seats) VALUES (?,?)", [table[0], table[1]], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
    })
  }

  let deleteTables = (restaurant) => {
    return new Promise((resolve, reject) => {
      pool.query("DELETE FROM Tables WHERE restaurant=?", [restaurant], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
    })
  }

  let restaurant = await getRestaurant(event.uid)
  
  if(restaurant.length == 1){
    let active = restaurant[0].isActive

    if(active == false){
      let result = await editRestaurant(
        event.uid,  
        event.address, 
        event.state, 
        event.zipcode,
        event.closings, 
        event.schedule_monday, 
        event.schedule_tuesday, 
        event.schedule_wednesday, 
        event.schedule_thursday, 
        event.schedule_friday, 
        event.schedule_saturday, 
        event.schedule_sunday
      )

      await deleteTables(event.uid)

      for (const table of event.tables) {
        await assignTables(table)
      }

      if(result == true){
        return {
          statusCode: 200,
          body: {
            "id": event.uid
          }
        }
      }
    }
    else{
      return {
        statusCode: 400,
        body: {
          "error": "Unable to edit an active restaurant"
        }
      }
    }

    pool.end()
  }
  return{
    statusCode: 400,
    body: {
        "error": "Restaurant does not exist"
      }
  }
}
