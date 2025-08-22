import React from "react";
import { Outlet } from "react-router-dom";

function ConfigPage() {
    return (<>
        {/* This is the main configuration page for managers */}
        <h1 className="text-2xl font-bold mb-4">Cấu hình trang web</h1>
        {/* The Outlet component will render the nested routes */}
        <Outlet />
        {/* You can add additional content or components here if needed */}
        <p>Quản lý cấu hình trang web của bạn từ đây.</p>
        {/* You can also add links to specific configuration sections */}
        <ul className="list-disc pl-5">
            <li><a href="/managers/page-config/header">Cấu hình Header</a></li>
            <li><a href="/managers/page-config/footer">Cấu hình Footer</a></li>
            <li><a href="/managers/page-config/home">Cấu hình Trang Chủ</a></li>
            <li><a href="/managers/page-config/about">Cấu hình Giới Thiệu</a></li>
        </ul>
    </>);
}

export default ConfigPage;