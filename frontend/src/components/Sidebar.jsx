import React from 'react';
import '../styles/Components.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Resumen del Sistema', icon: '📊' },
    { id: 'hardware', label: 'Hardware', icon: '💻' },
    { id: 'processes', label: 'Procesos', icon: '⚙️' },
    { id: 'network', label: 'Red', icon: '🌐' },
    { id: 'security', label: 'Seguridad', icon: '🔒' },
    { id: 'maintenance', label: 'Mantenimiento', icon: '🔧' },
    { id: 'realtime', label: 'Tiempo Real', icon: '📈' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SystemMonitor</h2>
        <div className="system-status">
          <div className="status-indicator active"></div>
          <span>Sistema Activo</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <button 
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="quick-stats">
          <div className="stat">
            <span>CPU</span>
            <div className="stat-value">42%</div>
          </div>
          <div className="stat">
            <span>RAM</span>
            <div className="stat-value">64%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;