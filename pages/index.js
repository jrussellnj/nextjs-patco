import Link from 'next/link'

function HomePage() {
  const stations = [
    {
      'name': 'Lindenwold',
      'slug': 'lindenwold'
    },
    {
      'name': 'Ashland',
      'slug': 'ashland'
    },
    {
      'name': 'Woodcrest',
      'slug': 'woodcrest'
    },
    {
      'name': 'Haddonfield',
      'slug': 'haddonfield'
    },
    {
      'name': 'Westmont',
      'slug': 'westmont'
    },
    {
      'name': 'Collingswood',
      'slug': 'collingswood'
    },
    {
      'name': 'Ferry Avenue',
      'slug': 'ferry-avenue'
    },
    {
      'name': 'Broadway',
      'slug': 'broadway'
    },
    {
      'name': 'City Hall',
      'slug': 'city-hall'
    },
    {
      'name': '8th & Market',
      'slug': '8th-market'
    },
    {
      'name': '9-10th & Locust',
      'slug': '9-10th-locust'
    },
    {
      'name': '12-13th & Locust',
      'slug': '12-13th-locust'
    },
    {
      'name': '15-16th & Locust',
      'slug': '15-16th-locust'
    }
  ]

  const stationLinks = stations.map((station) =>
    <div key={station.slug}>
      <Link href={ '/s/' + station.slug}>
        <a>{ station.name }</a>
      </Link>
    </div>
  )

  return (
    <div>
      <header>
        Next PATCO
      </header>

      { stationLinks }
    </div>
  )
}

export default HomePage
