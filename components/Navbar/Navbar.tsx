"use client"
import Image from "next/image"
import Link from "next/link"
import React from "react"

import AuthProviders from "components/ProvidersComponents/AuthProviders"

const Navbar = () => {
  const session = null

  return (
    <nav className="navbar flex justify-center">
      <>
        <Link href="/" className="icon-style content-center">
          <Image src="/mainlogo.png" width={200} height={43} alt="dekalo" />
        </Link>
        <Link href="/" className="dark-icon-style content-center">
          <Image src="/lightlogo.png" width={200} height={43} alt="dekalo" />
        </Link>
      </>
    </nav>
  )
}

export default Navbar
