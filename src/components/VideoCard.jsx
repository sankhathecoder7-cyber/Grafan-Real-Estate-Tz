function VideoCard() {
    return (
      <div className="relative h-screen w-full snap-start overflow-hidden">
  
        <video
          className="w-full h-full object-cover"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          autoPlay
          loop
          muted
        />
  
        <div className="absolute inset-0 bg-black/40" />
  
        <div className="absolute bottom-24 left-0 p-5 text-white w-full">
  
          <div className="flex justify-between items-center">
  
            <div>
              <h2 className="text-2xl font-bold">
                Modern Apartment
              </h2>
  
              <p className="text-zinc-300 mt-2">
                📍 Mikocheni, Dar es Salaam
              </p>
  
              <p className="text-3xl font-bold mt-4">
                650,000 TZS
              </p>
            </div>
  
            <div className="bg-green-500 text-black px-4 py-2 rounded-full font-semibold">
              Verified
            </div>
  
          </div>
  
          <button className="w-full bg-white text-black py-4 rounded-2xl mt-6 font-bold">
            Request & Get OTP
          </button>
  
        </div>
  
      </div>
    )
  }
  
  export default VideoCard