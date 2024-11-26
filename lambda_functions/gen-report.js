import mysql from 'mysql'

export const handler = async (event) => {
  
  // get credentials from the db_access layer (loaded separately via AWS console)
  var pool = mysql.createPool({
      host: "tables4u.cl4s68owkgsy.us-east-2.rds.amazonaws.com",
      user: "charlieengler",
      password: "nTAR9EBBSsJcS8Gb",
      database: "tables4u"
  }); 


//Get tables in the restaurant  
let getTables = (restaurantID) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT tid,seats,restaurant FROM tables4u.Tables WHERE restaurant =?;", [restaurantID], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}
//get schedule IDs
let getSchedules = (restaurantID) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT schedule_monday, schedule_tuesday, schedule_wednesday, schedule_thursday, schedule_friday, schedule_saturday, schedule_sunday FROM tables4u.Restaurants WHERE uid =?;", [restaurantID], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0]);
      })
  })
}

//get reservations for a given rerant and date
let getHours = (scheduleID) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT opening,closing FROM tables4u.Schedules WHERE sid = ?;", [scheduleID], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows[0]);
      })
  })
}
//gets the opening and closing times from a schedule
let getReservations = (restaurantID, date) => {
  return new Promise((resolve, reject) => {
      pool.query("SELECT date,time,table_num,guests FROM tables4u.Reservations WHERE restaurant = ? AND date =?;", [restaurantID, date], (error, rows) => {
          if (error) { return reject(error); }
          return resolve(rows);
      })
  })
}



let ts = await getTables(event.restaurantID)
if(ts.length==0){
  return {
    statusCode: 400,
    body:{"error" : "No Tables exist for this restaurant"}}
}
//list reserved tables for specific times
let d = new Date(event.date)

let day = d.getDay()

let schedules= await getSchedules(event.restaurantID)
let schedule=0
switch(day){
  case 0:
    schedule = schedules.schedule_sunday
    break;
  case 1:
    schedule = schedules.schedule_monday
    break;
  case 2:
    schedule = schedules.schedule_tuesday
    break;
  case 3:
    schedule = schedules.schedule_wednesday
    break;
  case 4:
    schedule = schedules.schedule_thursday
    break;
  case 5:
    schedule = schedules.schedule_friday
    break;
  case 6: 
    schedule = schedules.schedule_saturday
    break;
  default:
    return{
      statusCode:400,
      body:{
        "error": "No Schedule Found"
      }
    }
}
let hours = await getHours(schedule)
let reservations = await getReservations(event.restaurantID, event.date)
//Total Seats
let totalSeats =0
ts.forEach(t => {totalSeats+= t.seats});

let reserved = []
let utilization=[]
let line=[]
let res = false
let totalGuests=0
let util=0
//For each open hour
for(let i =hours.opening; i<hours.closing; i+=100){
  totalGuests=0
  line=[]
  line.push(i)
  for(let j=0; j<ts.length; j++){
    res = false
    for(let k=0; k<reservations.length; k++){
      if(reservations[k].time == i && reservations[k].table_num==ts[j].tid){
        res=true
        totalGuests+=reservations[k].guests
      }
    }
    line.push(res)
  }
  util = Math.round(100*totalGuests/totalSeats)
  utilization.push(util)
  reserved.push(line)
}
pool.end()
return {
  statusCode: 200,
  body: {
    "tables": ts, 
    "reserved:": reserved,
    "utilization": utilization}
}
}
