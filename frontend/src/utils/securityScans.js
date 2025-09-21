/**
 * Utilidades para escaneos de seguridad del sistema
 */

/**
 * Simula un escaneo de puertos abiertos
 * @returns {Promise<Array>} Array de puertos abiertos
 */
export const scanOpenPorts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const commonPorts = [21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 993, 995, 1723, 3306, 3389, 5900, 8080];
      const openPorts = commonPorts.filter(() => Math.random() > 0.7);
      
      resolve(openPorts.map(port => ({
        port,
        service: getServiceByPort(port),
        status: 'open',
        risk: getRiskLevelByPort(port)
      })));
    }, 2000);
  });
};

/**
 * Obtiene el servicio asociado a un puerto
 * @param {number} port - Número de puerto
 * @returns {string} Nombre del servicio
 */
const getServiceByPort = (port) => {
  const portServices = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    135: 'MSRPC',
    139: 'NetBIOS',
    143: 'IMAP',
    443: 'HTTPS',
    445: 'SMB',
    993: 'IMAPS',
    995: 'POP3S',
    1723: 'PPTP',
    3306: 'MySQL',
    3389: 'RDP',
    5900: 'VNC',
    8080: 'HTTP-Alt'
  };
  
  return portServices[port] || 'Unknown';
};

/**
 * Obtiene el nivel de riesgo de un puerto
 * @param {number} port - Número de puerto
 * @returns {string} Nivel de riesgo (high, medium, low)
 */
const getRiskLevelByPort = (port) => {
  const highRiskPorts = [21, 22, 23, 135, 139, 445, 3389, 5900];
  const mediumRiskPorts = [25, 110, 143, 1723, 3306];
  
  if (highRiskPorts.includes(port)) return 'high';
  if (mediumRiskPorts.includes(port)) return 'medium';
  return 'low';
};

/**
 * Simula un escaneo de vulnerabilidades
 * @returns {Promise<Array>} Array de vulnerabilidades encontradas
 */
export const scanVulnerabilities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const vulnerabilities = [
        'Weak password policies',
        'Outdated software versions',
        'Missing security patches',
        'Unencrypted sensitive data',
        'Insecure network configurations'
      ];
      
      const detectedVulnerabilities = vulnerabilities.filter(() => Math.random() > 0.5);
      
      resolve(detectedVulnerabilities.map(vuln => ({
        id: Math.random().toString(36).substr(2, 9),
        name: vuln,
        severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
        description: `Description of ${vuln.toLowerCase()}`,
        recommendation: `Recommendation to fix ${vuln.toLowerCase()}`
      })));
    }, 3000);
  });
};

/**
 * Verifica el estado del firewall
 * @returns {Promise<Object>} Estado del firewall
 */
export const checkFirewallStatus = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        active: Math.random() > 0.2,
        rules: Math.floor(Math.random() * 100),
        blockedAttempts: Math.floor(Math.random() * 500),
        lastUpdate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
      });
    }, 500);
  });
};

/**
 * Verifica el estado de las actualizaciones de seguridad
 * @returns {Promise<Object>} Estado de las actualizaciones
 */
export const checkSecurityUpdates = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatesAvailable = Math.floor(Math.random() * 15);
      
      resolve({
        lastChecked: new Date(),
        updatesAvailable,
        criticalUpdates: Math.floor(updatesAvailable * 0.3),
        importantUpdates: Math.floor(updatesAvailable * 0.4),
        moderateUpdates: Math.floor(updatesAvailable * 0.2),
        lowUpdates: updatesAvailable - Math.floor(updatesAvailable * 0.3) - 
                   Math.floor(updatesAvailable * 0.4) - Math.floor(updatesAvailable * 0.2)
      });
    }, 800);
  });
};

/**
 * Analiza la configuración de seguridad del navegador
 * @returns {Promise<Object>} Configuración de seguridad
 */
export const analyzeBrowserSecurity = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        https: window.location.protocol === 'https:',
        cookies: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes',
        javascript: true, // Siempre true en este contexto
        popups: true, // Simulado
        fingerprintingProtection: Math.random() > 0.5,
        webGL: Math.random() > 0.3,
        plugins: Math.random() > 0.6
      });
    }, 400);
  });
};

/**
 * Realiza un escaneo completo de seguridad
 * @returns {Promise<Object>} Resultados del escaneo completo
 */
export const runFullSecurityScan = async () => {
  const [
    openPorts,
    vulnerabilities, 
    firewallStatus,
    securityUpdates,
    browserSecurity
  ] = await Promise.all([
    scanOpenPorts(),
    scanVulnerabilities(),
    checkFirewallStatus(),
    checkSecurityUpdates(),
    analyzeBrowserSecurity()
  ]);
  
  // Calcular puntuación de seguridad
  let securityScore = 100;
  
  // Penalizar por puertos abiertos de alto riesgo
  securityScore -= openPorts.filter(p => p.risk === 'high').length * 5;
  securityScore -= openPorts.filter(p => p.risk === 'medium').length * 2;
  
  // Penalizar por vulnerabilidades
  vulnerabilities.forEach(vuln => {
    if (vuln.severity === 'critical') securityScore -= 10;
    else if (vuln.severity === 'high') securityScore -= 7;
    else if (vuln.severity === 'medium') securityScore -= 4;
    else securityScore -= 1;
  });
  
  // Penalizar si el firewall está inactivo
  if (!firewallStatus.active) securityScore -= 15;
  
  // Penalizar por actualizaciones críticas pendientes
  securityScore -= securityUpdates.criticalUpdates * 3;
  
  // Asegurar que el score esté entre 0 y 100
  securityScore = Math.max(0, Math.min(100, securityScore));
  
  return {
    timestamp: new Date(),
    securityScore,
    openPorts,
    vulnerabilities,
    firewallStatus,
    securityUpdates,
    browserSecurity,
    overallStatus: securityScore >= 80 ? 'secure' : 
                  securityScore >= 60 ? 'moderate' : 'insecure'
  };
};

/**
 * Obtiene recomendaciones de seguridad basadas en los resultados del escaneo
 * @param {Object} scanResults - Resultados del escaneo de seguridad
 * @returns {Array} Recomendaciones de seguridad
 */
export const getSecurityRecommendations = (scanResults) => {
  const recommendations = [];
  
  if (!scanResults.firewallStatus.active) {
    recommendations.push({
      priority: 'high',
      action: 'Activar firewall',
      description: 'El firewall del sistema está desactivado, lo que expone su equipo a amenazas de red.'
    });
  }
  
  if (scanResults.securityUpdates.criticalUpdates > 0) {
    recommendations.push({
      priority: 'high',
      action: 'Instalar actualizaciones críticas',
      description: `Hay ${scanResults.securityUpdates.criticalUpdates} actualizaciones críticas pendientes.`
    });
  }
  
  const highRiskPorts = scanResults.openPorts.filter(p => p.risk === 'high');
  if (highRiskPorts.length > 0) {
    recommendations.push({
      priority: 'high',
      action: 'Cerrar puertos de alto riesgo',
      description: `Se detectaron ${highRiskPorts.length} puertos de alto riesgo abiertos.`
    });
  }
  
  const criticalVulnerabilities = scanResults.vulnerabilities.filter(v => v.severity === 'critical');
  if (criticalVulnerabilities.length > 0) {
    recommendations.push({
      priority: 'high',
      action: 'Resolver vulnerabilidades críticas',
      description: `Se detectaron ${criticalVulnerabilities.length} vulnerabilidades críticas.`
    });
  }
  
  if (!scanResults.browserSecurity.https) {
    recommendations.push({
      priority: 'medium',
      action: 'Usar HTTPS',
      description: 'La conexión no está usando HTTPS, lo que puede exponer datos sensibles.'
    });
  }
  
  if (scanResults.securityUpdates.importantUpdates > 0) {
    recommendations.push({
      priority: 'medium',
      action: 'Instalar actualizaciones importantes',
      description: `Hay ${scanResults.securityUpdates.importantUpdates} actualizaciones importantes pendientes.`
    });
  }
  
  // Recomendaciones generales
  recommendations.push({
    priority: 'low',
    action: 'Realizar copias de seguridad regularmente',
    description: 'Mantenga copias de seguridad actualizadas de sus datos importantes.'
  });
  
  recommendations.push({
    priority: 'low',
    action: 'Usar autenticación de dos factores',
    description: 'Habilite la autenticación de dos factores en todos los servicios posibles.'
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

export default {
  scanOpenPorts,
  scanVulnerabilities,
  checkFirewallStatus,
  checkSecurityUpdates,
  analyzeBrowserSecurity,
  runFullSecurityScan,
  getSecurityRecommendations
};