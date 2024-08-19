"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"

import WbSunnyIcon from "@mui/icons-material/WbSunny"
import { GoMoon } from "react-icons/go"

const Footer = () => {
  const [isMoonIcon, setIsMoonIcon] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const toggleIcon = () => {
    setIsMoonIcon(!isMoonIcon)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <div className="mt-auto flex items-center justify-between border-t max-md:hidden">
      <div className="flex gap-6 px-16 py-4">
        <Link href="/" className="text-xs font-bold">
          Privacy Policy
        </Link>
        <Link href="/" className="text-xs font-bold">
          Help Center
        </Link>
        <Link href="/" className="text-xs font-bold">
          License
        </Link>

        <p className="text-xs text-[#50c9f4]">CityMed © 2024 All rights reserved</p>
      </div>
      <div className="flex items-center gap-6 px-16 py-4">
        <div
          className="containerbg flex cursor-pointer items-center  rounded-full p-1 transition duration-300"
          onClick={toggleIcon}
          style={{
            position: "relative",
            width: "80px",
            height: "45px",
            borderRadius: "25px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: isMoonIcon ? "2px" : "calc(100% - 42px)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: isMoonIcon ? "#fff" : "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "left 0.5s ease",
            }}
          >
            {isMoonIcon ? (
              <WbSunnyIcon onClick={() => setTheme("light")} style={{ color: "#000", fontSize: "24px" }} />
            ) : (
              <GoMoon onClick={() => setTheme("dark")} style={{ color: "#fff", fontSize: "24px" }} />
            )}
          </div>
        </div>

        {/* <div className="cursor-pointer rounded border p-1 transition duration-300" onClick={toggleIcon}>
          {isMoonIcon ? (
            <IoMoonOutline onClick={() => setTheme("light")} />
          ) : (
            <FiSun onClick={() => setTheme("dark")} />
          )}
        </div> */}
      </div>
    </div>
  )
}

export default Footer
function setMounted(arg0: boolean) {
  throw new Error("Function not implemented.")
}
