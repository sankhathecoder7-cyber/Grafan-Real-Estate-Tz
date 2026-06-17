import { useState, useEffect } from "react"

import {
  collection,
  addDoc
} from "firebase/firestore"

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

import { db, storage, auth } from "../firebase"

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
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [videoUrl, setVideoUrl] = useState("")

  // Owner Phone
  const [ownerPhone, setOwnerPhone] =
    useState("255792077777")

  // Coordinates
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")

  // Status
  const [status, setStatus] = useState("Available")

  // Loading & Progress
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

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
      images.length === 0
    ) {

      alert("Please fill all required fields and select at least one image")
      return

    }

    try {

      setLoading(true)
      setUploadProgress(0)

      const imageUrls = []
      let totalBytes = 0
      let uploadedBytes = 0

      images.forEach(img => totalBytes += img.size)

      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const imageRef = ref(storage, `properties/${Date.now()}_${image.name}`)
        const uploadTask = uploadBytesResumable(imageRef, image)

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              uploadedBytes += snapshot.bytesTransferred
              const overallProgress = Math.round((uploadedBytes / totalBytes) * 100)
              setUploadProgress(Math.min(overallProgress, 100))
            },
            (error) => {
              reject(error)
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref)
              imageUrls.push(url)
              resolve()
            }
          )
        })
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

          images: imageUrls,
          videoUrl,

          ownerPhone,
          ownerId: auth.currentUser?.uid,
          ownerName: auth.currentUser?.displayName || auth.currentUser?.email,

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

      imagePreviews.forEach(url => URL.revokeObjectURL(url))
      setImages([])
      setImagePreviews([])
      setVideoUrl("")

      setLatitude("")
      setLongitude("")

      setStatus("Available")

      setUploadProgress(0)

    } catch (error) {

      alert(error.message)

    } finally {

      setLoading(false)

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

          {/* Images */}
          <div>

            <label className="block mb-2 font-semibold">
              Property Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="w-full bg-zinc-900 p-4 rounded-2xl"
            />

          </div>

          {/* Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {imagePreviews.map((preview, idx) => (
                <img
                  key={idx}
                  src={preview}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-2xl"
                />
              ))}
            </div>
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

          {/* Progress Bar */}
          {loading && uploadProgress > 0 && (
            <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {loading && (
            <p className="text-zinc-400 text-sm text-center">
              Uploading... {uploadProgress}%
            </p>
          )}

          {/* Upload Button */}
          <button
            onClick={uploadProperty}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >

            {loading ? "Uploading..." : "Upload Property"}

          </button>

        </div>

      </div>

    </div>

  )

}

export default AddProperty
