import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import HardwarePanel from './HardwarePanel';
import SecurityPanel from './SecurityPanel';
import NetworkPanel from './NetworkPanel';
import ProcessesPanel from './ProcessesPanel';
import MaintenancePanel from './MaintenancePanel';
import RealTimeCharts from './RealTimeCharts';
import SystemOverview from './SystemOverview';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemData, setSystemData] = useState(null);
  const [securityData, setSecurityData] = useState(null);
  const [networkData, setNetworkData] = useState(null);

  useEffect(() => {
    // Cargar datos iniciales
    loadSystemData();
    loadSecurityData();
    loadNetworkData();

    // Configurar intervalos de actualización
    const systemInterval = setInterval(loadSystemData, 5000);
    const securityInterval = setInterval(loadSecurityData, 30000);
    const networkInterval = setInterval(loadNetworkData, 10000);

    return () => {
      clearInterval(systemInterval);
      clearInterval(securityInterval);
      clearInterval(networkInterval);
    };
  }, []);

  const loadSystemData = async () => {
    // En una implementación real, se harían llamadas a una API
    const data = await import('../services/systemService').then(module => 
      module.getSystemInfo()
    );
    setSystemData(data);
  };

  const loadSecurityData = async () => {
    const data = await import('../services/securityService').then(module => 
      module.runSecurityScan()
    );
    setSecurityData(data);
  };

  const loadNetworkData = async () => {
    const data = await import('../services/networkService').then(module => 
      module.getNetworkInfo()
    );
    setNetworkData(data);
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'overview':
        return <SystemOverview 
          systemData={systemData} 
          securityData={securityData}
          networkData={networkData}
        />;
      case 'hardware':
        return <HardwarePanel systemData={systemData} />;
      case 'security':
        return <SecurityPanel securityData={securityData} />;
      case 'network':
        return <NetworkPanel networkData={networkData} />;
      case 'processes':
        return <ProcessesPanel />;
      case 'maintenance':
        return <MaintenancePanel systemData={systemData} />;
      case 'realtime':
        return <RealTimeCharts />;
      default:
        return <SystemOverview 
          systemData={systemData} 
          securityData={securityData}
          networkData={networkData}
        />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="dashboard-content">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Dashboard;