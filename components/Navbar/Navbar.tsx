"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { useTheme } from "next-themes"
import WbSunnyIcon from "@mui/icons-material/WbSunny"
import { GoMoon } from "react-icons/go"

import AuthProviders from "components/ProvidersComponents/AuthProviders"

const Navbar = () => {
  const session = null
  const [isMoonIcon, setIsMoonIcon] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const toggleIcon = () => {
    setIsMoonIcon(!isMoonIcon)
  }

  return (
    <nav className="navbar flexBetween flex ">
      <>
        <Link href="/" className="icon-style content-center">
          <Image src="/mainlogo.png" width={200} height={43} alt="dekalo" />
        </Link>
        <Link href="/" className="dark-icon-style content-center">
          <Image src="/lightlogo.png" width={200} height={43} alt="dekalo" />
        </Link>
      </>
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
    </nav>
  )
}

export default Navbar
