import Link from 'next/link'

function HomePage() {
  return (
    <div>
      <header>
        Next PATCO
      </header>

      <Link href="/collingswood">
        <a>Collingswood</a>
      </Link>
    </div>
  )
}

export default HomePage
