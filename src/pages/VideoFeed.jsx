import VideoCard from "../components/VideoCard"
import Navbar from "../components/Navbar"

function VideoFeed() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">

      <VideoCard />
      <VideoCard />
      <VideoCard />

      <Navbar />

    </div>
  )
}

export default VideoFeed