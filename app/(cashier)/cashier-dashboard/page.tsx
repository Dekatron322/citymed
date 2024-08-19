"use client"
import Footer from "components/Footer/Footer"

import { IoIosArrowForward } from "react-icons/io"
import { usePathname, useRouter } from "next/navigation"
import PharmacyNav from "components/Navbar/PharmacyNav"
import CashierIssueRequest from "components/Dashboard/CashierIssueRequest"

export default function Dashboard() {
  const pathname = usePathname()
  return (
    <>
      <section className="h-full ">
        <div className=" flex min-h-screen ">
          <div className="flex  w-screen flex-col ">
            <PharmacyNav />

            <div className="flex items-center gap-2 px-16 max-sm:px-3  md:py-6">
              <p className="font-bold">Cashier</p>
              <IoIosArrowForward />
              <p className="capitalize">{pathname.split("/").pop()}</p>
            </div>

            <div className="mb-16 flex gap-6 px-16 py-6 max-sm:px-3">
              <div className="w-full">
                <p className="mb-8 font-semibold">Issue Requests</p>
                <CashierIssueRequest />
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </section>
    </>
  )
}
