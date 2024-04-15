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

  function validateDate(req, res, next) {
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
    next();
  }

async function create(req, res) {
  const data = await service.create(req.body.data)
    res.status(201).json({ data })

}

  async function list(req, res) {
    let data;
  
    if (req.query.date) {
      data = await service.list(req.query.date);
     } 
     else {
      data = await service.search(req.query.mobile_number);
    }
    console.log("data", data)
    res.json({ data });

  }


module.exports = {
  list,
  create: [ hasOnlyValidProperties, hasRequiredProperties, hasValidProperties, validateDate, asyncErrorBoundary(create)],
};
