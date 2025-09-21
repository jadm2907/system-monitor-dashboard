import React, { useState, useEffect } from 'react';
import { getPerformanceMetrics, getDiskUsage } from '../services/systemService';
import '../styles/Components.css';

const HardwarePanel = ({ systemData, realTimeData, diskUsage }) => {
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    loadPerformanceData();
    
    const interval = setInterval(() => {
      loadPerformanceData();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    const data = await getPerformanceMetrics();
    setPerformanceData(data);
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
            <span className="value">{systemData.cpu?.brand || 'Desconocido'}</span>
          </div>
          <div className="info-row">
            <span className="label">Núcleos:</span>
            <span className="value">{systemData.cpu?.cores || 0} ({(systemData.cpu?.physicalCores || 0)} físicos)</span>
          </div>
          <div className="info-row">
            <span className="label">Frecuencia:</span>
            <span className="value">{systemData.cpu?.speed || 0} GHz</span>
          </div>
          <div className="info-row">
            <span className="label">Uso actual:</span>
            <span className="value">
              {realTimeData?.cpu?.usage?.toFixed(1) || 0}%
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{width: `${realTimeData?.cpu?.usage || 0}%`}}
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
            <span className="value">{systemData.memory?.total ? (systemData.memory.total / (1024 ** 3)).toFixed(2) : 0} GB</span>
          </div>
          <div className="info-row">
            <span className="label">Disponible:</span>
            <span className="value">{systemData.memory?.available ? (systemData.memory.available / (1024 ** 3)).toFixed(2) : 0} GB</span>
          </div>
          <div className="info-row">
            <span className="label">Uso actual:</span>
            <span className="value">
              {realTimeData?.memory?.usage?.toFixed(1) || 0}%
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{width: `${realTimeData?.memory?.usage || 0}%`}}
                ></div>
              </div>
            </span>
          </div>
        </div>
      </div>
      
      <div className="hardware-section">
        <h3>Almacenamiento</h3>
        {diskUsage && diskUsage.length > 0 ? (
          <div className="disks-list">
            {diskUsage.map((disk, index) => (
              <div key={index} className="disk-info">
                <div className="disk-header">
                  <span className="disk-name">{disk.mount}</span>
                  <span className="disk-size">{(disk.size / (1024 ** 3)).toFixed(2)} GB total</span>
                </div>
                <div className="disk-usage">
                  <div className="usage-info">
                    <span>{(disk.used / (1024 ** 3)).toFixed(2)} GB usado de {(disk.size / (1024 ** 3)).toFixed(2)} GB</span>
                    <span>{disk.use}%</span>
                  </div>
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{width: `${disk.use}%`}}
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
            <span className="value">{systemData.graphics?.controllers?.[0]?.model || 'No detectado'}</span>
          </div>
          <div className="info-row">
            <span className="label">VRAM:</span>
            <span className="value">{systemData.graphics?.controllers?.[0]?.vram ? `${systemData.graphics.controllers[0].vram} MB` : 'No disponible'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwarePanel;