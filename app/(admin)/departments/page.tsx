"use client"
import { useEffect, useState } from "react"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { IoIosArrowForward } from "react-icons/io"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { GoPlus } from "react-icons/go"
import DepartmentModal from "components/Modals/DepartmentModal"
import { HiOutlineTrash } from "react-icons/hi2"
import DeleteDepartmentModal from "components/Modals/DeleteDepartmentModal"
import AOS from "aos"
import "aos/dist/aos.css"

interface Department {
  id: number
  name: string
  staffCount: number
  slug: string
}

const getDepartmentImage = (departmentName: string): string => {
  switch (departmentName.toLowerCase()) {
    case "pharmacy":
      return "/pharmacy-symbol.svg"
    case "laboratory":
      return "/laboratory-analyst.svg"
    case "medical consultant":
      return "/avatar-doctor-health-hospital-man-medical-2.svg"
    default:
      return "/avatar-doctor-health-hospital-man-medical-2.svg"
  }
}

const getDepartmentUrl = (departmentName: string): string => {
  switch (departmentName.toLowerCase()) {
    case "pharmacy":
      return "pharmacy"
    case "laboratory":
      return "laboratory"
    case "medical consultant":
      return "medical-consultant"
    default:
      return ""
  }
}

export default function Dashboard() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [showDeleteNotification, setShowDeleteNotification] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch("https://api.caregiverhospital.com/department/department/")
      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }
      const data = (await response.json()) as Department[]
      setDepartments(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const openDepartmentModal = () => {
    setIsAddDepartmentOpen(true)
  }

  const closeDepartmentModal = () => {
    setIsAddDepartmentOpen(false)
  }

  const openDeleteModal = (id: number) => {
    setDepartmentToDelete(id)
    setIsDeleteOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteOpen(false)
    setDepartmentToDelete(null)
  }

  const handleHmoSubmissionSuccess = async () => {
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 5000)
    await fetchDepartments()
  }

  const handleDeleteSuccess = async () => {
    setShowDeleteNotification(true)
    setTimeout(() => setShowDeleteNotification(false), 5000)
    closeDeleteModal()
    handleHmoSubmissionSuccess()
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />
            <div className="flex items-center justify-between px-16 pt-4 max-md:px-3">
              <div className="flex items-center gap-2  ">
                <p className="font-bold">Admin Dashboard</p>
                <IoIosArrowForward className="max-md:hidden" />
                <p className="capitalize max-md:hidden">{pathname.split("/").pop()}</p>
              </div>
              <button className="add-button" onClick={openDepartmentModal}>
                <p className="text-xs">Add Department</p>
                <GoPlus />
              </button>
            </div>
            {loading ? (
              <div className="loading-container pulse flex h-full items-center justify-center">
                <div className="icon-style content-center">
                  <Image src="/mainlogo.png" width={150} height={43} alt="dekalo" />
                </div>
                <div className="dark-icon-style content-center">
                  <Image src="/lightlogo.png" width={150} height={43} alt="dekalo" />
                </div>
              </div>
            ) : (
              <div className="my-10 grid grid-cols-2 gap-4 px-16 max-md:mt-4 max-md:grid-cols-1 max-md:px-3">
                {departments.map((department) => (
                  <div
                    key={department.id}
                    className="w-full rounded border p-4"
                    data-aos="fade-in"
                    data-aos-duration="1000"
                    data-aos-delay="500"
                  >
                    <div className="mb-4 flex justify-between">
                      <h6 className="font-bold">{department.name}</h6>
                      <Image src={getDepartmentImage(department.name)} height={48} width={48} alt={department.name} />
                    </div>
                    <div className="flex justify-between">
                      <h6 className="font-bold">Registered Staff</h6>
                      <h6 className="font-bold">{department.staffCount}</h6>
                    </div>
                    <div className="mt-4 flex w-full gap-2 lowercase">
                      <Link
                        href={`departments/${getDepartmentUrl(department.name)}`}
                        className="button-primary h-[50px] w-full rounded-sm capitalize max-sm:h-[45px]"
                      >
                        View
                      </Link>
                      <div
                        onClick={() => openDeleteModal(department.id)}
                        className="flex cursor-pointer content-center items-center justify-center rounded bg-[#F20089] text-[#ffffff] transition-colors duration-500 hover:bg-[#601410] hover:text-[#F2B8B5] max-md:p-2 md:h-[50px] md:w-[50px]"
                      >
                        <HiOutlineTrash />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Footer />
          </div>
        </div>
        <DeleteDepartmentModal
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onSubmitSuccess={handleDeleteSuccess}
          departmentId={departmentToDelete}
        />
        <DepartmentModal
          isOpen={isAddDepartmentOpen}
          onClose={closeDepartmentModal}
          onSubmitSuccess={handleHmoSubmissionSuccess}
        />
      </section>
      {showSuccessNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Successfully added</span>
        </div>
      )}

      {showDeleteNotification && (
        <div className="animation-fade-in absolute bottom-16  right-16 flex h-[50px] w-[339px] transform items-center justify-center gap-2 rounded-md border border-[#0F920F] bg-[#F2FDF2] text-[#0F920F] shadow-[#05420514]">
          <Image src="/check-circle.svg" width={16} height={16} alt="dekalo" />
          <span className="clash-font text-sm  text-[#0F920F]">Successfully deleted</span>
        </div>
      )}
    </>
  )
}
