# Periodic Tables

## Deployed Link []

## Table of Contents

* [General Information](#general-information)
* [Technologies](#technologies)
* [Summary](#summary)
* [Installation](#installation)
* [Running Tests](#running-tests)

## General Information

Periodic tables is a restaurant reservation system that allows restaurant owners to track all reservations for a given day, as well as make updates to reservations, assign reservations to tables, and then clear the tables at the end of the visit. Reservations can also be easily searched by phone number.

## Technologies

### Front-End

* React
* Bootstrap 4

### Back-End

* Node JS
* Express
* Knex
* PostgreSQL

## Summary

### Create New Reservation

Navigate to the New Reservation Page on the side menu, and fill out all fields of the form. Once the form is submitted, you will be navigated over to the Dashboard, which will display all reservations for that given day, as well as the reservation that was just created.

### View Reservations by Day

On start-up, the dashboard loads all reservations for a given day. You have options to navigate to the Previous day, Today, and the Next Day.

### Cancel Reservation Button

Once you cancel a reservation the action cannot be undone. Canceled reservations will no longer be displayed on the dashboard, but can still be looked up via Search. 

### Seat Reservation Button

 When clicked, the seat button navigates to a seperate page where you are able to select a table for the given reservation. All existing tables will be displayed, but only tables that are both Free, and able to accomidate the reservation size can be selected.
 Once a table is selected the dashboard will now display that the reservation is seated and that the table is occupied.

### Edit Reservation Button

  Allows users to make changes to existing reservations

### Search Reservations

Each reservation, including canceled ones, can be looked up by full or partial phone number.

### Add Tables

New tables can be added to the system by navigating to the New Table page and inputting the necessary criteria

### Finish Button

Updates a table from occupied back to free, and updated the reservation id to a finished status.


## API

### Create Reservation

**POST** `/reservations`

* Required Body:

| Param | Type |
|-------|------|
|`first_name`| `string`|
|`last_name`|`string`|
| `mobile_number` | `string`|
| `reservation_date`| `date`|
| `reservation_time`| `time`|
| `people`| `integer` |

### Get Reservation by ID

`/reservation/:reservation_id`

* **GET** - returns a reservation if ID exists
* **PUT** - updates an existing reservation

* Required Params: reservation_id

* Required Body:

| Param | Type |
|-------|------|
|`first_name`| `string`|
|`last_name`|`string`|
| `mobile_number` | `string`|
| `reservation_date`| `date`|
| `reservation_time`| `time`|
| `people`| `integer` |

### Reservation Status

* **PUT** `/reservation/:reservation_id/status`

Allows status to be updated from booked to seated, cancelled, finished


### Create Table

**POST** `/tables`

Creates a new table

* Required Body:

| Params | Type |
|--------|------|
| `table_name` | `string` |
| `capacity` | `integer` |

### Get Table

**GET** `/tables`

Returns a list of tables

### Seat Table

**PUT** `/tables/table_id/seat`
* Required Body: reservation_id

### Finish Table

**DELETE** `/tables/:table_id/seat`

* Removes reservation_id associated with table and updates status of reservation to "finished"

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

### Database setup

 Set up four new SQL database instances - development, test, preview, and production.

### Knex

Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located.

## Running tests

This project has unit, integration, and end-to-end (e2e) tests.

Test are split up by user story. You can run the tests for a given user story by running:

`npm run test:X` where `X` is the user story number.

Have a look at the following examples:

* `npm run test:1` runs all the tests for user story 1 (both frontend and backend).
* `npm run test:3:backend` runs only the backend tests for user story 3.
* `npm run test:3:frontend` runs only the frontend tests for user story 3.

Whenever possible, frontend tests will run before backend tests to help you follow outside-in development.

> **Note** When running `npm run test:X` If the frontend tests fail, the tests will stop before running the backend tests. Remember, you can always run `npm run test:X:backend` or `npm run test:X:frontend` to target a specific part of the application.

If you would like a reminder of which npm scripts are available, run `npm run` to see a list of available commands.

Note that the logging level for the backend is set to `warn` when running tests and `info` otherwise.

> **Note**: After running `npm test`, `npm run test:X`, or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

> **Note**: If you are getting a `unable to resolve dependency tree` error when running the frontend tests, run the following command: `npm install --force --prefix front-end`. This will allow you to run the frontend tests.