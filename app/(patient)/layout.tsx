import NursesSideBar from "components/Sidebar/NursesSidebar"
import PatientSidebar from "components/Sidebar/PatientSidebar"
import PharmacySideBar from "components/Sidebar/PharmacySidebar"
import SideBar from "components/Sidebar/Sidebar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Patient Dashboard | CityMed Hospital",
  description: "We are a family with a major focus in both primary and secondary healthcare service.",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    url: "https://citymed.com/",
    images: [
      {
        width: 1200,
        height: 630,
        url: "https://raw.githubusercontent.com/Dekatron322/Caregiverhospital/main/public/img.png",
      },
    ],
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col-reverse border-0 border-blue-700 lg:flex-row">
      <div className="">
        <PatientSidebar />
      </div>
      <div className="grow overflow-y-auto border-0 border-black ">{children}</div>
    </div>
  )
}
