/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
)

function hasData(req, res, next ) {
  if(req.body.data) {
    return next()
  }
  next({ 
    status: 400,
    message: "Body must have a data property"
  })
}

function validPeople(req, res, next) {
  const { data: { people } = {} } = req.body
  if(!Number.isInteger(people)) {
    next({
      status: 400,
      message: `number of people is required`
    })
  }
  next()
}

function hasValidProperties(req, res, next) {
  const {reservation_date, reservation_time} = req.body.data
  const dateFormat = /^\d{4}\-\d{1,2}\-\d{1,2}$/
  if(!reservation_date.match(dateFormat)) {
    return next({
      status:400,
      message: "reservation_date does not match the correct date format",
    })
  }
  const timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  if(!reservation_time.match(timeFormat)) {
    return next({
      status:400,
      message: "reservation_time does not match the correct time format",
    })
  }
  next()
}

function reservationExists(req, res, next) {
  const {reservation_id} = req.params
  service.read(reservation_id)
  .then((reservation) => {
    if(reservation) {
      res.locals.reservation = reservation
      return next()
    }
    next({
      status: 404,
      message: `Reservation '${reservation_id}' cannot be found`
    })
  })
  .catch(next)
}

function validDate(req, res, next) {
  const { data = {} } = req.body;
  const date = data["reservation_date"];
  const time = data["reservation_time"];
  const formattedDate = new Date(`${date}T${time}`);
  const day = new Date(date).getUTCDay();
  const timeParts = time.split(":").join("")
  
  if (isNaN(Date.parse(data["reservation_date"]))) {
    return next({
      status: 400,
      message: `Invalid reservation_date`,
    });
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `Restaurant is closed on Tuesdays`,
    });
  }
  if (formattedDate <= new Date()) {
    return next({
      status: 400,
      message: `Reservation must be in the future`,
    });
  }
  next();
}

function validReservationTime(req, res, next) {
  let time = req.body.data.reservation_time
  time = time.replace(":", "")
  time = parseInt(time)
  if(time < 1030 || time > 2130 ) {
    return next({
            status: 400,
            message: "Reservations can only be made between 10:30AM and 9:30PM"
          })
  }
  next()
 }

async function isBooked(req, res, next) {
  const { status } = req.body.data
  if(status && status !== "booked") {
     next({
      status: 400,
      message: `A new reservation cannot be made with a status of ${status}`
    })
  }
  next()
}

function validStatus(req, res, next) {
  const statusTypes = ["booked", "seated", "finished", "cancelled"]
  const { status } = req.body.data
  if(status && !statusTypes.includes(status)) {
     next({
      status: 400,
      message: `Invalid status: ${status}`
    })
  }
  next()
}


async function isFinished(req, res, next) {
  const { reservation_id } = req.params
  const status = res.locals.reservation.status
  if(status == "finished") {
    return next({
      status: 400,
      message: `Reservation '${reservation_id}' is already finished.`
    })
  }
  next()
}

async function create(req, res) {
  const data = await service.create(req.body.data)
    res.status(201).json({ data })

}

async function list(req, res, next) {
  const { date, mobile_number} = req.query
  let reservation;

  if (date) {
    reservation = await service.listByDate(date);
    } 
    else if(mobile_number) {
    reservation = await service.search(mobile_number);
  } 
  else {
    reservation = await service.list()
  }
  res.json({ data: reservation });
}

async function read(req, res, next) {
    res.json({data: res.locals.reservation})
}

async function update(req, res, next) {
  const updateReservation =  {
      ...req.body.data,
      reservation_id: res.locals.reservation.reservation_id,
  }
  const data = await service.update(updateReservation)
    res.json ({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [reservationExists, asyncErrorBoundary(read)],
  create: [ 
    hasData,
    validPeople, 
    hasRequiredProperties, 
    hasValidProperties, 
    validDate,
    validReservationTime,
    asyncErrorBoundary(isBooked),
    asyncErrorBoundary(create),
  ],
  update: [ 
    hasRequiredProperties, 
    hasValidProperties, 
    reservationExists,
    validPeople,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    hasData,
    reservationExists,
    validStatus,
    isFinished,
    asyncErrorBoundary(update)
  ],
};
