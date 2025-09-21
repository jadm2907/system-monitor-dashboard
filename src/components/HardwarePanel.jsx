import React, { useState, useEffect } from 'react';
import { getPerformanceMetrics, getDiskInfo } from '../services/systemService';
import '../styles/Components.css';

const HardwarePanel = ({ systemData }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [diskInfo, setDiskInfo] = useState(null);

  useEffect(() => {
    loadPerformanceData();
    loadDiskInfo();
    
    const interval = setInterval(() => {
      loadPerformanceData();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    const data = await getPerformanceMetrics();
    setPerformanceData(data);
  };

  const loadDiskInfo = async () => {
    const data = await getDiskInfo();
    setDiskInfo(data);
  };

  if (!systemData || !performanceData) {
    return <div className="panel loading">Cargando información de hardware...</div>;
  }

  return (
    <div className="panel hardware-panel">
      <h2>Información de Hardware</h2>
      
      <div className="hardware-section">
        <h3>Procesador (CPU)</h3>
        <div className="hardware-info">
          <div className="info-row">
            <span className="label">Modelo:</span>
            <span className="value">{systemData.cpu?.brand || 'Intel Core i7-10700K'}</span>
          </div>
          <div className="info-row">
            <span className="label">Núcleos:</span>
            <span className="value">{systemData.cpu?.cores || 8} ({(systemData.cpu?.physicalCores || 4)} físicos)</span>
          </div>
          <div className="info-row">
            <span className="label">Frecuencia:</span>
            <span className="value">{systemData.cpu?.speed || 3.8} GHz</span>
          </div>
          <div className="info-row">
            <span className="label">Uso actual:</span>
            <span className="value">
              {performanceData.cpuUsage.toFixed(1)}%
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{width: `${performanceData.cpuUsage}%`}}
                ></div>
              </div>
            </span>
          </div>
        </div>
      </div>
      
      <div className="hardware-section">
        <h3>Memoria (RAM)</h3>
        <div className="hardware-info">
          <div className="info-row">
            <span className="label">Total:</span>
            <span className="value">{systemData.memory?.total ? (systemData.memory.total / (1024 ** 3)).toFixed(2) : 16} GB</span>
          </div>
          <div className="info-row">
            <span className="label">Disponible:</span>
            <span className="value">{systemData.memory?.available ? (systemData.memory.available / (1024 ** 3)).toFixed(2) : 5.2} GB</span>
          </div>
          <div className="info-row">
            <span className="label">Uso actual:</span>
            <span className="value">
              {performanceData.memoryUsage.toFixed(1)}%
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{width: `${performanceData.memoryUsage}%`}}
                ></div>
              </div>
            </span>
          </div>
        </div>
      </div>
      
      <div className="hardware-section">
        <h3>Almacenamiento</h3>
        {diskInfo ? (
          <div className="disks-list">
            {diskInfo.map((disk, index) => (
              <div key={index} className="disk-info">
                <div className="disk-header">
                  <span className="disk-name">{disk.name}</span>
                  <span className="disk-size">{disk.total} GB total</span>
                </div>
                <div className="disk-usage">
                  <div className="usage-info">
                    <span>{disk.used} GB usado de {disk.total} GB</span>
                    <span>{disk.usage}%</span>
                  </div>
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{width: `${disk.usage}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Cargando información de discos...</p>
        )}
      </div>
      
      <div className="hardware-section">
        <h3>Gráficos</h3>
        <div className="hardware-info">
          <div className="info-row">
            <span className="label">Modelo:</span>
            <span className="value">NVIDIA GeForce RTX 3070</span>
          </div>
          <div className="info-row">
            <span className="label">VRAM:</span>
            <span className="value">8 GB GDDR6</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwarePanel;