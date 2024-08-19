import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import axios from "axios"
import CustomDropdown from "components/Patient/CustomDropdown"
import AOS from "aos"
import "aos/dist/aos.css"
import Image from "next/image"

interface AddPrescription {
  id: string
  name: string
}

interface ModalProps {
  results: AddPrescription
  onClose: () => void
  userId: string
}

interface Medicine {
  id: string
  name: string
  quantity: string
  category: string
  expiry_date: string
  price: string
  how_to_use: string
  side_effect: string
  status: boolean
  pub_date: string
}

interface Category {
  id: string
  name: string
  medicines: Medicine[]
  status: boolean
  pub_date: string
}

interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
}

interface Procedure {
  id: string
  name: string
}

const PrescriptionModal: React.FC<ModalProps> = ({ results, onClose, userId }) => {
  const [category, setCategory] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [code, setCode] = useState<string>("")
  const [unit, setUnit] = useState<number>(1)
  const [dosage, setDosage] = useState<number>(1)
  const [rate, setRate] = useState<string>("")
  const [usage, setUsage] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [complain, setComplain] = useState<string>("")
  const [status, setStatus] = useState<boolean>(true)
  const [doctorName, setDoctorName] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showErrorNotification, setShowErrorNotification] = useState(false)
  const [procedureData, setProcedureData] = useState<Procedure[]>([])
  const [procedure, setProcedure] = useState<string>("")

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchUserDetails()
    fetchProcedure()
  }, [])

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("id")
      if (userId) {
        const response = await axios.get<UserDetails>(
          `https://api.caregiverhospital.com/app_user/get-user-detail/${userId}/`
        )
        if (response.data) {
          setUserDetails(response.data)
        } else {
          console.log("User details not found.")
        }
      } else {
        console.log("User ID not found.")
      }
    } catch (error) {
      setError("Failed to load user details.")
      console.error("Error fetching user details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProcedure = async () => {
    try {
      const response = await fetch(`https://api.caregiverhospital.com/procedure/procedure/`)
      if (!response.ok) {
        throw new Error("Failed to fetch procedure")
      }
      const data = (await response.json()) as Procedure[]
      setProcedureData(data)
    } catch (error) {
      console.error("Error fetching procedure:", error)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`https://api.caregiverhospital.com/medicine-category/medicine-category/`)
        if (!response.ok) {
          throw new Error("Failed to fetch medicine categories")
        }
        const data = (await response.json()) as Category[]
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryChange = (selectedCategoryId: string) => {
    setCategory(selectedCategoryId)
    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)
    if (selectedCategory) {
      setMedicines(selectedCategory.medicines)
    } else {
      setMedicines([])
    }
  }

  const handleAddPrescription = async () => {
    if (userDetails) {
      setDoctorName(userDetails.username)
    }

    const selectedCategory = categories.find((cat) => cat.id === category)
    const selectedMedicine = medicines.find((med) => med.id === name)
    const selectedComplain = complaintsOptions.find((comp) => comp.id === complain)
    const selectedProceduce = procedureData.find((pro) => pro.id === procedure)
    const procedureName = selectedProceduce ? selectedProceduce.name : ""

    const prescriptionData = {
      doctor_name: doctorName,
      category: selectedCategory ? selectedCategory.name : "",
      name: selectedMedicine ? selectedMedicine.name : "",
      complain: selectedComplain ? selectedComplain.name : "",
      code: procedureName,
      unit,
      dosage,
      rate,
      usage,
      note,
      status,
      pub_date: new Date().toISOString(),
    }

    try {
      console.log("Prescription data being sent:", prescriptionData)

      const response = await fetch(
        `https://api.caregiverhospital.com/patient/add-prescription-to-patient/${results.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionData),
        }
      )

      if (!response.ok) {
        const responseBody = await response.json()
        console.error("Failed to add prescription. Status:", response.status, "Response body:", responseBody)
        throw new Error("Failed to add prescription")
      }

      setShowSuccessNotification(true)
      setTimeout(() => setShowSuccessNotification(false), 5000)
      onClose()
    } catch (error) {
      console.error("Error adding prescription:", error)
      setShowErrorNotification(true)
      setTimeout(() => setShowErrorNotification(false), 5000)
    }
  }

  const complaintsOptions = [
    { id: "1", name: "Pain (Abdominal, Chest, Joint, Waist)" },
    { id: "2", name: "Discharge (Eye, Nose, Vagina, Penial)" },
    { id: "3", name: "Weakness" },
    { id: "4", name: "Vomiting" },
    { id: "5", name: "Cough" },
    { id: "6", name: "Catarrh" },
    { id: "7", name: "Stooling" },
    { id: "8", name: "Poor Appetite" },
    { id: "9", name: "Poor Sleep" },
    { id: "10", name: "Rashes" },
    { id: "11", name: "Sore throat" },
    { id: "12", name: "Fever" },
    { id: "13", name: "Itching (Eye, Body, Ear, Perineal)" },
    { id: "14", name: "Swollen (Eye, Ear, Nose, Perineal, Penial)" },
  ]

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.modalContent}>
        <div className="my-2 w-full"></div>
        <div className="px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-lg font-semibold">Add Prescription for {results.name}</p>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>

          <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
            <CustomDropdown
              options={procedureData.map((pro) => ({ id: pro.id, name: pro.name }))}
              selectedOption={procedure}
              onChange={setProcedure}
              placeholder="Select Procedure"
            />
          </div>

          <div className="my-2 flex w-full gap-2">
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <CustomDropdown
                options={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
                selectedOption={category}
                onChange={handleCategoryChange}
                placeholder="Select Category"
              />
            </div>
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <CustomDropdown
                options={medicines.map((med) => ({ id: med.id, name: med.name }))}
                selectedOption={name}
                onChange={setName}
                placeholder="Select Medicine"
              />
            </div>
          </div>
          <div className="my-2 flex w-full gap-2">
            <div className="w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="number"
                  id="unit"
                  placeholder="Unit"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={unit}
                  onChange={(e) => setUnit(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="number"
                  id="dosage"
                  placeholder="Dosage"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={dosage}
                  onChange={(e) => setDosage(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="my-2 flex w-full gap-2">
            <div className=" w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="rate"
                  placeholder="Enter Rate"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
                <input
                  type="text"
                  id="usage"
                  placeholder="Enter Usage"
                  className="h-[45px] w-full bg-transparent text-xs outline-none focus:outline-none"
                  style={{ width: "100%", height: "45px" }}
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="my-2 w-full">
            <div className="search-bg mt-1 flex h-[50px] w-[100%] items-center justify-between gap-3 rounded  py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <CustomDropdown
                options={complaintsOptions.map((comp) => ({ id: comp.id, name: comp.name }))}
                selectedOption={complain}
                onChange={(selected) => setComplain(selected)}
                placeholder="Select Complain"
              />
            </div>
          </div>

          <div className="my-2 w-full">
            <div className="search-bg mt-1 flex h-[80px] w-[100%] items-center justify-between gap-3 rounded px-3 py-1 hover:border-[#5378F6] focus:border-[#5378F6] focus:bg-[#FBFAFC] max-sm:mb-2">
              <textarea
                id="note"
                placeholder="Enter Note"
                className="h-[75px] w-full bg-transparent text-xs outline-none focus:outline-none"
                style={{ width: "100%", height: "75px" }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              className={`button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]`}
              onClick={handleAddPrescription}
            >
              Add Prescription
            </button>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16 m-5  flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514] md:right-16">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Sent Successfully</span>
        </div>
      )}
      {showErrorNotification && (
        <div className="animation-fade-in 0 absolute bottom-16  m-5 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#D14343] bg-[#FEE5E5] text-[#D14343] shadow-[#05420514] md:right-16">
          <Image src="/check-circle-failed.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#D14343]">Failed to add prescription</span>
        </div>
      )}
    </div>
  )
}

export default PrescriptionModal
