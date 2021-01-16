import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { station_name } = router.query

  // Make call to /get-stop-times/{ station_name} here!

  return <p>station name: { station_name }</p>
}

export default Post
