"use client"
import { SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import Link from "next/link"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import PharmacyNav from "components/Navbar/PharmacyNav"

interface Medicine {
  id: string
  name: string
  quantity: string
  category: string
  expiry_date: string
  price: string
  how_to_use: string
  side_effect: string
  medicine_id: string
  status: boolean
  pub_date: string
}

interface Category {
  id: string
  name: string
  medicines: Medicine[]
}

export default function Medicines() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("https://api.caregiverhospital.com/medicine-category/medicine-category/")
        if (!response.ok) {
          throw new Error("Failed to fetch medicines")
        }
        const data = (await response.json()) as Category[]
        const extractedMedicines: Medicine[] = data.flatMap((category) =>
          category.medicines.map((medicine) => ({
            ...medicine,
            category: category.name, // Assign category name to each medicine
          }))
        )
        setMedicines(extractedMedicines)
      } catch (error) {
        console.error("Error fetching medicines:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [])

  const handlePatientClick = (medicineId: string) => {
    router.push(`/medicines/medicine-details/${medicineId}`)
  }

  const medicinesPerPage = 7
  const indexOfLastMedicine = currentPage * medicinesPerPage
  const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage
  const currentMedicines = medicines.slice(indexOfFirstMedicine, indexOfLastMedicine)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(medicines.length / medicinesPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    setCurrentPage(pageNumber)
  }

  const filteredMedicines = currentMedicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <section className="h-full ">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <PharmacyNav />

            <div className="flex items-center gap-2 px-16 pt-4 max-md:px-3">
              <p className="font-bold">Pharmacy</p>
              <IoIosArrowForward />
              <p className="capitalize">List of Medicines</p>
            </div>
            {filteredMedicines.length === 0 ? (
              <></>
            ) : (
              <div className="mb-6 mt-10 flex items-center justify-between px-16 max-md:px-3">
                <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-sm:w-[180px] lg:w-[300px]">
                  <Image className="dark-icon-style" src="/search-dark.svg" width={16} height={16} alt="dekalo" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search"
                    className="w-full bg-transparent text-xs outline-none focus:outline-none"
                    style={{ width: "100%" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link href="/medicines/add" className="add-button">
                  <p className="text-[12px]">Add New Item</p>
                  <GoPlus />
                </Link>
              </div>
            )}

            <div className="flex h-full flex-col gap-2 px-16 max-sm:px-3">
              {loading ? (
                <div className="loading-text flex h-full items-center justify-center">
                  {"loading...".split("").map((letter, index) => (
                    <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                      {letter}
                    </span>
                  ))}
                </div>
              ) : error ? (
                <p>{error}</p>
              ) : filteredMedicines.length === 0 ? (
                <>
                  <div className="mt-auto flex h-full w-full items-center justify-center">
                    <div>
                      <Image src="/undraw_medical_care_movn.svg" height={237} width={341} alt="pharmacy" />
                      <div className="mt-16 items-center justify-center">
                        <h1 className="text-center text-5xl font-bold">No Medicines Found</h1>
                        <Link className="flex cursor-pointer items-center justify-center" href="/medicines/add">
                          <p className="text-center">Add a new Medicine</p>
                          <IoAddCircleSharp />
                        </Link>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </>
              ) : (
                filteredMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2"
                    onClick={() => handlePatientClick(medicine.id)}
                  >
                    <div className="w-full">
                      <p className="text-sm font-bold">{medicine.name}</p>
                      <small className="text-xs">Medicine Name</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <p className="text-sm font-bold">{medicine.medicine_id}</p>
                      <small className="text-xs">Medicine Id</small>
                    </div>
                    <div className="w-full max-sm:hidden">
                      <div className="flex gap-1 text-sm font-bold">{medicine.category}</div>
                      <small className="text-xs">Category</small>
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-bold">{medicine.quantity}</p>
                      <small className="text-xs">Quantity in Stock</small>
                    </div>
                    <div className="">
                      <button className="w-full whitespace-nowrap px-2 py-[2px] text-center text-xs font-semibold">
                        View Full Detail
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {filteredMedicines.length === 0 ? (
              <></>
            ) : (
              <div className="mb-4 mt-4 flex items-center justify-end px-16 max-sm:px-3">
                <ul className="flex items-center gap-2">
                  <li className="flex items-center">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                      <IoIosArrowBack />
                    </button>
                  </li>
                  {pageNumbers.map((number) => (
                    <li key={number}>
                      <button
                        onClick={() => handlePageChange(number)}
                        className={
                          currentPage === number
                            ? "h-6 w-6 rounded-full bg-[#131414] text-sm text-[#ffffff] shadow"
                            : "h-6 w-6 rounded-full bg-[#F1FFF0] text-sm text-[#1E1E1E]"
                        }
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className="flex items-center">
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === Math.ceil(medicines.length / medicinesPerPage)}
                    >
                      <IoIosArrowForward />
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}
