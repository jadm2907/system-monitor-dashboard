export const checkMaintenanceNeeds = (systemData, performanceData) => {
  const tips = [];
  
  // Verificar uso alto de CPU
  if (performanceData.cpuUsage > 80) {
    tips.push({
      message: "El uso de CPU es elevado. Considere cerrar aplicaciones innecesarias.",
      priority: "high",
      action: "Optimizar",
      actionType: "processes"
    });
  }
  
  // Verificar uso alto de memoria
  if (performanceData.memoryUsage > 85) {
    tips.push({
      message: "La memoria RAM está casi llena. Esto puede ralentizar el sistema.",
      priority: "high",
      action: "Liberar memoria",
      actionType: "memory"
    });
  }
  
  // Verificar uso alto de disco
  if (performanceData.diskUsage > 90) {
    tips.push({
      message: "El espacio en disco está casi agotado. Libere espacio para evitar problemas.",
      priority: "high",
      action: "Liberar espacio",
      actionType: "disk"
    });
  } else if (performanceData.diskUsage > 75) {
    tips.push({
      message: "El espacio en disco se está agotando. Considere limpiar archivos temporales.",
      priority: "medium",
      action: "Limpiar",
      actionType: "disk"
    });
  }
  
  // Verificar tiempo de actividad prolongado
  if (performanceData.uptime > 86400) { // Más de 24 horas
    tips.push({
      message: "El sistema no se ha reiniciado en más de 24 horas. Un reinicio puede mejorar el rendimiento.",
      priority: "low",
      action: "Reiniciar",
      actionType: "reboot"
    });
  }
  
  // Verificar si el navegador tiene muchas pestañas abiertas (simulado)
  if (Math.random() > 0.7) {
    tips.push({
      message: "Se detectaron muchas pestañas abiertas en el navegador. Cierre las que no esté usando.",
      priority: "medium",
      action: "Cerrar pestañas",
      actionType: "browser"
    });
  }
  
  return tips;
};