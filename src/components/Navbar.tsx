"use client"

import Link from "next/link"
import { Palette, Moon, Sun, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [theme, setTheme] = useState<"light" | "dark">("light")

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
        if (savedTheme) {
            setTheme(savedTheme)
            document.documentElement.classList.toggle("dark", savedTheme === "dark")
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark")
            document.documentElement.classList.add("dark")
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.classList.toggle("dark", newTheme === "dark")
    }

    const navLinks = [
        { name: "Paletas", href: "#palettes" },
        { name: "Ferramentas", href: "#tools" },
        { name: "Acessibilidade", href: "#accessibility" },
        { name: "Teoria das Cores", href: "#color-theory" },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="layout-container py-4">
                <div className="glass rounded-2xl px-6 h-16 flex items-center justify-between border shadow-premium">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group">
                            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                                <Palette className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-extrabold text-xl tracking-tight hidden sm:block">ColorStrap</span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="w-px h-6 bg-border mx-2" />
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl hover:bg-primary/10 transition-all active:scale-95 group"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? (
                                <Moon className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
                            ) : (
                                <Sun className="h-5 w-5 group-hover:rotate-45 transition-transform" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl hover:bg-primary/10 transition-all active:scale-95"
                        >
                            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2.5 rounded-xl hover:bg-primary/10 transition-all active:scale-95"
                        >
                            {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="glass rounded-2xl p-4 mt-2 border shadow-lg space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 rounded-xl font-medium hover:bg-primary/10 hover:text-primary transition-all active:scale-98"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
