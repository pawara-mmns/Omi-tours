"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
const nav = [
  ["Experiences", "/experiences"],
  ["Our journey", "/journey"],
  ["Gallery", "/#gallery"],
  ["Packages", "/#packages"],
  ["Guest journal", "/blog"],
  ["About OMI", "/about"],
];
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="OMI Tours home">
      <img width="43" height="43" src="/images/omi-mark.png" alt="" />
      <span>OMI TOURS</span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menu.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="mast">
      <div className="wrap navrow">
        <div className="brand-cluster" onClick={() => setOpen(false)}>
          <Brand />
          <p className="mast-motto">Come as a Tourist, Go as a Friend.</p>
        </div>
        <nav
          aria-label="Main"
          id="site-nav"
          className={open ? "navlinks open" : "navlinks"}
        >
          {nav.map(([label, url]) => (
            <Link
              key={url}
              href={url}
              aria-current={pathname === url ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/plan"
            className="btn dark navcta"
            onClick={() => setOpen(false)}
          >
            Plan my trip <ArrowUpRight size={16} />
          </Link>
          <button
            ref={menu}
            className="menubtn iconbtn"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="site-nav"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="wrap footerinner">
        <div>
          <Brand />
          <p>Come as a Tourist, Go as a Friend.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/experiences">Experiences</Link>
          <Link href="/journey">Sample journey</Link>
          <Link href="/#gallery">Gallery</Link>
          <Link href="/#packages">Packages</Link>
          <Link href="/blog">Guest journal</Link>
          <Link href="/about">About OMI</Link>
          <Link href="/plan">Request a quote</Link>
        </nav>
      </div>
    </footer>
  );
}
