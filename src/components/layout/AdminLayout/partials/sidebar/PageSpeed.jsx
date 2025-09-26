import { useEffect, useState } from "react";

function PageSpeed() {
    const [value, setValue] = useState(null);

    useEffect(() => {
        const measureSpeed = async () => {
            const start = performance.now();

            try {
                const res = await fetch(`${import.meta.env.VITE_MAIN_BE_URL}/api/ping/speed`);
                const backendTime = parseInt(res.headers.get("X-Response-Time") || "0", 10);
                await res.json();

                const frontendTime = Math.round(performance.now() - start);

                // tổng thời gian (ms) → giây
                const totalSeconds = (frontendTime + backendTime) / 1000;
                setValue(totalSeconds.toFixed(2)); // làm tròn 2 chữ số thập phân
            } catch (err) {
                setValue("Lỗi đo tốc độ");
            }
        };

        measureSpeed();
    }, []);

    return (
        <div className="p-0 m-0 text-center font-semibold">
            {value !== null ? `${value} s` : "..."}
        </div>
    );
}

export default PageSpeed;
