const bodyParser = require('body-parser');
const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const gtfs = require('gtfs');
const config = require('./config.json');

const moment = require('moment')

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())

  // Endpoint for retriving stop times for a given station
  server.get('/get-stop-times/:station_slug', async (req, res) => {
    const db = await gtfs.openDb(config);

    console.log("-- req.params", req.params)

    // Get the station slug from request
    const the_station = await gtfs.getStops({
      slug: req.params.station_slug
    })

    // Get the service ID for the current day and time at the given station
    const calendar = await gtfs.getCalendars();
    const todays_service = calendar.filter(o => moment().isBetween(String(o['start_date']), String(o['end_date'])) && o[moment().format('dddd').toLowerCase()] == 1)

    // Get all trips for the service ID
    const trips = await gtfs.getTrips({
      service_id: todays_service[0]['service_id']
    })

    const trip_ids = trips.map(o => o['trip_id']);

    // console.log("trip_ids", trip_ids)

    // Get the stop times for the requested station
    const a = await gtfs.getStoptimes({
      trip_id: trip_ids,
      stop_id: the_station[0]['stop_id']
    });

    const departure_times = a.map(o => o['departure_time'])
    // console.log("departure_times", departure_times)

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(departure_times));
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
