import Link from 'next/link'

function HomePage() {
  return (
    <div>
      Welcome to Next.js!
      <Link href="/collingswood">
        <a>Collingswood</a>
      </Link>
    </div>
  )
}

export default HomePage
