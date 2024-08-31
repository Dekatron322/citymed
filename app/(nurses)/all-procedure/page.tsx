"use client"
import Footer from "components/Footer/Footer"
import { IoIosArrowBack, IoIosArrowForward, IoMdSearch } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import { IoAddCircleSharp } from "react-icons/io5"
import DeletePatientModal from "components/Modals/DeletePatientModal"
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import EditProcedureModal from "components/Modals/EditProcedureModal"
import NursesNav from "components/Navbar/NursesNav"

interface Procedure {
  id: string
  name: string
  code: string
  status: string
  price: string
  pub_date: string
}

export default function Patients() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [procedure, setProcedure] = useState<Procedure[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [procedureToDelete, setProcedureToDelete] = useState<Procedure | null>(null)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [procedureToEdit, setProcedureToEdit] = useState<Procedure | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handlePatientClick = (patientId: string) => {
    router.push(`/nurses-dashboard/${patientId}`)
  }

  useEffect(() => {
    fetchProcedure()
  }, [])

  const openModal = (patient: Procedure) => {
    setProcedureToDelete(patient)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setProcedureToDelete(null)
    setIsModalOpen(false)
  }

  const confirmDelete = async () => {
    if (procedureToDelete) {
      try {
        const response = await fetch(`https://api.caregiverhospital.com/procedure/procedure/${procedureToDelete.id}/`, {
          method: "DELETE",
        })
        if (!response.ok) {
          throw new Error("Failed to delete patient")
        }
        setProcedure(procedure.filter((procedure) => procedure.id !== procedureToDelete.id))
        closeModal()
        setShowSuccessNotification(true)
        setTimeout(() => setShowSuccessNotification(false), 5000)
      } catch (error) {
        console.error("Error deleting patient:", error)
      }
    }
  }
  const openEditModal = (procedure: Procedure) => {
    setProcedureToEdit(procedure)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setProcedureToEdit(null)
    setIsEditModalOpen(false)
  }

  const handleEditSave = (updatedProcedure: Procedure) => {
    setProcedure((prev) => prev.map((d) => (d.id === updatedProcedure.id ? updatedProcedure : d)))
  }

  const fetchProcedure = async () => {
    try {
      const response = await fetch("https://api.caregiverhospital.com/procedure/procedure/")
      if (!response.ok) {
        throw new Error("Failed to fetch diagnosis")
      }
      const data = (await response.json()) as Procedure[]
      setProcedure(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching diagnosis:", error)
      setLoading(false)
    }
  }

  const procedurePerPage = 7
  const indexOfLastProcedure = currentPage * procedurePerPage
  const indexOfFirstProcedure = indexOfLastProcedure - procedurePerPage
  const currentProcedure = procedure.slice(indexOfFirstProcedure, indexOfLastProcedure)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(procedure.length / procedurePerPage); i++) {
    pageNumbers.push(i)
  }

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    setCurrentPage(pageNumber)
  }

  const filteredProcedure = currentProcedure.filter((procedure) =>
    procedure.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <>
      <section className="h-full ">
        <div className="flex min-h-screen ">
          <div className="flex w-screen flex-col ">
            <NursesNav />

            <div className="flex items-center gap-2 px-16 pt-4 max-md:px-3">
              <p className="font-bold">Admin Dashboard</p>
              <IoIosArrowForward />
              <p className="capitalize">{pathname.split("/").pop()}</p>
            </div>

            <div className="mb-6 mt-10 flex items-center justify-between px-16 max-md:px-3">
              <div className="search-bg flex h-10 items-center justify-between gap-2 rounded border border-[#CFDBD5] px-3 py-1 max-md:w-[180px] lg:w-[300px]">
                <Image className="icon-style" src="/icons.svg" width={16} height={16} alt="dekalo" />
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
              <Link href="/all-procedure/add" className="add-button">
                <p className="text-[12px]">Add Procedure</p>
                <GoPlus />
              </Link>
            </div>

            <div className="mb-4 flex h-full flex-col gap-2 px-16 max-sm:px-4">
              {loading ? (
                <div className="loading-container pulse flex h-full items-center justify-center">
                  <div className="icon-style content-center">
                    <Image src="/mainlogo.png" width={150} height={43} alt="dekalo" />
                  </div>
                  <div className="dark-icon-style content-center">
                    <Image src="/lightlogo.png" width={150} height={43} alt="dekalo" />
                  </div>
                </div>
              ) : filteredProcedure.length === 0 ? (
                <div className="mt-auto flex h-full w-full items-center justify-center">
                  <div>
                    <Image src="/undraw_medical_care_movn.svg" height={237} width={341} alt="pharmacy" />
                    <div className="mt-16 items-center justify-center">
                      <h1 className="text-center text-5xl font-bold">No Procedure yet</h1>
                      <Link className="flex cursor-pointer items-center justify-center" href="/all-diagnosis/add">
                        <p className="text-center">Add a new Procedure</p>
                        <IoAddCircleSharp />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                filteredProcedure.map((procedure) => (
                  <div
                    key={procedure.id}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg border p-2 "
                  >
                    <div className="flex w-[20%] items-center gap-1 text-sm font-bold">
                      {/* {patient.image ? (
                        <img
                          src={`https://api.caregiverhospital.com${patient.image}`}
                          alt={patient.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : ( */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#50c9f4]">
                        <p className="capitalize text-[#000000]">{procedure.name.charAt(0)}</p>
                      </div>
                      {/* )} */}
                    </div>
                    <div className="flex w-full items-center gap-1 text-sm font-bold">
                      <div>
                        <p>{procedure.name}</p>
                        <small className="text-xs">Procedure</small>
                      </div>
                    </div>

                    <div className="w-full max-md:hidden">
                      <p className="text-sm font-bold">{procedure.code}</p>
                      <small className="text-xs">Procedure Code</small>
                    </div>
                    <div className="w-full max-md:hidden">
                      <div className="flex gap-1 text-sm font-bold">{procedure.price}</div>
                      <small className="text-xs">Price/Unit</small>
                    </div>

                    <div className="w-full max-md:hidden">
                      <div className="flex gap-1 text-sm font-bold">{formatDate(procedure.pub_date)}</div>
                      <small className="text-xs">Date Added</small>
                    </div>

                    <div className="flex gap-2">
                      <BorderColorOutlinedIcon onClick={() => openEditModal(procedure)} />
                      <DeleteForeverIcon className="text-[#F2B8B5]" onClick={() => openModal(procedure)} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredProcedure.length > 0 && (
              <div className="mb-4 flex items-center justify-end px-16 max-sm:px-3 md:mt-4">
                <ul className="flex items-center gap-2">
                  <li>
                    <button className="flex items-center" onClick={handlePrevPage} disabled={currentPage === 1}>
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
                  <li>
                    <button
                      className="flex items-center"
                      onClick={handleNextPage}
                      disabled={currentPage === pageNumbers.length}
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

      <DeletePatientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        patientName={procedureToDelete?.name || ""}
      />

      <EditProcedureModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        procedure={procedureToEdit}
        onSave={handleEditSave}
      />

      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Deleted Successfully</span>
        </div>
      )}
    </>
  )
}
