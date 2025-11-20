import React from 'react';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    Cell
} from 'recharts';

const BoxPlot = ({ feature, value, stats }) => {
    if (!stats) return null;

    const { min, q1, median, q3, max } = stats;

    // Data for the boxplot (using a bar chart to simulate the box)
    // We'll use a horizontal layout

    // We need to construct a dataset that represents the box and whiskers
    // Since Recharts doesn't have a native BoxPlot, we can approximate it or use a simple SVG.
    // Given the complexity of doing a proper BoxPlot in Recharts without a dedicated component,
    // and the need for a specific "patient value" marker, a custom SVG might be cleaner.
    // But let's try a simple SVG implementation first as it's lighter and easier to control for this specific use case.

    const width = 300;
    const height = 60;
    const padding = 20;
    const plotWidth = width - 2 * padding;

    // Scale function
    const scale = (val) => {
        const range = max - min;
        if (range === 0) return padding;
        return padding + ((val - min) / range) * plotWidth;
    };

    const xMin = scale(min);
    const xQ1 = scale(q1);
    const xMedian = scale(median);
    const xQ3 = scale(q3);
    const xMax = scale(max);
    const xVal = scale(value);

    return (
        <div className="boxplot-container" style={{ width: '100%', maxWidth: '350px', margin: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', color: '#666', marginBottom: '5px' }}>
                <span>Min: {min}</span>
                <span>Median: {median}</span>
                <span>Max: {max}</span>
            </div>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Main Line (Whisker) */}
                <line x1={xMin} y1={height / 2} x2={xMax} y2={height / 2} stroke="#ccc" strokeWidth="2" />

                {/* Whiskers (Ends) */}
                <line x1={xMin} y1={height / 2 - 10} x2={xMin} y2={height / 2 + 10} stroke="#ccc" strokeWidth="2" />
                <line x1={xMax} y1={height / 2 - 10} x2={xMax} y2={height / 2 + 10} stroke="#ccc" strokeWidth="2" />

                {/* Box (IQR) */}
                <rect
                    x={xQ1}
                    y={height / 2 - 15}
                    width={Math.max(0, xQ3 - xQ1)}
                    height={30}
                    fill="#e9ecef"
                    stroke="#adb5bd"
                    strokeWidth="2"
                />

                {/* Median Line */}
                <line x1={xMedian} y1={height / 2 - 15} x2={xMedian} y2={height / 2 + 15} stroke="#495057" strokeWidth="2" />

                {/* Patient Value Marker */}
                <circle cx={xVal} cy={height / 2} r="6" fill="#dc3545" stroke="white" strokeWidth="2" />

                {/* Label for Patient Value */}
                <text x={xVal} y={height / 2 - 20} textAnchor="middle" fontSize="10" fill="#dc3545" fontWeight="bold">
                    You
                </text>
            </svg>
        </div>
    );
};

export default BoxPlot;
