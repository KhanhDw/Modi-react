import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMoreHorizontal, FiMail } from "react-icons/fi";

const customers = [
    { id: 1, name: "Roselle Ehrman", country: "Brazil", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "Jone Smith", country: "Australia", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
    { id: 3, name: "Darron Handler", country: "Pakistan", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
    { id: 4, name: "Leatrice Kulik", country: "Moscow", avatar: "https://randomuser.me/api/portraits/men/75.jpg" }
];

const menuItems = ["Last Week", "Last Month", "Last Year"];

export default function NewCustomersDropdown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="m-2 p-6 bg-white admin-dark:bg-gray-800 rounded-xl max-w-sm mx-auto shadow-md admin-dark:shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-800 admin-dark:text-gray-100 font-semibold text-lg">
                    New Customers
                </h2>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        className={`p-2 rounded-full transition ${open
                                ? "bg-gray-100 admin-dark:bg-gray-700"
                                : "hover:bg-gray-100 admin-dark:hover:bg-gray-700"
                            }`}
                    >
                        <FiMoreHorizontal size={20} className="text-gray-600 admin-dark:text-gray-300" />
                    </button>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-44 bg-white admin-dark:bg-gray-700 rounded-lg shadow-xl border border-gray-100 admin-dark:border-gray-600 z-50"
                            >
                                <ul className="py-2 text-sm text-gray-700 admin-dark:text-gray-200">
                                    {menuItems.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="px-4 py-2 hover:bg-gray-100 admin-dark:hover:bg-gray-600 cursor-pointer"
                                            onClick={() => {
                                                console.log(`Selected: ${item}`);
                                                setOpen(false);
                                            }}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Customers list */}
            <ul>
                {customers.map((customer) => (
                    <motion.li
                        key={customer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between mb-5 p-2 rounded-lg hover:bg-gray-50 admin-dark:hover:bg-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={customer.avatar}
                                alt={customer.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <div className="font-medium text-gray-800 admin-dark:text-gray-100">
                                    {customer.name}
                                </div>
                                <div className="text-xs text-gray-400 admin-dark:text-gray-400">
                                    {customer.country}
                                </div>
                            </div>
                        </div>
                        <FiMail
                            className="text-orange-500 cursor-pointer hover:scale-110 transition"
                            size={18}
                            title="Send message"
                        />
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}
