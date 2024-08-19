"use client"
import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import Image from "next/image"
import Link from "next/link"
import { IoMdArrowBack } from "react-icons/io"
import { MdLocationPin } from "react-icons/md"

import PatientDetailsForDoctor from "components/Patient/PatientDetailsForDoctor"
import LabTestModal from "components/Modals/LabTestModal"
import PrescriptionModal from "components/Modals/PrescriptionModal"
import DoctorNav from "components/Navbar/DoctorNav"
import NoteModal from "components/Modals/NoteModal"

interface Patient {
  id: string
  name: string
  heart_rate?: string
  body_temperature?: string
  glucose_level?: string
  blood_pressure?: string
  address: string
  phone_no: string
  dob: string
  blood_group?: string
  hmo: {
    id: string
    name: string
    category: string
    description: string
    status: boolean
    pub_date: string
  }
  policy_id?: string
  allergies?: string
  nok_name: string
  nok_phone_no: string
  appointments: { id: number; doctor: string; pub_date: string; detail: string }[]
  prescriptions: {
    id: string
    category: string
    name: string
    complain: string
    code: string
    unit: string
    dosage: string
    rate: string
    usage: string
    note: string
    status: boolean
    pub_date: string

    doctor_name: string
    discount_value: string
  }[]
  medicals: {
    id: string
    name: string
    doctor_image: string
    test: string
    result: string
    pub_date: string
    discount_value: string
  }[]
  lab_tests: {
    id: string
    doctor_name: string
    doctor_request_title: string
    doctor_request_description: string
    test_type: string
    result: string
    pub_date: string
    status_note: string
    discount_value: string
  }[]
  notes: [
    {
      id: string
      title: string
      detail: string
      status: string
      pub_date: any
    },
  ]
}

interface AddPrescription {
  id: string
  name: string
}

interface RequestTest {
  id: string
  name: string
}

interface Note {
  id: string
  detail: string
  title: string
}

export default function PatientDetailPage() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<Patient | null>(null)
  const patientId = pathname.split("/").pop()
  const [clickedCard, setClickedCard] = useState<AddPrescription | null>(null)
  const [clickedRequestCard, setClickedRequestCard] = useState<RequestTest | null>(null)
  const [clickedNoteCard, setClickedNoteCard] = useState<Note | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState<boolean>(false)

  const fetchPatientDetails = async () => {
    try {
      const patientId = localStorage.getItem("selectedPatientId")
      if (!patientId) {
        console.error("No appointment ID found in localStorage.")
        return
      }

      const response = await fetch(`https://api.caregiverhospital.com/patient/patient/${patientId}/`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient details")
      }
      const data = (await response.json()) as Patient
      setPatient(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching patient details:", error)
      setLoading(false)
    }
  }
  const handleGoBack = () => {
    router.back()
  }

  useEffect(() => {
    fetchPatientDetails()
  }, [])

  const handleCardClick = (results: AddPrescription) => {
    setClickedCard(results)
    setIsModalOpen(true)
  }

  const handleTestClick = (results: RequestTest) => {
    setClickedRequestCard(results)
    setIsRequestModalOpen(true)
  }

  const handleNoteClick = (patient: Patient) => {
    const note: Note = {
      id: patient.id,
      detail: "",
      title: "note",
    }
    setClickedNoteCard(note)
    setIsNoteModalOpen(true)
  }

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
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DoctorNav />

            {patient && (
              <div className="px-16 max-md:px-3 sm:py-10">
                <button onClick={handleGoBack} className="redirect">
                  <IoMdArrowBack />
                  <p className="capitalize">Go back</p>
                </button>
                <div className="pt-10">
                  <div className="mb-3 grid w-full grid-cols-4 gap-2 max-sm:grid-cols-2">
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-01.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Heart Rate</h3>
                      <p>{patient.heart_rate || "N/A"}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-02.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Body Temperature</h3>
                      <p>
                        {patient.body_temperature || "N/A"} <small>°C</small>
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-03.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Glucose Level</h3>
                      <p>{patient.glucose_level || "N/A"}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded border py-3 ">
                      <Image src="/pt-dashboard-04.svg" height={40} width={40} alt="" />
                      <h3 className="py-2 font-bold">Blood Pressure</h3>
                      <p>{patient.blood_pressure || "N/A"} mg/dl</p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 max-md:flex-col">
                    <div className="md:w-1/4">
                      <div className="flex flex-col justify-center rounded-md border px-4 py-8">
                        <div className="flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#50c9f4]">
                            <p className="capitalize text-[#000000]">{patient.name.charAt(0)}</p>
                          </div>
                          {/* <Image src="/default_patient_image.png" height={60} width={60} alt="Patient Image" /> */}
                        </div>
                        <h1 className="mt-3 text-center font-bold capitalize xl:text-sm">{patient.name}</h1>
                        <p className="text-center text-base font-bold xl:text-sm">
                          Patient ID: <span className="font-normal xl:text-sm">{patient.policy_id}</span>
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <MdLocationPin />
                          <p className="text-sm">{patient.address}</p>
                        </div>
                        <div className="my-4 flex w-full border"></div>
                        <div className="">
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Phone</p>
                            <p className="xl:text-sm">{patient.phone_no}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">DOB</p>
                            <p className="xl:text-sm">{formatDate(patient.dob)}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">Blood Group</p>
                            <p className="xl:text-sm">{patient.blood_group || "N/A"}</p>
                          </div>
                          <div className="flex justify-between pb-2">
                            <p className="xl:text-sm">HMO Name</p>
                            <p className="xl:text-sm">{patient.hmo.name || "N/A"}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="xl:text-sm">Policy ID</p>
                            <p className="xl:text-sm">{patient.policy_id || "N/A"}</p>
                          </div>
                        </div>
                        <div className="mt-6 flex w-full flex-col gap-2 ">
                          <button
                            onClick={() => handleCardClick(patient)}
                            className="button-primary h-[40px] w-full whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                          >
                            Add Prescription
                          </button>
                          <button
                            onClick={() => handleTestClick(patient)}
                            className="button-primary h-[40px] w-full whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                          >
                            Request Lab Test
                          </button>
                          <button
                            onClick={() => handleNoteClick(patient)}
                            className="button-primary h-[40px] w-full whitespace-nowrap rounded-md max-sm:h-[40px] xl:text-sm"
                          >
                            Add Note
                          </button>
                        </div>
                      </div>

                      <div className="py-2">
                        <h3 className="mb-1 font-bold">Allergies</h3>
                        <div className="flex flex-wrap">
                          {patient.allergies
                            ? patient.allergies.split(",").map((allergy, index) => (
                                <div key={index} className="w-1/2">
                                  <p className="m-1 rounded bg-[#F2B8B5] p-1 text-center text-sm font-medium capitalize text-[#601410]">
                                    {allergy.trim()}
                                  </p>
                                </div>
                              ))
                            : "No allergies"}
                        </div>
                      </div>

                      <div className="py-2">
                        <div className="nok_area">
                          <h4 className="mb-2 font-medium">Next of Kin</h4>
                          <div className="flex justify-between">
                            <p>{patient.nok_name}</p>
                            <Link href={`tel:${patient.nok_phone_no}`}>
                              <Image src="/phone.svg" height={18} width={18} alt="Call" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-3/4">
                      <PatientDetailsForDoctor patient={patient} />

                      {/* Notes Section */}
                      <div className="notes-section mb-4 mt-10 rounded border p-4">
                        <h3 className="mb-4 text-xl font-bold">Patient Notes</h3>
                        {patient.notes.length > 0 ? (
                          patient.notes.map((note) => (
                            <div key={note.id} className="">
                              <p>{note.detail}</p>
                              <p className="mb-2 text-sm text-gray-600">{formatDate(note.pub_date)}</p>
                              <div className="my-5 h-[1px] w-full bg-slate-700"></div>
                            </div>
                          ))
                        ) : (
                          <p>No notes available for this patient.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Footer />
          </div>
        </div>
      </section>
      {isModalOpen && clickedCard && (
        <PrescriptionModal results={clickedCard} onClose={() => setIsModalOpen(false)} userId={""} />
      )}
      {isRequestModalOpen && clickedRequestCard && (
        <LabTestModal results={clickedRequestCard} onClose={() => setIsRequestModalOpen(false)} userId={""} />
      )}

      {isNoteModalOpen && clickedNoteCard && (
        <NoteModal results={clickedNoteCard} onClose={() => setIsNoteModalOpen(false)} userId={""} />
      )}
    </>
  )
}
