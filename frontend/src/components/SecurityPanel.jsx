import React, { useState, useEffect } from 'react';
import { runSecurityScan, checkBrowserSecurity } from '../services/securityService';
import '../styles/Components.css';

const SecurityPanel = ({ securityData }) => {
  const [browserSecurity, setBrowserSecurity] = useState(null);
  const [lastScan, setLastScan] = useState(new Date());

  useEffect(() => {
    const browserData = checkBrowserSecurity();
    setBrowserSecurity(browserData);
  }, []);

  const handleRescan = async () => {
    // Recargar datos de seguridad
    const newData = await runSecurityScan();
    setSecurityData(newData);
    setBrowserSecurity(checkBrowserSecurity());
    setLastScan(new Date());
  };

  if (!securityData || !browserSecurity) {
    return <div className="panel loading">Cargando datos de seguridad...</div>;
  }

  return (
    <div className="panel security-panel">
      <div className="panel-header">
        <h2>Seguridad del Sistema</h2>
        <button onClick={handleRescan} className="btn-rescan">
          Volver a Escanear
        </button>
      </div>
      
      <div className="security-grid">
        <div className="security-card">
          <h3>Firewall</h3>
          <div className={`status ${securityData.firewallStatus === 'Active' ? 'good' : 'bad'}`}>
            {securityData.firewallStatus}
          </div>
        </div>
        
        <div className="security-card">
          <h3>Antivirus</h3>
          <div className={`status ${securityData.antivirusStatus === 'Updated' ? 'good' : 'bad'}`}>
            {securityData.antivirusStatus}
          </div>
          <p>Última actualización: {new Date(securityData.lastUpdate).toLocaleDateString()}</p>
        </div>
        
        <div className="security-card">
          <h3>Vulnerabilidades</h3>
          <div className={`status ${securityData.vulnerabilities === 0 ? 'good' : 'warning'}`}>
            {securityData.vulnerabilities} detectadas
          </div>
        </div>
        
        <div className="security-card">
          <h3>Encriptación</h3>
          <div className={`status ${securityData.encryptionStatus === 'Enabled' ? 'good' : 'bad'}`}>
            {securityData.encryptionStatus}
          </div>
        </div>
      </div>
      
      <div className="browser-security">
        <h3>Seguridad del Navegador</h3>
        <div className="security-list">
          <div className="security-item">
            <span>Conexión HTTPS: </span>
            <span className={browserSecurity.isHTTPS ? 'good' : 'bad'}>
              {browserSecurity.isHTTPS ? 'Sí' : 'No'}
            </span>
          </div>
          <div className="security-item">
            <span>Cookies habilitadas: </span>
            <span className={browserSecurity.cookiesEnabled ? 'good' : 'bad'}>
              {browserSecurity.cookiesEnabled ? 'Sí' : 'No'}
            </span>
          </div>
          <div className="security-item">
            <span>Do Not Track: </span>
            <span className={browserSecurity.doNotTrack ? 'good' : 'neutral'}>
              {browserSecurity.doNotTrack ? 'Activado' : 'Desactivado'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="scan-info">
        <p>Último escaneo: {lastScan.toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default SecurityPanel;