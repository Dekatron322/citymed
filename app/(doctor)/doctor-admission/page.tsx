"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import Footer from "components/Footer/Footer"
import AllAdmission from "components/Dashboard/AllAdmission"
import { useRouter } from "next/navigation"
import { IoMdArrowBack } from "react-icons/io"
import AOS from "aos"
import "aos/dist/aos.css"
import { useEffect } from "react"
import DoctorAdmission from "components/Dashboard/DoctorAdmission"
import DoctorNav from "components/Navbar/DoctorNav"

export default function Admission() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <DoctorNav />
            <div
              className="flex justify-between px-16 py-6 max-md:px-3"
              data-aos="fade-in"
              data-aos-duration="1000"
              data-aos-delay="500"
            >
              <button onClick={handleGoBack} className="redirect">
                <IoMdArrowBack />
                <p className="capitalize">Go back</p>
              </button>
            </div>

            <div className="flex gap-6 px-16 max-md:px-3 md:py-6">
              <div className="w-full">
                <div className="flex justify-between"></div>
                <p
                  className="mb-8 font-semibold max-md:mb-2"
                  data-aos="fade-in"
                  data-aos-duration="1000"
                  data-aos-delay="500"
                >
                  Admissions
                </p>

                <DoctorAdmission />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}
