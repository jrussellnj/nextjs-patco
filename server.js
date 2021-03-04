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

    // Get the station slug from request
    const station = await gtfs.getStops({
      slug: req.params.station_slug
    })

    // Get the service ID for the current day and time at the given station
    const calendar = await gtfs.getCalendars();
    const todays_service = calendar.filter(service =>
      moment().isBetween(String(service['start_date']), String(service['end_date'])) &&
      service[moment().format('dddd').toLowerCase()] == 1
    )

    const serviceIds = [
      1, // to Lindenwold
      2 // to Philadelphia
    ]

    let departureTimes = []
    const rightNow = moment()

    for (i in serviceIds) {
      const thisServiceId = serviceIds[i]

      // Get trips for the given route and service IDs
      const trips = await gtfs.getTrips({
        service_id: todays_service[0]['service_id'],
        route_id: thisServiceId
      })

      const trip_ids = trips.map(o => o['trip_id']);

      // Get the stop times for the requested station
      const stopTimes = await gtfs.getStoptimes({
        trip_id: trip_ids,
        stop_id: station[0]['stop_id']
      });

      departureTimes[thisServiceId] = stopTimes.map(o => o['departure_time'])
      departureTimes[thisServiceId] = departureTimes[thisServiceId].filter(d => moment(d, 'HH:mm:ss') > rightNow)
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(departureTimes));
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
