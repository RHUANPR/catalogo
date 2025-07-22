
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Since this is an isolated environment, we need to add Recharts and Lucide to the window
// In a real app, you would use a bundler and import them.
// @ts-ignore
window.Recharts = {
    BarChart: ({ children }) => <div>{children}</div>,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
    ResponsiveContainer: ({ children }) => <div style={{width: '100%', height: '100%'}}>{children}</div>,
    Cell: () => null
};

// @ts-ignore
window.lucide = {
    createReactComponent: (name) => () => <div data-lucide={name} />
};


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);