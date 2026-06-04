function Categories() {
    const categories = [
      "Apartments",
      "Rooms",
      "Hostels",
      "Offices",
      "Shops",
      "Luxury",
    ]
  
    return (
      <div className="px-4 mt-6 overflow-x-auto">
  
        <div className="flex gap-3 w-max">
  
          {categories.map((category, index) => (
            <button
              key={index}
              className="bg-zinc-900 text-white px-5 py-3 rounded-2xl whitespace-nowrap hover:bg-white hover:text-black transition"
            >
              {category}
            </button>
          ))}
  
        </div>
  
      </div>
    )
  }
  
  export default Categories