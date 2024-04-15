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

const hasRequiredProperties = hasProperties(VALID_PROPERTIES)

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
  console.log(data)
    res.status(201).json({ data })

}

async function list(req, res) {
  const reservationDate = req.query.date
  const data = await service.listReservationsByTime(reservationDate)
  res.json({ data }) 
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasOnlyValidProperties, hasRequiredProperties, asyncErrorBoundary(create)],
};
