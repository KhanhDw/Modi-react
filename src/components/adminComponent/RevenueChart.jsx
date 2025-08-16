import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const RevenueChart = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // check class "admin-dark" hoặc "dark" trên html
        const root = document.documentElement;
        const observer = new MutationObserver(() => {
            setIsDark(root.classList.contains("admin-dark") || root.classList.contains("dark"));
        });
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        // init lần đầu
        setIsDark(root.classList.contains("admin-dark") || root.classList.contains("dark"));
        return () => observer.disconnect();
    }, []);

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#999',
                    width: 1,
                    type: 'dashed',
                },
            },
            backgroundColor: '#1f2937', // slate-800
            borderRadius: 6,
            textStyle: {
                color: '#fff',
                fontSize: 12,
            },
        },
        legend: {
            data: ['Google ads', 'Facebook ads'],
            top: 16,
            right: 16,
            textStyle: {
                color: isDark ? '#f3f4f6' : '#374151', // dark -> gray-100, light -> gray-700
            },
            icon: 'circle',
        },
        grid: {
            left: 60,
            right: 30,
            top: 50,
            bottom: 60,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            axisLine: {
                lineStyle: {
                    color: isDark ? '#4b5563' : '#d1d5db', // dark -> gray-600, light -> gray-300
                    type: 'dashed',
                },
            },
            axisLabel: {
                color: isDark ? '#d1d5db' : '#4b5563', // dark -> gray-300, light -> gray-600
                fontWeight: '600',
            },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            max: 400,
            splitNumber: 4,
            axisLine: { show: false },
            splitLine: {
                lineStyle: {
                    color: isDark ? '#374151' : '#e5e7eb', // dark -> gray-700, light -> gray-200
                    type: 'dashed',
                },
            },
            axisLabel: {
                color: isDark ? '#9ca3af' : '#6b7280', // dark -> gray-400, light -> gray-500
            },
        },
        series: [
            {
                name: 'Google ads',
                type: 'line',
                smooth: true,
                data: [65, 210, 175, 140, 105, 20, 120, 20],
                showSymbol: true,
                symbolSize: 12,
                lineStyle: {
                    color: '#10b981',
                    width: 3,
                },
                itemStyle: {
                    color: '#10b981',
                    borderWidth: 2,
                    borderColor: '#fff',
                },
            },
            {
                name: 'Facebook ads',
                type: 'line',
                smooth: true,
                data: [20, 125, 100, 30, 150, 300, 90, 180],
                showSymbol: true,
                symbolSize: 12,
                lineStyle: {
                    color: '#f97316',
                    width: 3,
                },
                itemStyle: {
                    color: '#f97316',
                    borderWidth: 2,
                    borderColor: '#fff',
                },
            },
        ],
    };

    return (
        <div className="max-w-3xl mx-auto my-10 p-6 bg-white admin-dark:bg-gray-800 rounded-3xl shadow-md transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 admin-dark:text-white mb-6">
                Revenue
            </h2>
            <ReactECharts
                echarts={echarts}
                option={option}
                style={{ height: 300, width: '100%' }}
            />
        </div>
    );
};

export default RevenueChart;
