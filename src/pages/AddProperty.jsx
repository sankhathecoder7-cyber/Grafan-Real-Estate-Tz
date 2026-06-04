import { useState } from "react"

import {
  collection,
  addDoc
} from "firebase/firestore"

import { db } from "../firebase"

function AddProperty() {

  // Basic Info
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [region, setRegion] = useState("")
  const [district, setDistrict] = useState("")
  const [ward, setWard] = useState("")
  const [street, setStreet] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")

  // Property Details
  const [bedrooms, setBedrooms] = useState("")
  const [bathrooms, setBathrooms] = useState("")
  const [size, setSize] = useState("")
  const [parking, setParking] = useState("Yes")
  const [furnished, setFurnished] = useState("No")

  // Media
  const [image, setImage] = useState(null)
  const [videoUrl, setVideoUrl] = useState("")

  // Owner Phone
  const [ownerPhone, setOwnerPhone] =
    useState("255792077777")

  // Coordinates
  const [latitude, setLatitude] =
    useState("")

  const [longitude, setLongitude] =
    useState("")

  // Status
  const [status, setStatus] =
    useState("Available")

  const uploadProperty = async () => {

    if (
      !title ||
      !location ||
      !region ||
      !district ||
      !ward ||
      !street ||
      !price ||
      !category ||
      !image
    ) {

      alert("Please fill all required fields")
      return

    }

    try {

      let imageUrl = ""

if (image) {

  imageUrl = URL.createObjectURL(image)

}

      await addDoc(
        collection(db, "properties"),
        {
          title,
          location,
          region,
          district,
          ward,
          street,
          price,
          category,

          bedrooms,
          bathrooms,
          size,

          parking,
          furnished,

          image: imageUrl,
          videoUrl,

          ownerPhone,

          latitude,
          longitude,

          status,

          createdAt: new Date()
        }
      )

      alert("Property Uploaded Successfully ✅")

      // Reset Fields
      setTitle("")
      setLocation("")
      setRegion("")
      setDistrict("")
      setWard("")
      setStreet("")
      setPrice("")
      setCategory("")

      setBedrooms("")
      setBathrooms("")
      setSize("")

      setParking("Yes")
      setFurnished("No")

      setImage("null")
      setVideoUrl("")

      setLatitude("")
      setLongitude("")

      setStatus("Available")

    } catch (error) {

      alert(error.message)

    }

  }

  return (

    <div className="bg-zinc-950 min-h-screen text-white p-4 md:p-8">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-bold">
          Upload Property
        </h1>

        <p className="text-zinc-400 mt-3">
          Add modern real estate listings across Tanzania
        </p>

        <div className="mt-10 space-y-5">

          {/* Title */}
          <input
            type="text"
            placeholder="Property Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Region */}
          <input
            type="text"
            placeholder="Region"
            value={region}
            onChange={(e) =>
              setRegion(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* District */}
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) =>
              setDistrict(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Ward */}
          <input
            type="text"
            placeholder="Ward"
            value={ward}
            onChange={(e) =>
              setWard(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Street */}
          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) =>
              setStreet(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Price */}
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          >

            <option value="">
              Select Property Type
            </option>

            <option value="Apartment">
              Apartment
            </option>

            <option value="House">
              House
            </option>

            <option value="Hostel">
              Hostel
            </option>

            <option value="Hotel">
              Hotel
            </option>

            <option value="Office">
              Office
            </option>

            <option value="Warehouse">
              Warehouse
            </option>

            <option value="Land">
              Land
            </option>

            <option value="Shop">
              Shop
            </option>

          </select>

          {/* Bedrooms */}
          <input
            type="number"
            placeholder="Bedrooms"
            value={bedrooms}
            onChange={(e) =>
              setBedrooms(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Bathrooms */}
          <input
            type="number"
            placeholder="Bathrooms"
            value={bathrooms}
            onChange={(e) =>
              setBathrooms(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Size */}
          <input
            type="text"
            placeholder="Property Size"
            value={size}
            onChange={(e) =>
              setSize(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Parking */}
          <select
            value={parking}
            onChange={(e) =>
              setParking(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          >

            <option value="Yes">
              Parking Available
            </option>

            <option value="No">
              No Parking
            </option>

          </select>

          {/* Furnished */}
          <select
            value={furnished}
            onChange={(e) =>
              setFurnished(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          >

            <option value="Yes">
              Furnished
            </option>

            <option value="No">
              Not Furnished
            </option>

          </select>

          {/* WhatsApp Number */}
          <input
            type="text"
            placeholder="WhatsApp Number"
            value={ownerPhone}
            onChange={(e) => {

              const cleaned =
                e.target.value
                  .replace(/\D/g, "")

              setOwnerPhone(cleaned)

            }}
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          <p className="text-zinc-400 text-sm">
            Example: 255792077777
          </p>

          {/* Latitude */}
          <input
            type="text"
            placeholder="Latitude (Optional)"
            value={latitude}
            onChange={(e) =>
              setLatitude(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Longitude */}
          <input
            type="text"
            placeholder="Longitude (Optional)"
            value={longitude}
            onChange={(e) =>
              setLongitude(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Status */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          >

            <option value="Available">
              Available
            </option>

            <option value="Sold">
              Sold
            </option>

            <option value="Rented">
              Rented
            </option>

          </select>

          {/* Image */}
          {/* Property Image Upload */}
<div>

<label className="block mb-2 font-semibold">
  Property Image
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setImage(e.target.files[0])
  }
  className="w-full bg-zinc-900 p-4 rounded-2xl"
/>

</div>

{/* Preview */}
{image && (

<img
  src={URL.createObjectURL(image)}
  alt="Preview"
  className="w-full h-60 object-cover rounded-2xl mt-4"
/>

)}

          {/* Video */}
          <input
            type="text"
            placeholder="Video URL (Optional)"
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(e.target.value)
            }
            className="w-full bg-zinc-900 p-4 rounded-2xl outline-none"
          />

          {/* Upload Button */}
          <button
            onClick={uploadProperty}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-300 transition"
          >

            Upload Property

          </button>

        </div>

      </div>

    </div>

  )

}

export default AddProperty