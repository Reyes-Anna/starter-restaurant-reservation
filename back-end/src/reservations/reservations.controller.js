/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")


const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
)

function validPeople(req, res, next) {
  const people = req.body.data.people;
  if(people && people > 0 && typeof people === "number") {
    return next()
  }
  next({
    status: 400,
    message: `number of people is required`
  })
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

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body

  const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field))

  if(invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
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

  function validateDateAndTime(req, res, next) {
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
  
    if(timeParts < "1030" || timeParts > "2230") {
      return next({
        status: 400,
        message: "Reservations can only be made between 10:30AM and 9:30PM"
      })
    }
    next();

  }

//causes POST to timeout
async function isBooked(req, res, next) {
  const {data} = req.body
  if(data.status == "finished" || data.status == "seated") {
    return next({
      status: 400,
      message: "A new reservation cannot be made unless status is booked"
    })
  }
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
      data = await service.list()
    }
   // console.log("reservation", reservation)
    res.json({ data: reservation });
  }

  async function read(req, res, next) {
    res.json({data: await service.read()})
}

async function update(req, res, next) {
  const updateReservation =  {
      ...req.body.data,
      reservation_id: res.locals.reservation.reservation_id,
  }
  const data = await service.update(updateReservation)
    res.json ({ data })
}

async function updateStatus(req, res, next) {
  const updateStatus=  {
    ...res.locals.reservation,
    status: res.locals.status,
}
const data = await service.updateStatus(updateStatus)
  res.json ({ data })
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [reservationExists, asyncErrorBoundary(read)],
  create: [ 
    hasOnlyValidProperties,
    validPeople, 
    hasRequiredProperties, 
    hasValidProperties, 
    validateDateAndTime,
    asyncErrorBoundary(create),
  ],
  update: [
    hasOnlyValidProperties, 
    hasRequiredProperties, 
    hasValidProperties, 
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    reservationExists,
    isFinished,
    asyncErrorBoundary(updateStatus)
  ],
  reservationExists,
};
