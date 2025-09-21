/**
 * Utilidades generales para el dashboard de monitoreo del sistema
 */

/**
 * Formatea bytes a un formato legible (KB, MB, GB, TB)
 * @param {number} bytes - Bytes a formatear
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} String formateado
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Formatea porcentajes con un número específico de decimales
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 1) => {
  return value.toFixed(decimals) + '%';
};

/**
 * Obtiene el color basado en el valor de un porcentaje
 * @param {number} value - Valor porcentual
 * @param {number} warningThreshold - Umbral de advertencia
 * @param {number} criticalThreshold - Umbral crítico
 * @returns {string} Clase CSS para el color
 */
export const getPercentageColor = (value, warningThreshold = 70, criticalThreshold = 90) => {
  if (value >= criticalThreshold) return 'bad';
  if (value >= warningThreshold) return 'warning';
  return 'good';
};

/**
 * Simula la obtención de la dirección IP local
 * @returns {Promise<string>} Dirección IP
 */
export const getLocalIP = async () => {
  // En un entorno real, esto se obtendría de una API o del sistema
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simular una dirección IP aleatoria
      const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      resolve(ip);
    }, 100);
  });
};

/**
 * Calcula el tiempo transcurrido desde una fecha
 * @param {Date} date - Fecha de inicio
 * @returns {string} Tiempo transcurrido formateado
 */
export const getTimeElapsed = (date) => {
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function para limitar la frecuencia de ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounce
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Ordena un array de objetos por una propiedad específica
 * @param {Array} array - Array a ordenar
 * @param {string} key - Clave por la que ordenar
 * @param {boolean} ascending - Orden ascendente o descendente
 * @returns {Array} Array ordenado
 */
export const sortByKey = (array, key, ascending = true) => {
  return array.sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Filtra un array de procesos por nombre o PID
 * @param {Array} processes - Array de procesos
 * @param {string} query - Texto de búsqueda
 * @returns {Array} Procesos filtrados
 */
export const filterProcesses = (processes, query) => {
  if (!query) return processes;
  
  const lowerQuery = query.toLowerCase();
  return processes.filter(process => 
    process.name.toLowerCase().includes(lowerQuery) || 
    process.pid.toString().includes(lowerQuery)
  );
};

/**
 * Valida si una dirección IP es válida
 * @param {string} ip - Dirección IP a validar
 * @returns {boolean} True si es válida
 */
export const isValidIP = (ip) => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

/**
 * Obtiene el sistema operativo del userAgent
 * @returns {string} Sistema operativo detectado
 */
export const detectOS = () => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  
  if (/Windows/.test(platform)) return 'Windows';
  if (/Mac/.test(platform)) return 'macOS';
  if (/Linux/.test(platform)) return 'Linux';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iOS|iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
  
  return 'Unknown';
};

export default {
  formatBytes,
  formatPercentage,
  getPercentageColor,
  getLocalIP,
  getTimeElapsed,
  generateId,
  debounce,
  sortByKey,
  filterProcesses,
  isValidIP,
  detectOS
};