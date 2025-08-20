import React from "react";
import { Outlet } from "react-router-dom";

export default function AdminZonePage() {
    return (
        <div>
            <Outlet />
        </div>
    );
}