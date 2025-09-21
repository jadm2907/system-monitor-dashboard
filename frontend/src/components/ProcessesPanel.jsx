import React, { useState, useEffect } from 'react';
import { getRunningProcesses, killProcess } from '../services/processService';
import '../styles/Components.css';

const ProcessesPanel = () => {
  const [processes, setProcesses] = useState([]);
  const [sortBy, setSortBy] = useState('cpu');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadProcesses();
    
    const interval = setInterval(() => {
      loadProcesses();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadProcesses = async () => {
    const data = await getRunningProcesses();
    setProcesses(data);
  };

  const handleKillProcess = async (pid) => {
    if (window.confirm(`¿Está seguro de que desea terminar el proceso ${pid}?`)) {
      const success = await killProcess(pid);
      if (success) {
        loadProcesses(); // Recargar lista
      }
    }
  };

  const sortedProcesses = [...processes].sort((a, b) => {
    if (sortBy === 'cpu') return (b.cpu || 0) - (a.cpu || 0);
    if (sortBy === 'memory') return (b.memory || 0) - (a.memory || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const filteredProcesses = sortedProcesses.filter(process => 
    process.name.toLowerCase().includes(filter.toLowerCase()) ||
    process.pid.toString().includes(filter)
  );

  return (
    <div className="panel processes-panel">
      <div className="panel-header">
        <h2>Procesos en Ejecución</h2>
        <div className="process-controls">
          <input
            type="text"
            placeholder="Filtrar procesos..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="cpu">Ordenar por CPU</option>
            <option value="memory">Ordenar por Memoria</option>
            <option value="name">Ordenar por Nombre</option>
          </select>
          <button onClick={loadProcesses} className="btn-refresh">🔄 Actualizar</button>
        </div>
      </div>
      
      <div className="processes-list">
        <div className="process-header">
          <span className="col-pid">PID</span>
          <span className="col-name">Nombre</span>
          <span className="col-cpu">CPU %</span>
          <span className="col-memory">Memoria %</span>
          <span className="col-actions">Acciones</span>
        </div>
        
        <div className="processes-container">
          {filteredProcesses.length > 0 ? (
            filteredProcesses.map(process => (
              <div key={process.pid} className="process-item">
                <span className="col-pid">{process.pid}</span>
                <span className="col-name" title={process.name}>
                  {process.name.length > 30 ? process.name.substring(0, 30) + '...' : process.name}
                </span>
                <span className="col-cpu">
                  <div className="usage-indicator">
                    <div 
                      className="usage-bar" 
                      style={{width: `${process.cpu || 0}%`}}
                    ></div>
                    <span className="usage-text">{process.cpu ? process.cpu.toFixed(1) : 0}%</span>
                  </div>
                </span>
                <span className="col-memory">
                  <div className="usage-indicator">
                    <div 
                      className="usage-bar" 
                      style={{width: `${process.memory || 0}%`}}
                    ></div>
                    <span className="usage-text">{process.memory ? process.memory.toFixed(1) : 0}%</span>
                  </div>
                </span>
                <span className="col-actions">
                  <button 
                    onClick={() => handleKillProcess(process.pid)}
                    className="btn-kill"
                    title="Terminar proceso"
                  >
                    ⛔
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="no-processes">No se encontraron procesos</div>
          )}
        </div>
      </div>
      
      <div className="processes-summary">
        <div className="summary-item">
          <span>Total procesos:</span>
          <span>{processes.length}</span>
        </div>
        <div className="summary-item">
          <span>CPU total:</span>
          <span>{processes.reduce((sum, proc) => sum + (proc.cpu || 0), 0).toFixed(1)}%</span>
        </div>
        <div className="summary-item">
          <span>Memoria total:</span>
          <span>{processes.reduce((sum, proc) => sum + (proc.memory || 0), 0).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ProcessesPanel;