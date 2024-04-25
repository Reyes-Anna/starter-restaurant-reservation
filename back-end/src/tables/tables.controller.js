const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")



const hasRequiredProperties = hasProperties(
   "table_name",
   "capacity",
  )

  function hasValidProperties(req, res, next) {
    const {table_name, capacity} = req.body.data
    if(!Number.isInteger(capacity) || capacity < 1) {
      return next({
        status: 400,
        message: "capacity must be at least 1",
      })
    }

    if(table_name.length < 2) {
      return next({
        status:400,
        message: "table_name must be longer than one character",
      })
    }
    next()
  }

 async function tableExists(req, res, next) {
    const { table_id } = req.params
    const table = await service.read(table_id)
      if(table) {
        res.locals.table = table
        return next()
      }
      next({
        status: 404,
        message: `Table '${table_id}' cannot be found`
      })
    }

async function reservationExists(req, res, next) {
    const { reservation_id } = req.params
    const reservation = await service.readReservationId(reservation_id)
    if(reservation) {
        res.locals.reservation = reservation
    }
    next({
        status:404,
        message: `Reservation '${reservation_id}' does not exist`
    })
    next()
}

async function validRequest(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: `requires request data`,
    });
  }
  if (!data.reservation_id) {
    return next({
      status: 400,
      message: `Requires reservation_id property`,
    });
  }
  next();
}

function validTable(req, res, next) {
  const reservation = res.locals.reservation;
  const table = res.locals.table;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message:
        "Table does not have sufficient capacity to handle this reservation",
    });
  }

  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: "Table is occupied!",
    });
  }
  next();
}

function checkIfSeated(req, res, next) {
  const { reservation_id, status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: `Reservation ${reservation_id} has already been seated!`,
    });
  }
  next();
}
    

async function list(req, res, next) {
   const data = await service.list() 
    res.json({data})
}

async function create(req, res) {
    const data = await service.create(req.body.data)
      res.status(201).json({ data })
  }

async function read(req, res, next) {
    res.json({data: await service.read(table_id)})
}

async function update(req, res, next) {
  const reservation_id = res.locals.reservation.reservation_id;
  const table = res.locals.table;
  const updatedTable = {
    ...table,
    reservation_id: reservation_id,
  };

  service.newStatus(reservation_id, "seated");
  const updatedRes = await service.update(updateReservation)
  res.json ({ data: { reservation_id: updatedRes} })
}


async function destroy(req, res, next) {
    res.json({data})
}





module.exports = {
    list,
    read: [
        tableExists, 
        asyncErrorBoundary(read)
    ],
    update: [
        validRequest,
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        validTable,
        checkIfSeated,
        asyncErrorBoundary(update)
    ],
    create: [
        hasRequiredProperties, 
        hasValidProperties, 
        asyncErrorBoundary(create)
    ],
    delete: [
        tableExists,
        asyncErrorBoundary(destroy)
    ]
}