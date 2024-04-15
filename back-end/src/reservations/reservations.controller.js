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


// async function list(req, res) {
//   const data = await service.list()
//   res.json({data});
// }


async function create(req, res) {
  const data = await service.create(req.body.data)
    res.status(201).json({ data })

}

async function list(req, res) {
  const reservationDate = req.query.date
  const data = await service.listReservationsByTime(reservationDate)
  console.log(data)
  res.json({ data }) 
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [ hasOnlyValidProperties, hasRequiredProperties, hasValidProperties, asyncErrorBoundary(create)],
};
