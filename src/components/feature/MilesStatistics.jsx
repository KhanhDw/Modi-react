// npm install echarts echarts-for-react

import React, { useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const MilesStatistics = () => {
    const chartRef = useRef(null);
    const [selected, setSelected] = useState('day');

    const chartData = {
        day: [120, 90, 150, 60, 110, 30, 70],
        week: [300, 250, 400, 200, 350, 280, 320],
        month: [1000, 1200, 1100, 950, 1300, 1400, 1250],
    };

    const xLabels = {
        day: ['1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'],
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    };

    const totalMiles = chartData[selected].reduce((sum, val) => sum + val, 0);

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
            axisPointer: {
                type: 'line',  // Thay 'shadow' thành 'line' để có đường gạch đứng
                lineStyle: {
                    color: '#3b82f6', // màu cam (có thể đổi)
                    width: 1,
                    type: 'dashed'   // đường nét đứt
                }
            },
            backgroundColor: '#1f2937', // màu nền hộp tooltip
            borderRadius: 6,
            textStyle: {
                color: '#fff',
                fontSize: 12,
            },
        },
        grid: { left: 0, right: 0, bottom: 0, top: 10, containLabel: true },
        xAxis: {
            type: 'category',
            data: xLabels[selected],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: '#64748b', // slate-500
                fontWeight: 500,
            },
        },
        yAxis: {
            type: 'value',
            show: false,
        },
        series: [
            {
                type: 'bar',
                data: chartData[selected],
                itemStyle: {
                    color: '#3b82f6', // blue-500
                    borderRadius: [6, 6, 0, 0],
                },
                barWidth: '30%',
            },
        ],
    });

    return (
        <div className="bg-white m-2 rounded-2xl p-6 md:p-8 shadow-sm w-full max-w-3xl mx-auto">
            {/* Title Row */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                    <span className="font-bold">Miles</span> Statistics
                </h2>
                <p className="text-sm font-semibold text-gray-700">
                    {totalMiles} Miles
                </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-4">
                {['day', 'week', 'month'].map((key) => (
                    <button
                        key={key}
                        onClick={() => handleChange(key)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${selected === key
                            ? 'bg-blue-500 text-white'
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

export default MilesStatistics;
