// Simulación de datos del sistema (en producción se conectaría a una API backend)
export const getSystemInfo = () => {
  return {
    os: navigator.platform,
    cpu: {
      cores: navigator.hardwareConcurrency,
      architecture: navigator.cpuClass || 'Unknown'
    },
    memory: {
      total: performance.memory ? performance.memory.jsHeapSizeLimit : null,
      used: performance.memory ? performance.memory.usedJSHeapSize : null
    },
    browser: {
      name: navigator.userAgentData?.brands[0]?.brand || navigator.appName,
      version: navigator.userAgentData?.brands[0]?.version || navigator.appVersion
    }
  };
};

export const getPerformanceMetrics = () => {
  return {
    cpuUsage: Math.random() * 100, // Simulado - en real se obtendría del backend
    memoryUsage: Math.random() * 100,
    diskUsage: Math.random() * 100,
    uptime: Math.floor(Math.random() * 1000000)
  };
};
// Complemento con funciones adicionales
export const getDiskInfo = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      name: 'Disco Local (C:)',
      total: 465,
      used: 285,
      free: 180,
      usage: 61.3,
      type: 'SSD'
    },
    {
      name: 'Datos (D:)',
      total: 931,
      used: 423,
      free: 508,
      usage: 45.4,
      type: 'HDD'
    }
  ];
};