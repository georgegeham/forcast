"use client"
import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
          <Link href="/home">
            <Image src="/logo-with-no-background.png" alt="Logo" fill />
          </Link>
  )
}

export default Logo