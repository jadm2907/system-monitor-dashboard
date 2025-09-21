// Simulación de servicio de procesos
export const getRunningProcesses = async () => {
  // Simular una llamada a una API o al sistema
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generar procesos de ejemplo
  const processNames = [
    'chrome.exe', 'firefox.exe', 'code.exe', 'node.exe', 'explorer.exe',
    'svchost.exe', 'wininit.exe', 'services.exe', 'lsass.exe', 'spotify.exe',
    'discord.exe', 'steam.exe', 'msedge.exe', 'notepad.exe', 'taskmgr.exe'
  ];
  
  return Array.from({ length: 15 }, (_, i) => ({
    pid: Math.floor(1000 + Math.random() * 9000),
    name: processNames[Math.floor(Math.random() * processNames.length)],
    cpu: Math.random() * 30,
    memory: Math.random() * 20,
    user: 'SYSTEM'
  }));
};

export const killProcess = async (pid) => {
  // Simular la terminación de un proceso
  console.log(`Terminando proceso ${pid}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.random() > 0.1; // Simular éxito/fallo
};