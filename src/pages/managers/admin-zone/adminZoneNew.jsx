import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = ['Quản trị viên', 'Nhân viên', 'Quản lý'];
const STATUSES = ['Hoạt động', 'Đang chờ', 'Đã khóa'];

function AdminZoneNew() {
    const navigate = useNavigate();
    const [fadeIn, setFadeIn] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        role: ROLES[0],
        status: STATUSES[0],
    });

    useEffect(() => {
        const timeout = setTimeout(() => setFadeIn(true), 100);
        return () => clearTimeout(timeout);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Thêm mới:', formData);
        navigate('/managers/admin-zone');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 admin-dark:bg-gray-900 px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className={`bg-white admin-dark:bg-gray-800 shadow-2xl rounded-xl max-w-lg w-full p-8 space-y-8 
                transform transition-all duration-500 ease-out
                ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                {/* Nút Quay lại */}
                <div className="text-left">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-blue-700 
                        admin-dark:text-white admin-dark:hover:text-blue-400 transition cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Quay lại
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 admin-dark:text-gray-100">
                    Thêm mới tài khoản
                </h2>

                {/* Nhóm input */}
                <div className="space-y-5">
                    {/* Tên nhân viên */}
                    <InputField
                        label="Tên nhân viên"
                        name="name"
                        type="text"
                        placeholder="Nhập tên nhân viên"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    {/* Email */}
                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Nhập email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    {/* Tên đăng nhập */}
                    <InputField
                        label="Tên đăng nhập"
                        name="username"
                        type="text"
                        placeholder="Nhập tên đăng nhập"
                        value={formData.username}
                        onChange={handleChange}
                    />

                    {/* Vai trò */}
                    <SelectField
                        label="Vai trò"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={ROLES}
                    />

                    {/* Trạng thái */}
                    <SelectField
                        label="Trạng thái"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={STATUSES}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg 
                    transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Thêm mới
                </button>
            </form>
        </div>
    );
}

function InputField({ label, name, type, value, onChange, placeholder }) {
    return (
        <label className="block">
            <span className="text-gray-700 admin-dark:text-gray-300 font-semibold mb-1 block">
                {label}
            </span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 admin-dark:border-gray-700
                bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100
                px-4 py-3 text-base placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition"
            />
        </label>
    );
}

function SelectField({ label, name, value, onChange, options }) {
    return (
        <label className="block">
            <span className="text-gray-700 admin-dark:text-gray-300 font-semibold mb-1 block">
                {label}
            </span>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 admin-dark:border-gray-700
                bg-white admin-dark:bg-gray-700 text-gray-900 admin-dark:text-gray-100
                px-4 py-3 text-base
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition"
            >
                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default AdminZoneNew;
