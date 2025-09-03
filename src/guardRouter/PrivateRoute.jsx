import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const scheduleLogout = (exp) => {
    const now = Date.now() / 1000;
    const timeout = (exp - now) * 1000;
    if (timeout > 0) {
        setTimeout(() => {
            localStorage.removeItem("accessToken");
            window.location.href = "/login"; // hoặc dùng navigate("/login")
        }, timeout);
    }
};

const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        const now = Date.now() / 1000;

        if (exp < now) {
            localStorage.removeItem("accessToken");
            return false;
        }

        // nếu token còn hạn → lên lịch auto logout
        scheduleLogout(exp);

        return true;
    } catch (e) {
        localStorage.removeItem("accessToken");
        return false;
    }
};

const PrivateRoute = ({ children }) => {
    const location = useLocation();

    return isAuthenticated() ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default PrivateRoute;
