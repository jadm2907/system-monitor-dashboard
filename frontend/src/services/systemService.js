const API_BASE = 'http://localhost:5000/api';

export const getSystemInfo = async () => {
  try {
    const response = await fetch(`${API_BASE}/system-info`);
    if (!response.ok) throw new Error('Error obteniendo información del sistema');
    return await response.json();
  } catch (error) {
    console.error('Error en getSystemInfo:', error);
    return null;
  }
};

export const getPerformanceMetrics = async () => {
  try {
    const response = await fetch(`${API_BASE}/system-info`);
    if (!response.ok) throw new Error('Error obteniendo métricas');
    const data = await response.json();
    
    return {
      cpuUsage: 0, // Se obtendrá por socket
      memoryUsage: ((data.memory.used / data.memory.total) * 100) || 0,
      diskUsage: 0,
      uptime: Math.floor(process.uptime() || 0)
    };
  } catch (error) {
    console.error('Error en getPerformanceMetrics:', error);
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      uptime: 0
    };
  }
};

export const getRunningProcesses = async () => {
  try {
    const response = await fetch(`${API_BASE}/processes`);
    if (!response.ok) throw new Error('Error obteniendo procesos');
    return await response.json();
  } catch (error) {
    console.error('Error en getRunningProcesses:', error);
    return [];
  }
};

export const getNetworkStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/network-stats`);
    if (!response.ok) throw new Error('Error obteniendo estadísticas de red');
    const data = await response.json();
    return data[0] || {};
  } catch (error) {
    console.error('Error en getNetworkStats:', error);
    return {};
  }
};

export const getDiskUsage = async () => {
  try {
    const response = await fetch(`${API_BASE}/disk-usage`);
    if (!response.ok) throw new Error('Error obteniendo uso de disco');
    return await response.json();
  } catch (error) {
    console.error('Error en getDiskUsage:', error);
    return [];
  }
};

// Alias para compatibilidad con código existente
export const getDiskInfo = getDiskUsage;