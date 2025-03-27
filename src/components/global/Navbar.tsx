"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/logo.png";
import HamburgerButton from "./Hamburger";
import { useState } from "react";

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <header
      className={`bg-white fixed top-0 left-0 w-full h-20 duration-200 ease-[cubic-bezier(0,0,0,1)] lg:border-b border-zinc-100 text-zinc-600 z-20 ${
        !toggleMenu
          ? "overflow-hidden"
          : "bg-white md:h-20 h-full overflow-visible"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between lg:px-8 px-6 py-6">
        <Link
          href="/"
          className="font-geistmono font-bold text-lg flex items-center gap-x-2 order-2"
        >
          <Image src={Logo} alt="Isima logo" width={90} />
          SmartQuizMaker
        </Link>

        <div className="order-3">
          <HamburgerButton toggleMenu={toggleMenu} onToggle={setToggleMenu} />
        </div>
      </div>
    </header>
  );
}
