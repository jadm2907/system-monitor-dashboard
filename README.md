
# system-monitor-dashboard

Sistema de monitoreo y gestión para Debian con interfaz web moderna.

!# System Monitor Dashboard

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Debian](https://img.shields.io/badge/Debian-A81D33?style=for-the-badge&logo=debian&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![REST API](https://img.shields.io/badge/REST-API-ff69b4?style=for-the-badge)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Design-green?style=for-the-badge)
![Dashboard](https://img.shields.io/badge/Dashboard-UI-important?style=for-the-badge)

![GitHub last commit](https://img.shields.io/github/last-commit/jadm2907/system-monitor-dashboard?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/jadm2907/system-monitor-dashboard?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/jadm2907/system-monitor-dashboard?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/jadm2907/system-monitor-dashboard?style=for-the-badge)

## ✨ Características

### 📊 Monitoreo en Tiempo Real
- **Uso de CPU**: Gráficos en tiempo real del consumo de procesador
- **Memoria RAM**: Monitoreo de uso y disponibilidad de memoria
- **Almacenamiento**: Visualización del espacio en discos y particiones
- **Procesos**: Lista de procesos en ejecución con consumo de recursos

### 🌐 Gestión de Red
- **Estadísticas de red**: Tráfico entrante y saliente
- **Conexiones activas**: Monitorización de puertos y conexiones
- **Ancho de banda**: Velocidad de subida y bajada en tiempo real

### 🔒 Seguridad del Sistema
- **Estado del firewall**: Verificación del cortafuegos
- **Escaneo de vulnerabilidades**: Detección de posibles problemas de seguridad
- **Protección del navegador**: Análisis de configuración de seguridad
- **Actualizaciones**: Estado de parches y actualizaciones de seguridad

### ⚙️ Mantenimiento y Optimización
- **Recomendaciones**: Sugerencias automáticas para mejorar el rendimiento
- **Limpieza de caché**: Herramientas para liberar espacio
- **Gestión de procesos**: Terminación de procesos problemáticos
- **Optimización de memoria**: Herramientas de gestión de RAM

### 🎨 Interfaz Moderna
- **Dashboard responsive**: Adaptable a diferentes dispositivos
- **Visualizaciones intuitivas**: Gráficos y métricas fáciles de entender
- **Panel lateral**: Navegación rápida entre secciones
- **Tema claro/oscuro**: Interfaz adaptable a preferencias del usuario

## 🚀 Instalación Rápida

### Prerrequisitos
```bash
# Node.js 14 o superior
sudo apt update
sudo apt install nodejs npm

# Verificar instalación
node --version
npm --version
```

### Clonar e Instalar
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd system-monitor-dashboard

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

### Construcción para Producción
```bash
# Crear versión optimizada
npm run build

# La carpeta 'build' contendrá los archivos listos para producción
```

## 📦 Estructura del Proyecto

```
system-monitor-dashboard/
├── public/                 # Archivos públicos
│   ├── index.html         # HTML principal
│   └── favicon.ico        # Icono de la aplicación
├── src/
│   ├── components/        # Componentes React
│   │   ├── Dashboard.jsx  # Componente principal
│   │   ├── HardwarePanel.jsx # Panel de hardware
│   │   ├── SecurityPanel.jsx # Panel de seguridad
│   │   ├── NetworkPanel.jsx  # Panel de red
│   │   ├── ProcessesPanel.jsx # Panel de procesos
│   │   ├── MaintenancePanel.jsx # Panel de mantenimiento
│   │   ├── RealTimeCharts.jsx # Gráficos tiempo real
│   │   ├── Sidebar.jsx    # Barra lateral
│   │   └── SystemOverview.jsx # Vista general
│   ├── services/          # Servicios de datos
│   │   ├── systemService.js  # Datos del sistema
│   │   ├── securityService.js # Servicios de seguridad
│   │   ├── networkService.js # Servicios de red
│   │   └── processService.js # Gestión de procesos
│   ├── utils/             # Utilidades
│   │   ├── helpers.js     # Funciones auxiliares
│   │   ├── securityScans.js # Escaneos de seguridad
│   │   └── maintenanceChecker.js # Verificación mantenimiento
│   ├── styles/            # Estilos CSS
│   │   ├── App.css        # Estilos principales
│   │   ├── Dashboard.css  # Estilos del dashboard
│   │   └── Components.css # Estilos de componentes
│   ├── App.js             # Componente principal
│   └── index.js           # Punto de entrada
├── package.json           # Dependencias del proyecto
└── README.md             # Documentación
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, CSS3, HTML5
- **Visualización**: Gráficos personalizados en tiempo real
- **Gestión de Estado**: React Hooks (useState, useEffect)
- **Utilidades**: Funciones personalizadas para manejo de datos
- **Compatibilidad**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 📋 Funcionalidades Detalladas

### Panel de Hardware
- Información detallada del procesador
- Uso de memoria RAM en tiempo real
- Estado de discos y almacenamiento
- Información de tarjeta gráfica

### Panel de Seguridad
- Estado del firewall y antivirus
- Detección de vulnerabilidades
- Configuración de seguridad del navegador
- Recomendaciones de seguridad

### Panel de Red
- Dirección IP y configuración de red
- Estadísticas de tráfico
- Puertos abiertos y conexiones
- Velocidad de conexión

### Panel de Procesos
- Lista de procesos en ejecución
- Consumo de CPU y memoria por proceso
- Opciones para terminar procesos
- Filtrado y ordenamiento

### Panel de Mantenimiento
- Recomendaciones de optimización
- Herramientas de limpieza
- Gestión de actualizaciones
- Reportes de estado del sistema

## 🔧 Configuración

El proyecto incluye configuración para:

- **Variables de entorno**: Configuración adaptable
- **Estilos personalizables**: Temas y colores
- **Intervalos de actualización**: Configuración de polling
- **Opciones de visualización**: Personalización de dashboards

## 🌐 Despliegue

### Desarrollo
```bash
npm start
# Abre http://localhost:3000
```

### Producción
```bash
npm run build
# Sirve los archivos de la carpeta 'build'
```

### Docker (Opcional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🎯 Roadmap

- [ ] Integración con API del sistema real
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Exportación de reportes
- [ ] App móvil complementaria
- [ ] Plugins y extensiones

---

**¿Te gusta el proyecto? ¡Dale una estrella ⭐ en GitHub!**

Desarrollado con ❤️ para la comunidad Debian

