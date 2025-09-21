import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import HardwarePanel from './HardwarePanel';
import SecurityPanel from './SecurityPanel';
import NetworkPanel from './NetworkPanel';
import ProcessesPanel from './ProcessesPanel';
import MaintenancePanel from './MaintenancePanel';
import RealTimeCharts from './RealTimeCharts';
import SystemOverview from './SystemOverview';
import socketService from '../services/socketService';
import { getSystemInfo, getRunningProcesses, getDiskUsage } from '../services/systemService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemData, setSystemData] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [diskUsage, setDiskUsage] = useState([]);
  const [realTimeData, setRealTimeData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    loadInitialData();
    setupRealTimeConnection();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const [systemInfo, processesData, diskData] = await Promise.all([
        getSystemInfo(),
        getRunningProcesses(),
        getDiskUsage()
      ]);
      
      setSystemData(systemInfo);
      setProcesses(processesData);
      setDiskUsage(diskData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const setupRealTimeConnection = () => {
    const socket = socketService.connect();
    
    socketService.onRealTimeData((data) => {
      setRealTimeData(data);
      setConnectionStatus('connected');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('connect', () => {
      setConnectionStatus('connected');
    });
  };

  const renderActiveTab = () => {
    if (!systemData) {
      return <div className="loading">Cargando datos del sistema...</div>;
    }

    switch(activeTab) {
      case 'overview':
        return <SystemOverview 
          systemData={systemData} 
          realTimeData={realTimeData}
          connectionStatus={connectionStatus}
        />;
      case 'hardware':
        return <HardwarePanel 
          systemData={systemData} 
          realTimeData={realTimeData}
          diskUsage={diskUsage}
        />;
      case 'security':
        return <SecurityPanel systemData={systemData} />;
      case 'network':
        return <NetworkPanel 
          systemData={systemData} 
          realTimeData={realTimeData}
        />;
      case 'processes':
        return <ProcessesPanel 
          processes={processes}
          realTimeData={realTimeData}
        />;
      case 'maintenance':
        return <MaintenancePanel 
          systemData={systemData}
          realTimeData={realTimeData}
        />;
      case 'realtime':
        return <RealTimeCharts realTimeData={realTimeData} />;
      default:
        return <SystemOverview 
          systemData={systemData} 
          realTimeData={realTimeData}
          connectionStatus={connectionStatus}
        />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        connectionStatus={connectionStatus}
        realTimeData={realTimeData}
      />
      <main className="dashboard-content">
        <div className="connection-status">
          Estado: {connectionStatus === 'connected' ? '✅ Conectado' : 
                  connectionStatus === 'connecting' ? '🔄 Conectando...' : '❌ Desconectado'}
        </div>
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Dashboard;