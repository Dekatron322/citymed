import React, { useEffect, useState } from "react"
import styles from "./modal.module.css"
import { LiaTimesSolid } from "react-icons/lia"
import AOS from "aos"
import "aos/dist/aos.css"
import axios from "axios"

interface ReviewModalProps {
  isOpen: boolean
  onSubmitSuccess: any
  onClose: () => void
  patientId: string
}

interface UserDetails {
  id: number
  username: string
  email: string
  phone_number: string
  address: string
  account_type: string
}

const CheckoutPatientModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitSuccess, patientId }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkAppId, setCheckAppId] = useState<string | null>(null)

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  useEffect(() => {
    fetchUserDetails()
    fetchCheckAppId()
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

  const fetchCheckAppId = async () => {
    try {
      const response = await axios.get(`https://api.caregiverhospital.com/patient/patient/${patientId}/`)
      const patient = response.data
      if (patient && patient.check_apps && patient.check_apps.length > 0) {
        setCheckAppId(patient.check_apps[0].id)
      } else {
        console.log("Check App ID not found.")
      }
    } catch (error) {
      console.error("Error fetching Check App ID:", error)
    }
  }

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (userDetails && checkAppId) {
      try {
        const response = await axios.put(
          `https://api.caregiverhospital.com/check-app/check-app/${checkAppId}/`,
          {
            checkout_date: new Date().toISOString(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        if (response.status === 200 || response.status === 201) {
          onSubmitSuccess()
          onClose()
        } else {
          throw new Error(`Failed to check out patient: ${response.statusText}`)
        }
      } catch (error) {
        console.error("Error checking out patient:", error)
        setError(`Error checking out patient`)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500">
      <div className={styles.modalContent}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h6 className="text-lg font-medium">Checkout Patient - Dr. {userDetails?.username || "Loading..."}</h6>
            <div className="hover:rounded-md hover:border">
              <LiaTimesSolid className="m-1 cursor-pointer" onClick={onClose} />
            </div>
          </div>
          <p>Are you sure you want to check out this patient?</p>
          <div className="mt-4 flex w-full gap-6">
            <button className="button-primary h-[50px] w-full rounded-sm max-sm:h-[45px]" onClick={submitForm}>
              CONFIRM CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPatientModal
