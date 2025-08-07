import { Link, useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

function AdminLoginPage() {
    const navigate = useNavigate();

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [form, setForm] = useState({ username: "", password: "" });

    const handleShowPassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error('Đăng nhập thất bại');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken)

            navigate("/managers");
        }
        catch (e) {
            console.log("Đã xảy ra lỗi: " + e.message);
        }
    }


    return (
        <>
            <div className="bg-black text-white flex min-h-screen flex-col items-center pt-16 sm:justify-center sm:pt-0">
                <div className="text-foreground font-semibold text-2xl tracking-tighter mx-auto flex items-center gap-2">
                    <Link to={'/'} className='flex items-center justify-center xs:h-10 2xl:h-20 px-3 py-2 overflow-hidden rounded-2xl w-fit'>
                        <img src="./logoModi.png" className='xs:h-5 sm:h-6 md:h-7 lg:h-7 xl:h-8 2xl:h-8 3xl:h-12 w-fit' alt='logo' />
                    </Link>
                </div>
                <div className="relative mt-12 w-full max-w-lg sm:mt-10">
                    <div className="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"
                        bis_skin_checked="1"></div>
                    <div
                        className="mx-5 border dark:border-b-white/50 dark:border-t-white/50 border-b-white/20 sm:border-t-white/20 shadow-[20px_0_20px_20px] shadow-slate-500/10 dark:shadow-white/20 rounded-lg border-white/20 border-l-white/20 border-r-white/20 sm:shadow-sm lg:rounded-xl lg:shadow-none">
                        <div className="flex flex-col p-6">
                            <h3 className="text-xl font-semibold leading-6 tracking-tighter">Login</h3>
                            <p hidden className="mt-1.5 text-sm font-medium text-white/50">Welcome back, enter your credentials to continue.
                            </p>
                        </div>
                        <div className="p-6 pt-0">
                            <form onSubmit={handleLogin}>
                                <div>
                                    <div>
                                        <div
                                            className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                            <div className="flex justify-between">
                                                <label
                                                    className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">Tài khoản</label>
                                                <div className="absolute right-3 translate-y-2 text-green-200">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        fill="currentColor" className="w-6 h-6">
                                                        <path fillRule="evenodd"
                                                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                            clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <input type="text" name="username" placeholder="Nhập tài khoản (admin)"
                                                autoComplete="off" value={form.username} onChange={handleChange}
                                                className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-medium placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 sm:leading-7 text-foreground" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div>
                                        <div
                                            className="group relative rounded-lg border focus-within:border-sky-200 px-3 pb-1.5 pt-2.5 duration-200 focus-within:ring focus-within:ring-sky-300/30">
                                            <div className="flex justify-between">
                                                <label
                                                    className="text-xs font-medium text-muted-foreground group-focus-within:text-white text-gray-400">Mật khẩu</label>
                                            </div>
                                            <div className="flex items-center">
                                                <input type={isShowPassword ? "text" : "password"} name="password" placeholder="Nhập mật khẩu (1234)"
                                                    autoComplete="off" value={form.password} onChange={handleChange}
                                                    className="block w-full border-0 bg-transparent p-0 text-sm file:my-1 placeholder:text-muted-foreground/90 focus:outline-none focus:ring-0 focus:ring-teal-500 sm:leading-7 text-foreground" />
                                                <button onClick={handleShowPassword} type="button" className="p-2 hover:bg-gray-700 transition-all duration-300 rounded-3xl cursor-pointer">
                                                    {isShowPassword ? <FaEyeSlash /> : <IoEyeSharp />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div hidden className="mt-4 flex items-center justify-between">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" name="remember"
                                            className="outline-none focus:outline focus:outline-sky-300" />
                                        <span className="text-xs">Remember me</span>
                                    </label>
                                    <a className="text-sm font-medium text-foreground underline" href="/forgot-password">Forgot
                                        password?</a>
                                </div>
                                <div className="mt-4 flex items-center justify-end gap-x-2">
                                    <a className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:ring hover:ring-white h-10 px-4 py-2 duration-200"
                                        href="/register">Go Home</a>
                                    <button
                                        className="font-semibold hover:bg-black hover:text-white hover:ring hover:ring-white transition duration-300 inline-flex items-center justify-center rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-black h-10 px-4 py-2"
                                        type="submit">Đăng nhập</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminLoginPage;