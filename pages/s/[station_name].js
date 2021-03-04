import { useRouter } from 'next/router'
import Link from 'next/link'
import moment from 'moment'

function Station({ stopTimes }) {
  const router = useRouter()
  const { station_name } = router.query

  // To Lindenwold
  const stopTimesToLindenwold = stopTimes[1].map((time) =>
    <div key={time}>{moment(time, 'HH:mm:ss').format('h:mm A')}</div>
  )

  // To Philadelphia
  const stopTimesToPhiladelphia = stopTimes[2].map((time) =>
    <div key={time}>{moment(time, 'HH:mm:ss').format('h:mm A')}</div>
  )

  return (
    <div className="station-page">
      <div>The next trains departing from: { station_name }</div>
      <Link href="/">Back to stations</Link>

      <h2>To Philadelphia</h2>
      <div className="next-departure">NEXT: { stopTimesToPhiladelphia[0] }</div>
      <div className="upcoming-departures">Upcoming: { stopTimesToPhiladelphia.slice(1) }</div>

      <h2>To Lindewnwold</h2>
      <div className="next-departure">NEXT: { stopTimesToLindenwold[0] }</div>
      <div className="upcoming-departures">Upcoming: { stopTimesToLindenwold.slice(1) }</div>
    </div>
  )
}

// Get the departures for the given station
export async function getServerSideProps(context) {

  let stopTimes = []
  const acceptableStationSlugs = [
    'lindenwold',
    'ashland',
    'woodcrest',
    'haddonfield',
    'westmont',
    'collingswood',
    'ferry-avenue',
    'broadway',
    'city-hall',
    '8th-market',
    '9-10th-locust',
    '12-13th-locust',
    '15-16th-locust'
  ]

  // If the provided station name is one of the accepted slugs, fetch data from external API
  if (acceptableStationSlugs.indexOf(context.params.station_name) > -1) {
    const res = await fetch(`http://localhost:3000/get-stop-times/${context.params.station_name}`)
    stopTimes = await res.json()
  }

  // Pass data to the page via props
  return { props: { stopTimes} }
}

export default Station
