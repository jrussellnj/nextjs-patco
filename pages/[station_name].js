import { useRouter } from 'next/router'

function Station({ data }) {
  const router = useRouter()
  const { station_name } = router.query

  // Make call to /get-stop-times/{ station_name} here!
  // console.log('/get-stop-times/' + station_name)

  console.log("--data", data)
  return (
    <>
      <h1>{ station_name }</h1>

      <div>{ data }</div>
    </>
  )
}

// Get the departures for the given station
export async function getServerSideProps(context) {

  // Fetch data from external API
  const res = await fetch(`http://localhost:3000/get-stop-times/${context.params.station_name}`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default Station
