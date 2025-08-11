// npm install echarts echarts-for-react

import React, { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const CarStatistics = () => {
    const chartRef = useRef(null);
    const [selected, setSelected] = useState('day');

    const chartData = {
        day: [300, 500, 801, 700, 1200, 1000, 950, 1100],
        week: [100, 150, 120, 140, 180, 130, 160],
        month: [300, 280, 350, 400, 370, 390, 410],
    };

    const xLabels = {
        day: ['7 am', '9 am', '11 am', '1 pm', '3 pm', '5 pm', '7 pm', '9 pm'],
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    };

    const handleChange = (key) => {
        setSelected(key);
        if (chartRef.current) {
            const instance = chartRef.current.getEchartsInstance();
            instance.setOption({
                xAxis: { data: xLabels[key] },
                series: [{ data: chartData[key] }],
            });
        }
    };

    const getOption = () => ({
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#1f2937', // Tailwind's gray-800
            borderRadius: 8,
            padding: 10,
            textStyle: {
                color: '#fff',
                fontSize: 12,
            },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#94a3b8', // Tailwind slate-400
                    width: 1,
                    type: 'dashed',
                },
            },
            formatter: (params) => {
                const { axisValue, marker, value } = params[0];
                return `
                    <strong>${axisValue}</strong><br/>
                    ${marker} ${value}
                `;
            },
        },
        grid: { left: 0, right: 0, bottom: 0, top: 10, containLabel: true },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xLabels[selected],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#94a3b8' }, // slate-400
        },
        yAxis: { type: 'value', show: false },
        series: [
            {
                type: 'line',
                data: chartData[selected],
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#fb923c', width: 2 }, // orange-400
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(251, 146, 60, 0.3)' },
                        { offset: 1, color: 'rgba(251, 146, 60, 0)' },
                    ]),
                },
            },
        ],
    });

    return (
        <div className="bg-white m-2 rounded-2xl p-6 md:p-8 shadow-sm w-full max-w-3xl mx-auto">
            {/* Title */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                    <span className="font-bold">Car</span> Statistics
                </h2>
                <p className="text-sm text-gray-500 mt-1">20 February 2022</p>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 mb-4">
                {['day', 'week', 'month'].map((key) => (
                    <button
                        key={key}
                        onClick={() => handleChange(key)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selected === key
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                ))}
            </div>

            {/* Chart */}
            <ReactECharts
                ref={chartRef}
                option={getOption()}
                style={{ height: 250 }}
                notMerge={true}
                lazyUpdate={true}
            />
        </div>
    );
};

export default CarStatistics;
