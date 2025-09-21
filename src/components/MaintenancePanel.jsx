import React, { useState, useEffect } from 'react';
import { getPerformanceMetrics } from '../services/systemService';
import { checkMaintenanceNeeds } from '../utils/maintenanceChecker';
import '../styles/Components.css';

const MaintenancePanel = ({ systemData }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [maintenanceTips, setMaintenanceTips] = useState([]);

  useEffect(() => {
    loadPerformanceData();
    
    const interval = setInterval(loadPerformanceData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (performanceData && systemData) {
      const tips = checkMaintenanceNeeds(systemData, performanceData);
      setMaintenanceTips(tips);
    }
  }, [performanceData, systemData]);

  const loadPerformanceData = async () => {
    const data = await getPerformanceMetrics();
    setPerformanceData(data);
  };

  const performCleanup = (type) => {
    // Simular acción de limpieza
    alert(`Iniciando limpieza de ${type}...`);
    // En una implementación real, se llamaría a una API backend
  };

  if (!performanceData) {
    return <div className="panel loading">Cargando datos de rendimiento...</div>;
  }

  return (
    <div className="panel maintenance-panel">
      <h2>Mantenimiento del Sistema</h2>
      
      <div className="performance-metrics">
        <h3>Métricas de Rendimiento</h3>
        <div className="metrics-grid">
          <div className="metric">
            <div className="metric-label">Uso de CPU</div>
            <div className="metric-value">{performanceData.cpuUsage.toFixed(1)}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${performanceData.cpuUsage}%`}}
              ></div>
            </div>
          </div>
          
          <div className="metric">
            <div className="metric-label">Uso de Memoria</div>
            <div className="metric-value">{performanceData.memoryUsage.toFixed(1)}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${performanceData.memoryUsage}%`}}
              ></div>
            </div>
          </div>
          
          <div className="metric">
            <div className="metric-label">Uso de Disco</div>
            <div className="metric-value">{performanceData.diskUsage.toFixed(1)}%</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${performanceData.diskUsage}%`}}
              ></div>
            </div>
          </div>
          
          <div className="metric">
            <div className="metric-label">Tiempo de actividad</div>
            <div className="metric-value">
              {Math.floor(performanceData.uptime / 3600)}h
            </div>
          </div>
        </div>
      </div>
      
      <div className="maintenance-tips">
        <h3>Recomendaciones de Mantenimiento</h3>
        {maintenanceTips.length === 0 ? (
          <p className="good-status">¡El sistema está en buen estado! No se necesitan acciones inmediatas.</p>
        ) : (
          <ul>
            {maintenanceTips.map((tip, index) => (
              <li key={index} className={`tip ${tip.priority}`}>
                <span className="tip-text">{tip.message}</span>
                {tip.action && (
                  <button 
                    onClick={() => performCleanup(tip.actionType)}
                    className="btn-action"
                  >
                    {tip.action}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="action-buttons">
          <button onClick={() => performCleanup('cache')} className="btn-secondary">
            Limpiar Caché
          </button>
          <button onClick={() => performCleanup('memory')} className="btn-secondary">
            Optimizar Memoria
          </button>
          <button onClick={() => performCleanup('disk')} className="btn-secondary">
            Liberar Espacio
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePanel;