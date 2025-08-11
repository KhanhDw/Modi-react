import React from 'react';
import ReactECharts from 'echarts-for-react';

const TotalRevenueChart = () => {
    const option = {
        color: ['#3B82F6', '#10B981'], // blue-500, green-500
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(31, 41, 55, 0.9)', // Tailwind gray-800
            borderRadius: 6,
            padding: [8, 12],
            textStyle: {
                color: '#fff',
                fontSize: 14,
            },
            formatter: (param) => {
                return `
          ${param.name}<br/>
          <span style="display:inline-block;margin-right:8px;border-radius:50%;width:10px;height:10px;background-color:${param.color};"></span>
          ${param.seriesName}: <strong>${param.value}k</strong>
        `;
            },
        },
        legend: {
            data: ['Online Sales', 'Offline Sales'],
            bottom: 0,
            icon: 'circle',
            textStyle: {
                fontSize: 14,
                color: '#4B5563', // gray-600
            },
            itemGap: 20,
        },
        grid: {
            top: '10%',
            left: '3%',
            right: '4%',
            bottom: '18%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
                fontSize: 13,
                color: '#6B7280',
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}k',
                fontSize: 13,
                color: '#6B7280',
            },
            splitLine: {
                lineStyle: {
                    color: '#E5E7EB',
                },
            },
        },
        series: [
            {
                name: 'Online Sales',
                type: 'bar',
                data: [14, 18, 6, 17, 12, 15, 22],
                barWidth: '40%',
                itemStyle: {
                    borderRadius: 6,
                },
            },
            {
                name: 'Offline Sales',
                type: 'bar',
                data: [12, 11, 23, 6, 11, 14, 11],
                barWidth: '40%',
                itemStyle: {
                    borderRadius: 6,
                },
            },
        ],
    };

    return (
        <div className="bg-white p-6 m-2 rounded-2xl shadow w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0f3659] mb-4">Total Revenue</h2>
            <ReactECharts option={option} style={{ height: 320, width: '100%' }} />
        </div>
    );
};

export default TotalRevenueChart;
