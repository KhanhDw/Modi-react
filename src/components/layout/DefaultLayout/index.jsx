import React, { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import Footer from "../partials/footer";
import AnimatedHeader from "../partials/animateHeader";

function DefaultLayout({ children }) {

    const location = useLocation()

    const [activeSidebarHeader, setActiveSidebarHeader] = useState(false);

    useEffect(() => {
        if (activeSidebarHeader) {
            document.body.style.overflow = 'hidden'; // Khóa scroll
        } else {
            document.body.style.overflow = ''; // Cho scroll lại
        }

        // Cleanup nếu component bị unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [activeSidebarHeader]);

    return <>
        <div className={`
            min-h-screen
            overflow-auto
            ${activeSidebarHeader ? 'overflow-hidden' : ''}
            w-full
            flex flex-col items-start justify-center
            md:px-4 
            mx-auto
        `}>
            <div className={`flex w-full  ${location.pathname === '/' ? 'z-50' : ''} transition-all duration-200`}>
                <AnimatedHeader ActiveSideBarHeader={setActiveSidebarHeader} />
            </div>
            <main className={`
                ${location.pathname === '/' ? 'z-1 ' : 'pt-20'}  w-full h-full  
            `}>
                {React.Children.map(children, child => {
                    return React.cloneElement(child, { activeSidebarHeader: activeSidebarHeader });
                })}
            </main>
            <div className="w-full"><Footer></Footer></div>
        </div>
    </>;
}

export default DefaultLayout;