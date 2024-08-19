"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Appointments from "components/Dashboard/Dashboard"
import { PiDotsThree } from "react-icons/pi"

interface CheckApp {
  id: string
  ward: string
  reason: string
  checkout_date: string
  pub_date: string
}

interface Patient {
  id: string
  name: string
  gender: string
  dob: string
  appointments: {
    id: number
    doctor: string
    detail: string
    pub_date: string
  }[]
  check_apps: CheckApp[]
}

interface Department {
  name: string
}

interface Staff {
  username: string
}

interface PatientCheckApp {
  patientName: string
  checkApp: CheckApp
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientsWithAppointments, setPatientsWithAppointments] = useState<Patient[]>([])
  const [departmentCount, setDepartmentCount] = useState(0)
  const [staffCount, setStaffCount] = useState(0)
  const [recentCheckApps, setRecentCheckApps] = useState<PatientCheckApp[]>([])

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("https://api.caregiverhospital.com/patient/patient/")
        if (!response.ok) {
          throw new Error("Failed to fetch patients")
        }
        const data = (await response.json()) as Patient[]
        setPatients(data)

        // Filter patients with appointments
        const patientsWithApps = data.filter((patient) => patient.appointments.length > 0)
        setPatientsWithAppointments(patientsWithApps)

        // Extract and sort check_apps by pub_date, then get the top 5
        const allCheckApps = data.flatMap((patient) =>
          patient.check_apps.map((checkApp) => ({
            patientName: patient.name,
            checkApp,
          }))
        )
        const sortedCheckApps = allCheckApps.sort(
          (a, b) => new Date(b.checkApp.pub_date).getTime() - new Date(a.checkApp.pub_date).getTime()
        )
        setRecentCheckApps(sortedCheckApps.slice(0, 5))
      } catch (error) {
        console.error("Error fetching patients:", error)
      }
    }

    fetchPatients()
  }, [])

  useEffect(() => {
    async function fetchDepartmentCount() {
      try {
        const response = await fetch("https://api.caregiverhospital.com/department/department/")
        if (!response.ok) {
          throw new Error("Failed to fetch department count")
        }
        const data = (await response.json()) as Department[]
        setDepartmentCount(data.length)
      } catch (error) {
        console.error("Error fetching department count:", error)
      }
    }

    fetchDepartmentCount()
  }, [])

  useEffect(() => {
    async function fetchStaffCount() {
      try {
        const response = await fetch("https://api.caregiverhospital.com/app_user/all/")
        if (!response.ok) {
          throw new Error("Failed to fetch staff count")
        }
        const data = (await response.json()) as Staff[]
        setStaffCount(data.length)
      } catch (error) {
        console.error("Error fetching staff count:", error)
      }
    }

    fetchStaffCount()
  }, [])

  return (
    <>
      <section className="h-full">
        <div className="flex min-h-screen">
          <div className="flex w-screen flex-col">
            <DashboardNav />

            <div className="px-16 py-4 max-md:px-3 md:mt-10">
              <h4 className="font-semibold">Statistics</h4>
            </div>
            <div
              data-aos="fade-in"
              data-aos-duration="1000"
              data-aos-delay="500"
              className="flex gap-2 px-16 max-md:grid max-md:grid-cols-2 max-md:px-3"
            >
              <div className="w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Appointments</h6>
                  <Image src="/calendar.svg" height={30} width={30} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">{patientsWithAppointments.length}</h6>
                  <Link href="/appointments" className="rounded-full bg-[#50c9f4] px-2 py-1 text-xs text-[#000000]">
                    View
                  </Link>
                </div>
              </div>
              {/*  */}
              <div className="w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Departments</h6>
                  <Image src="/department.svg" height={30} width={30} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">{departmentCount}</h6>
                  <Link href="/department" className="rounded-full bg-[#50c9f4] px-2 py-1 text-xs text-[#000000]">
                    View
                  </Link>
                </div>
              </div>
              {/*  */}

              <div className="w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Staff</h6>
                  <Image src="/staff.svg" height={30} width={30} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">{staffCount}</h6>
                  <Link href="/staff" className="rounded-full bg-[#50c9f4] px-2 py-1 text-xs text-[#000000]">
                    View
                  </Link>
                </div>
              </div>
              {/*  */}
              <div className="w-full rounded border-[0.5px] p-4 shadow">
                <div className="mb-8 flex justify-between">
                  <h6 className="font-bold">Patients</h6>
                  <Image src="/outpatient.svg" height={30} width={30} alt="pharmacy" />
                </div>
                <div className="flex justify-between">
                  <h6 className="font-bold">{patients.length}</h6>
                  <Link href="/patients" className="rounded-full bg-[#50c9f4] px-2 py-1 text-xs text-[#000000]">
                    View
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex gap-6 max-md:flex-col max-md:px-4 max-md:pt-6 md:mb-16 md:px-16 md:pt-16">
              <div className="md:w-[75%]">
                <p className="mb-8 font-semibold max-md:mb-4">Appointments</p>
                <Appointments />
              </div>
              <div
                data-aos="fade-in"
                data-aos-duration="1000"
                data-aos-delay="500"
                className=" w-full rounded-xl border-[0.5px] px-4 py-4 shadow md:w-[25%]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold">Admissions</h3>
                  <button className="redirect">
                    <Link href="/appointments" className="">
                      View all
                    </Link>
                  </button>
                </div>
                {recentCheckApps.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="mb-4 flex items-center gap-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#50c9f4] max-md:hidden">
                        <p className="capitalize text-[#000000]">{item.patientName.charAt(0)}</p>
                      </div>
                      {/* <Image src="/path/to/default/image" height={40} width={40} alt="" /> */}
                      <div>
                        <div className=" ">
                          <p className="text-sm font-semibold">{item.patientName}</p>
                          <p className="text-xs font-semibold">{item.checkApp.reason}</p>
                          <p className="text-xs">{item.checkApp.ward}</p>
                          {/* <p className="text-sm">{new Date(item.checkApp.checkout_date).toLocaleDateString()}</p> */}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{new Date(item.checkApp.checkout_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}
