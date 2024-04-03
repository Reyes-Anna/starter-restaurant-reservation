/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/new").get(controller.create)


router.route("/").get(controller.list);

module.exports = router;
