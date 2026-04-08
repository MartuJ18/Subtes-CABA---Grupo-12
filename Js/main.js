/**
 * FUENTE DE DATOS (Nuestra "Base de Datos" local)
 * Centralizamos la info para que si cambia un color o nombre, 
 * se actualice en toda la web automáticamente.
 */
const lineasData = [
    { nombre: "Línea A", color: "#00B4D8", recorrido: "Plaza de Mayo — San Pedrito" },
    { nombre: "Línea B", color: "#E63946", recorrido: "Leandro N. Alem — J.M. de Rosas" },
    { nombre: "Línea C", color: "#1D4E89", recorrido: "Retiro — Constitución" },
    { nombre: "Línea D", color: "#2DC653", recorrido: "Catedral — Congreso de Tucumán" },
    { nombre: "Línea E", color: "#7B2FBE", recorrido: "Retiro — Plaza de los Virreyes" },
    { nombre: "Línea H", color: "#FFD700", recorrido: "Facultad de Derecho — Hospitales", textColor: "#000" }
];

const estadosPosibles = ["Normal", "Demoras", "Interrumpido"];

/**
 * FUNCIÓN PRINCIPAL
 * Se ejecuta cuando el navegador termina de cargar el HTML.
 */
function inicializarSitio() {
    
    // --- 1. LÓGICA DEL FOOTER (INFO BAR) ---
    // Busca las etiquetas con clase .info-value en cualquier página
    const infoValues = document.querySelectorAll('.info-value');
    if (infoValues.length >= 2) {
        // Simulamos datos dinámicos para el footer
        infoValues[0].innerText = "Normal"; 
        infoValues[1].innerText = Math.floor(Math.random() * 5 + 3) + " min";
    }

    // --- 2. LÓGICA PARA: estado_servicio.html ---
    // Busca el contenedor con id="lineas"
    const contenedorEstado = document.getElementById("lineas");
    if (contenedorEstado) {
        contenedorEstado.innerHTML = ""; // Limpiamos el "Cargando..."
        
        lineasData.forEach(linea => {
            // Elegimos un estado al azar para cada línea
            const estadoRandom = estadosPosibles[Math.floor(Math.random() * estadosPosibles.length)];
            
            // Creamos el elemento HTML dinámicamente
            const item = document.createElement("div");
            item.classList.add("line-item");
            
            item.innerHTML = `
                <span class="line-badge" style="background:${linea.color}; color:${linea.textColor || '#fff'}">
                    ${linea.nombre.replace("Línea ", "")}
                </span>
                <div class="line-info">
                    <h3>${linea.nombre}</h3>
                    <p>${estadoRandom}</p>
                </div>
            `;
            contenedorEstado.appendChild(item);
        });
    }

    // --- 3. LÓGICA PARA: lineas_estaciones.html ---
    // Busca el contenedor con id="lista-lineas-estatica"
    const contenedorLista = document.getElementById("lista-lineas-estatica");
    if (contenedorLista) {
        contenedorLista.innerHTML = "";
        
        lineasData.forEach(linea => {
            const item = document.createElement("div");
            item.classList.add("line-item");
            
            item.innerHTML = `
                <span class="line-badge" style="background:${linea.color}; color:${linea.textColor || '#fff'}">
                    ${linea.nombre.replace("Línea ", "")}
                </span>
                <div class="line-info">
                    <h3>${linea.nombre}</h3>
                    <p>${linea.recorrido}</p>
                </div>
            `;
            contenedorLista.appendChild(item);
        });
    }
}

// Escuchador de evento para iniciar todo al cargar la ventana
window.onload = inicializarSitio;