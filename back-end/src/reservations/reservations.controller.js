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
  "people"
]

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
)

function hasValidProperties(req, res, next) {
  const {reservation_date, reservation_time, people} = req.body.data
  if(!Number.isInteger(people) || people < 1) {
    return next({
      status: 400,
      message: "people is not a valid number",
    })
  }
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
  service.read(req.params.reservationId)
  .then((reservation) => {
    if(reservation) {
      res.locals.reservation = reservation
      return next()
    }
    next({
      status: 404,
      message: `Reservation cannot be found`
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
    console.log(time.split(":"))
    const timeParts = time.split(":")
    if(timeParts[0] <= 10 || timeParts[0] >= 22) {
      return next({
        status: 400,
        message: "Reservations can only be made between 10:30AM and 9:30PM"
      })


    }
    next();
  }

async function create(req, res) {
  const data = await service.create(req.body.data)
    res.status(201).json({ data })

}

  async function list(req, res) {
    const { date, mobile_number} = req.query
    let data;
  
    if (date) {
      data = await service.listByDate(date);
     } 
     else if(mobile_number) {
      data = await service.search(mobile_number);
    } 
    else {
      data = await service.list()
    }
    console.log("data", data)
    res.json({ data });
  }


module.exports = {
  list,
  //read: [reservationExists, asyncErrorBoundary(read)],
  create: [ 
    hasOnlyValidProperties, 
    hasRequiredProperties, 
    hasValidProperties, 
    validateDateAndTime, 
    asyncErrorBoundary(create)
  ],
};
