import React from "react"
import { useLocation } from 'react-router-dom'
import Footer from "../partials/footer";
// import Header from "../partials/header";
import AnimatedHeader from "../partials/animateHeader";

function DefaultLayout({ children }) {

    const location = useLocation()

    return <>
        <div className="flex flex-col items-start justify-center">
            <div className={`flex w-full  ${location.pathname === '/' ? 'z-50' : ''}`}>
                {/* <Header></Header> */}
                 <AnimatedHeader />
            </div>
            <main className={`${location.pathname === '/' ? 'z-1' : ''}`}>{children}</main>
            <div className="w-full"><Footer></Footer></div>
        </div>
    </>;
}

export default DefaultLayout;