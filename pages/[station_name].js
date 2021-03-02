import { useRouter } from 'next/router'
import moment from 'moment'

function Station({ stopTimes }) {
  const router = useRouter()
  const { station_name } = router.query

  console.log("-- stop data", stopTimes)

  stopTimes = stopTimes.map((time) =>
    <div key={time}>{moment(time, 'HH:mm:ss').format('h:mm A')}</div>
  )

  // TODO: Orgranize in directions, not just simply all the stops

  return (
    <>
      <div>The next trains departing from: { station_name }</div>
      <div>{ stopTimes }</div>
    </>
  )
}

// Get the departures for the given station
export async function getServerSideProps(context) {

  let stopTimes = null
  const acceptableStationSlugs = [
    'lindenwold',
    'ashland',
    'woodcrest',
    'haddonfield',
    'westmont',
    'collingswood',
    'ferry-ave',
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
