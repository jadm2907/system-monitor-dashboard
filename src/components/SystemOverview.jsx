import React from 'react';
import '../styles/Components.css';

const SystemOverview = ({ systemData, securityData, networkData }) => {
  if (!systemData || !securityData || !networkData) {
    return <div className="panel loading">Cargando información del sistema...</div>;
  }

  const getSystemHealth = () => {
    // Lógica simple para determinar el estado del sistema
    let score = 100;
    
    // Penalizar por vulnerabilidades de seguridad
    score -= securityData.vulnerabilities * 2;
    
    // Penalizar por alto uso de recursos (simulado)
    if (Math.random() > 0.7) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const systemHealth = getSystemHealth();
  const healthStatus = systemHealth >= 80 ? 'excelent' : 
                       systemHealth >= 60 ? 'good' : 
                       systemHealth >= 40 ? 'warning' : 'critical';

  return (
    <div className="panel overview-panel">
      <h2>Resumen del Sistema</h2>
      
      <div className="health-section">
        <h3>Estado del Sistema</h3>
        <div className={`health-score ${healthStatus}`}>
          <div className="score-value">{systemHealth}</div>
          <div className="score-label">Puntuación de salud</div>
        </div>
        <div className="health-message">
          {healthStatus === 'excelent' && '✅ Su sistema está en excelente estado'}
          {healthStatus === 'good' && '⚠️ Su sistema está en buen estado, pero podría mejorar'}
          {healthStatus === 'warning' && '⚠️ Su sistema necesita atención'}
          {healthStatus === 'critical' && '❌ Su sistema necesita mantenimiento urgente'}
        </div>
      </div>
      
      <div className="overview-grid">
        <div className="overview-card">
          <h4>🖥️ Hardware</h4>
          <div className="card-content">
            <p><strong>CPU:</strong> {systemData.cpu?.brand || 'Intel Core i7-10700K'}</p>
            <p><strong>RAM:</strong> {systemData.memory?.total ? (systemData.memory.total / (1024 ** 3)).toFixed(2) : 16} GB</p>
            <p><strong>GPU:</strong> NVIDIA GeForce RTX 3070</p>
          </div>
        </div>
        
        <div className="overview-card">
          <h4>🔒 Seguridad</h4>
          <div className="card-content">
            <p><strong>Firewall:</strong> <span className={securityData.firewallStatus === 'Active' ? 'good' : 'bad'}>{securityData.firewallStatus}</span></p>
            <p><strong>Antivirus:</strong> <span className={securityData.antivirusStatus === 'Updated' ? 'good' : 'bad'}>{securityData.antivirusStatus}</span></p>
            <p><strong>Vulnerabilidades:</strong> <span className={securityData.vulnerabilities > 0 ? 'warning' : 'good'}>{securityData.vulnerabilities}</span></p>
          </div>
        </div>
        
        <div className="overview-card">
          <h4>🌐 Red</h4>
          <div className="card-content">
            <p><strong>IP:</strong> {networkData.ip || '192.168.1.100'}</p>
            <p><strong>Tipo:</strong> {networkData.type || 'Wi-Fi'}</p>
            <p><strong>Velocidad:</strong> {networkData.downlink || 75} Mbps</p>
          </div>
        </div>
        
        <div className="overview-card">
          <h4>📊 Rendimiento</h4>
          <div className="card-content">
            <p><strong>CPU:</strong> {(Math.random() * 100).toFixed(1)}%</p>
            <p><strong>Memoria:</strong> {(Math.random() * 100).toFixed(1)}%</p>
            <p><strong>Disco:</strong> {(Math.random() * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="action-buttons">
          <button className="btn-primary">🔍 Escanear ahora</button>
          <button className="btn-secondary">🗑️ Limpiar caché</button>
          <button className="btn-secondary">🔄 Optimizar memoria</button>
          <button className="btn-secondary">📋 Ver reporte completo</button>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;