import React, { useState, useEffect } from 'react';
import { getPerformanceMetrics } from '../services/systemService';
import { getNetworkStats } from '../services/networkService';
import '../styles/Components.css';

const RealTimeCharts = () => {
  const [cpuData, setCpuData] = useState([]);
  const [memoryData, setMemoryData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [maxDataPoints] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCharts();
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const updateCharts = async () => {
    const performance = await getPerformanceMetrics();
    const network = await getNetworkStats();
    const timestamp = new Date().toLocaleTimeString();
    
    // Actualizar datos de CPU
    setCpuData(prev => {
      const newData = [...prev, { time: timestamp, value: performance.cpuUsage }];
      return newData.slice(-maxDataPoints);
    });
    
    // Actualizar datos de memoria
    setMemoryData(prev => {
      const newData = [...prev, { time: timestamp, value: performance.memoryUsage }];
      return newData.slice(-maxDataPoints);
    });
    
    // Actualizar datos de red
    setNetworkData(prev => {
      const newData = [...prev, { 
        time: timestamp, 
        download: network.downloadSpeed / 1024, // Convertir a KB/s
        upload: network.uploadSpeed / 1024 
      }];
      return newData.slice(-maxDataPoints);
    });
  };

  const renderLineChart = (data, title, color) => {
    if (data.length === 0) return <div className="chart-placeholder">Cargando datos...</div>;
    
    const maxValue = Math.max(...data.map(d => d.value), 100);
    const chartHeight = 150;
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="chart" style={{ height: `${chartHeight}px` }}>
          {data.map((point, index) => {
            const height = (point.value / maxValue) * chartHeight;
            return (
              <div 
                key={index}
                className="chart-bar"
                style={{
                  height: `${height}px`,
                  backgroundColor: color,
                  width: `${90 / maxDataPoints}%`
                }}
                title={`${point.time}: ${point.value.toFixed(1)}%`}
              ></div>
            );
          })}
        </div>
        <div className="chart-labels">
          <span>{data[0]?.time}</span>
          <span>{data[data.length - 1]?.time}</span>
        </div>
      </div>
    );
  };

  const renderNetworkChart = () => {
    if (networkData.length === 0) return <div className="chart-placeholder">Cargando datos...</div>;
    
    const maxValue = Math.max(
      ...networkData.map(d => d.download),
      ...networkData.map(d => d.upload),
      100
    );
    const chartHeight = 150;
    
    return (
      <div className="chart-container">
        <h3>Velocidad de Red (KB/s)</h3>
        <div className="chart" style={{ height: `${chartHeight}px` }}>
          {networkData.map((point, index) => {
            const downloadHeight = (point.download / maxValue) * chartHeight;
            const uploadHeight = (point.upload / maxValue) * chartHeight;
            
            return (
              <div key={index} className="network-bars">
                <div 
                  className="chart-bar"
                  style={{
                    height: `${downloadHeight}px`,
                    backgroundColor: '#4caf50',
                    width: `${40 / maxDataPoints}%`
                  }}
                  title={`Descarga: ${point.download.toFixed(1)} KB/s`}
                ></div>
                <div 
                  className="chart-bar"
                  style={{
                    height: `${uploadHeight}px`,
                    backgroundColor: '#ff9800',
                    width: `${40 / maxDataPoints}%`,
                    marginLeft: `${5 / maxDataPoints}%`
                  }}
                  title={`Subida: ${point.upload.toFixed(1)} KB/s`}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="chart-labels">
          <span>{networkData[0]?.time}</span>
          <span>{networkData[networkData.length - 1]?.time}</span>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4caf50' }}></div>
            <span>Descarga</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ff9800' }}></div>
            <span>Subida</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="panel realtime-panel">
      <h2>Métricas en Tiempo Real</h2>
      
      <div className="charts-grid">
        <div className="chart-wrapper">
          {renderLineChart(cpuData, 'Uso de CPU (%)', '#2196f3')}
        </div>
        
        <div className="chart-wrapper">
          {renderLineChart(memoryData, 'Uso de Memoria (%)', '#e91e63')}
        </div>
        
        <div className="chart-wrapper">
          {renderNetworkChart()}
        </div>
      </div>
      
      <div className="current-stats">
        <div className="current-stat">
          <h4>CPU Actual</h4>
          <div className="stat-value">
            {cpuData.length > 0 ? cpuData[cpuData.length - 1].value.toFixed(1) : 0}%
          </div>
        </div>
        
        <div className="current-stat">
          <h4>Memoria Actual</h4>
          <div className="stat-value">
            {memoryData.length > 0 ? memoryData[memoryData.length - 1].value.toFixed(1) : 0}%
          </div>
        </div>
        
        <div className="current-stat">
          <h4>Descarga Actual</h4>
          <div className="stat-value">
            {networkData.length > 0 ? networkData[networkData.length - 1].download.toFixed(1) : 0} KB/s
          </div>
        </div>
        
        <div className="current-stat">
          <h4>Subida Actual</h4>
          <div className="stat-value">
            {networkData.length > 0 ? networkData[networkData.length - 1].upload.toFixed(1) : 0} KB/s
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCharts;