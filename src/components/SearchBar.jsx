import { FaSearch } from "react-icons/fa"

function SearchBar() {
  return (
    <div className="px-4 mt-4">

      <div className="bg-zinc-900 rounded-2xl flex items-center px-4 py-4">

        <FaSearch className="text-zinc-400" />

        <input
          type="text"
          placeholder="Search by district, ward or university"
          className="bg-transparent outline-none text-white ml-3 w-full"
        />

      </div>

    </div>
  )
}

export default SearchBar