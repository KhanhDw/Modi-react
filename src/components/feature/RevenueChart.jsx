import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

const RevenueChart = () => {
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line', // đường gạch dọc khi hover
                lineStyle: {
                    color: '#999',
                    width: 1,
                    type: 'dashed',
                },
            },
            backgroundColor: '#1f2937', // màu nền tooltip (tailwind slate-800)
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
                color: '#374151', // tailwind gray-700
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
                    color: '#d1d5db', // tailwind gray-300
                    type: 'dashed',
                },
            },
            axisLabel: {
                color: '#4b5563', // tailwind gray-600
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
                    color: '#e5e7eb', // tailwind gray-200
                    type: 'dashed',
                },
            },
            axisLabel: {
                color: '#6b7280', // tailwind gray-500
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
                    color: '#10b981', // tailwind emerald-500
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
                    color: '#f97316', // tailwind orange-500
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
        <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-3xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue</h2>
            <ReactECharts
                echarts={echarts}
                option={option}
                style={{ height: 300, width: '100%' }}
            />
        </div>
    );
};

export default RevenueChart;
