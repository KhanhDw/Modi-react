import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoreHorizontal, FiMail } from 'react-icons/fi';

// Dữ liệu khách hàng
const customers = [
    {
        id: 1,
        name: 'Roselle Ehrman',
        country: 'Brazil',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
        id: 2,
        name: 'Jone Smith',
        country: 'Australia',
        avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
    },
    {
        id: 3,
        name: 'Darron Handler',
        country: 'Pakistan',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
    },
    {
        id: 4,
        name: 'Leatrice Kulik',
        country: 'Mascow',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
];

// Dữ liệu dropdown menu
const menuItems = ['Last Week', 'Last Month', 'Last Year'];

export default function NewCustomersDropdown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="m-2 p-6 bg-white rounded-xl max-w-sm mx-auto shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-gray-800 font-semibold text-lg">New Customers</h2>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        aria-label="Toggle menu"
                    >
                        <FiMoreHorizontal size={20} />
                    </button>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50"
                            >
                                <ul className="py-2 text-sm text-gray-700">
                                    {menuItems.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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

            <ul>
                {customers.map((customer) => (
                    <li key={customer.id} className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                            <img
                                src={customer.avatar}
                                alt={customer.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <div className="font-medium text-gray-800">{customer.name}</div>
                                <div className="text-xs text-gray-400">{customer.country}</div>
                            </div>
                        </div>

                        <FiMail
                            className="text-orange-500 cursor-pointer"
                            size={18}
                            title="Send message"
                        />
                    </li>
                ))}
            </ul>

        </div>
    );
}
