import React, { useState, useRef, useEffect } from "react";
import useAdminNavbar from "./useAdminNavbar";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";


const AdminNavbar = () => {
   
    const { navLinks, viewLink } = useAdminNavbar();

    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <div className="mb-30">
            <nav className={`fixed top-0 left-0 bg-indigo-500 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

                {/* Logo */}
                <NavLink
                    to="/admin/dashboard"
                    className="text-3xl font-extrabold tracking-wide"
                >
                    <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Preschool
                    </span>
                </NavLink>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-4 lg:gap-8">
                    {navLinks.map((link, i) => (
                        <NavLink key={i} to={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                            {link.name}
                            <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                        </NavLink>
                    ))}
                </div>
                

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-3 md:hidden">
                    <Menu onClick={() => setIsMenuOpen(!isMenuOpen)} className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" />
                </div>

                {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                        <X size={22} className="text-white font-semibold w-6 h-6 p-1 cursor-pointer bg-red-400 rounded-full" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" />
                    </button>

                    {navLinks.map((link, i) => (
                        <NavLink key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </NavLink>
                    ))}

                    <button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500" onClick={() => { setIsMenuOpen(false), navigate("/admin/login") }}>
                        Login
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default AdminNavbar;