import React, { useState, useEffect } from 'react';
import { getNetworkInfo, getNetworkStats } from '../services/networkService';
import '../styles/Components.css';

const NetworkPanel = ({ networkData }) => {
  const [networkInfo, setNetworkInfo] = useState(null);
  const [networkStats, setNetworkStats] = useState(null);

  useEffect(() => {
    loadNetworkInfo();
    loadNetworkStats();
    
    const interval = setInterval(() => {
      loadNetworkStats();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const loadNetworkInfo = async () => {
    const data = await getNetworkInfo();
    setNetworkInfo(data);
  };

  const loadNetworkStats = async () => {
    const data = await getNetworkStats();
    setNetworkStats(data);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!networkInfo || !networkStats) {
    return <div className="panel loading">Cargando información de red...</div>;
  }

  return (
    <div className="panel network-panel">
      <h2>Información de Red</h2>
      
      <div className="network-section">
        <h3>Conexión Actual</h3>
        <div className="network-info">
          <div className="info-row">
            <span className="label">Dirección IP:</span>
            <span className="value">{networkInfo.ip || '192.168.1.100'}</span>
          </div>
          <div className="info-row">
            <span className="label">Tipo de conexión:</span>
            <span className="value">{networkInfo.type || 'Wi-Fi'}</span>
          </div>
          <div className="info-row">
            <span className="label">Velocidad de enlace:</span>
            <span className="value">{networkInfo.downlink || 75} Mbps</span>
          </div>
          <div className="info-row">
            <span className="label">Latencia:</span>
            <span className="value">{networkInfo.rtt || 28} ms</span>
          </div>
        </div>
      </div>
      
      <div className="network-section">
        <h3>Estadísticas en Tiempo Real</h3>
        <div className="network-stats">
          <div className="stat-card">
            <h4>Descarga</h4>
            <div className="stat-value">{formatBytes(networkStats.bytesReceived)}</div>
            <div className="stat-label">Total recibido</div>
          </div>
          
          <div className="stat-card">
            <h4>Subida</h4>
            <div className="stat-value">{formatBytes(networkStats.bytesSent)}</div>
            <div className="stat-label">Total enviado</div>
          </div>
          
          <div className="stat-card">
            <h4>Velocidad Desc.</h4>
            <div className="stat-value">{formatBytes(networkStats.downloadSpeed)}/s</div>
            <div className="stat-label">Actual</div>
          </div>
          
          <div className="stat-card">
            <h4>Velocidad Sub.</h4>
            <div className="stat-value">{formatBytes(networkStats.uploadSpeed)}/s</div>
            <div className="stat-label">Actual</div>
          </div>
        </div>
      </div>
      
      <div className="network-section">
        <h3>Puertos y Conexiones</h3>
        <div className="connections-list">
          <div className="connection-header">
            <span>Protocolo</span>
            <span>Dirección Local</span>
            <span>Dirección Remota</span>
            <span>Estado</span>
          </div>
          <div className="connection-item">
            <span>TCP</span>
            <span>192.168.1.100:443</span>
            <span>104.18.5.63:443</span>
            <span className="status established">Establecida</span>
          </div>
          <div className="connection-item">
            <span>TCP</span>
            <span>192.168.1.100:5353</span>
            <span>224.0.0.251:5353</span>
            <span className="status listening">Escuchando</span>
          </div>
          <div className="connection-item">
            <span>UDP</span>
            <span>192.168.1.100:53</span>
            <span>8.8.8.8:53</span>
            <span className="status established">Establecida</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkPanel;