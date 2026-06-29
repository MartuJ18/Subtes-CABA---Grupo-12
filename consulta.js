/* =====================================================================
   CONSULTA DE VIAJES — Datos simulados
   Calcula: transporte recomendado, andén/sector, tiempo y costo estimado.
   Todos los valores son SIMULADOS con fines académicos.
===================================================================== */

/* --- Parámetros simulados --- */
const TARIFA_BASE = 757;        // Tarifa simulada por viaje (SUBE)
const MIN_POR_ESTACION = 2.2;   // Minutos simulados entre estaciones
const PENAL_TRANSBORDO = 6;     // Minutos extra simulados por combinación

/* --- Terminales de cada línea (para indicar sentido/andén) --- */
const TERMINALES = {
    A: ["Plaza de Mayo", "San Pedrito"],
    B: ["L. N. Alem", "J. M. de Rosas"],
    C: ["Retiro", "Constitución"],
    D: ["Catedral", "Congreso de Tucumán"],
    E: ["Bolívar", "Plaza de los Virreyes"],
    H: ["Facultad de Derecho", "Hospitales"]
};

const COLOR_LINEA = {
    A: "#00B4D8", B: "#E63946", C: "#0078C1",
    D: "#2DC653", E: "#6F2B8C", H: "#F5B700"
};

/* --- Estaciones (orden = posición en la línea) --- */
const ESTACIONES = [
    // Línea A
    { n: "Plaza de Mayo", l: "A" }, { n: "Perú", l: "A" }, { n: "Lima", l: "A" },
    { n: "Congreso", l: "A" }, { n: "Primera Junta", l: "A" }, { n: "San Pedrito", l: "A" },
    // Línea B
    { n: "L. N. Alem", l: "B" }, { n: "Carlos Pellegrini", l: "B" }, { n: "Callao", l: "B" },
    { n: "Medrano", l: "B" }, { n: "Federico Lacroze", l: "B" }, { n: "J. M. de Rosas", l: "B" },
    // Línea C
    { n: "Retiro", l: "C" }, { n: "Diagonal Norte", l: "C" }, { n: "Avenida de Mayo", l: "C" },
    { n: "Independencia (C)", l: "C" }, { n: "San Juan", l: "C" }, { n: "Constitución", l: "C" },
    // Línea D
    { n: "Catedral", l: "D" }, { n: "9 de Julio", l: "D" }, { n: "Tribunales", l: "D" },
    { n: "Pueyrredón (D)", l: "D" }, { n: "Palermo", l: "D" }, { n: "Congreso de Tucumán", l: "D" },
    // Línea E
    { n: "Bolívar", l: "E" }, { n: "Independencia (E)", l: "E" }, { n: "San José", l: "E" },
    { n: "Jujuy", l: "E" }, { n: "Boedo", l: "E" }, { n: "Plaza de los Virreyes", l: "E" },
    // Línea H
    { n: "Facultad de Derecho", l: "H" }, { n: "Las Heras", l: "H" }, { n: "Once", l: "H" },
    { n: "Venezuela", l: "H" }, { n: "Caseros", l: "H" }, { n: "Hospitales", l: "H" }
];

/* --- Combinaciones simuladas entre líneas (estación de transbordo) --- */
const COMBINACIONES = {
    "A-C": "Lima / Avenida de Mayo", "A-D": "Perú / Catedral", "A-E": "Plaza de Mayo / Bolívar",
    "A-B": "Lima / Carlos Pellegrini", "A-H": "Congreso / Once",
    "B-C": "Carlos Pellegrini / Diagonal Norte", "B-D": "Carlos Pellegrini / 9 de Julio",
    "B-H": "Callao / Once", "B-E": "Federico Lacroze / Bolívar",
    "C-D": "Diagonal Norte / 9 de Julio", "C-E": "Independencia (C) / Independencia (E)",
    "C-H": "San Juan / Caseros", "D-E": "Catedral / Bolívar", "D-H": "Pueyrredón (D) / Las Heras",
    "E-H": "Jujuy / Once"
};

/* --- Utilidades --- */
function indiceEnLinea(estacion) {
    const deLaLinea = ESTACIONES.filter(e => e.l === estacion.l);
    return deLaLinea.findIndex(e => e.n === estacion.n);
}

function sentido(linea, idxOrigen, idxDestino) {
    const t = TERMINALES[linea];
    return idxDestino > idxOrigen ? t[1] : t[0];
}

function buscarCombinacion(lo, ld) {
    return COMBINACIONES[`${lo}-${ld}`] || COMBINACIONES[`${ld}-${lo}`] || "según cartelería en la estación";
}

/* --- Poblar los <select> --- */
function poblarSelects() {
    const selOrigen = document.getElementById("origen");
    const selDestino = document.getElementById("destino");
    if (!selOrigen || !selDestino) return;

    ESTACIONES.forEach(e => {
        const texto = `${e.n}  (Línea ${e.l})`;
        selOrigen.add(new Option(texto, e.n + "|" + e.l));
        selDestino.add(new Option(texto, e.n + "|" + e.l));
    });
}

/* --- Calcular y mostrar el resultado --- */
function calcularViaje() {
    const selOrigen = document.getElementById("origen");
    const selDestino = document.getElementById("destino");
    const cont = document.getElementById("resultado");

    if (!selOrigen.value || !selDestino.value) {
        cont.classList.remove("hidden");
        cont.innerHTML = `<p class="error-msg">Elegí una estación de origen y una de destino.</p>`;
        return;
    }

    const [nOrigen, lOrigen] = selOrigen.value.split("|");
    const [nDestino, lDestino] = selDestino.value.split("|");

    if (nOrigen === nDestino) {
        cont.classList.remove("hidden");
        cont.innerHTML = `<p class="error-msg">El origen y el destino son la misma estación. Elegí destinos distintos.</p>`;
        return;
    }

    const origen = { n: nOrigen, l: lOrigen };
    const destino = { n: nDestino, l: lDestino };
    const idxO = indiceEnLinea(origen);

    let transporte, anden, combinacion, tiempo, tramos;

    if (lOrigen === lDestino) {
        /* Mismo recorrido: viaje directo */
        const idxD = indiceEnLinea(destino);
        tramos = Math.abs(idxD - idxO);
        tiempo = Math.round(tramos * MIN_POR_ESTACION + 2);
        transporte = `Línea ${lOrigen} (directo)`;
        anden = `Andén Línea ${lOrigen} — sentido ${sentido(lOrigen, idxO, idxD)}`;
        combinacion = "No requiere combinación";
    } else {
        /* Distinta línea: combinación simulada */
        const idxDestEnSuLinea = indiceEnLinea(destino);
        const estTransbordo = Math.ceil(ESTACIONES.filter(e => e.l === lOrigen).length / 2);
        tramos = estTransbordo + idxDestEnSuLinea + 1;
        tiempo = Math.round(tramos * MIN_POR_ESTACION + PENAL_TRANSBORDO);
        transporte = `Línea ${lOrigen} + Línea ${lDestino}`;
        anden = `Andén Línea ${lOrigen} — hacia la combinación`;
        combinacion = "Combiná en: " + buscarCombinacion(lOrigen, lDestino);
    }

    const costo = TARIFA_BASE; // tarifa plana simulada

    cont.classList.remove("hidden");
    cont.innerHTML = `
        <div class="resultado-titulo">Resultado de tu viaje</div>
        <div class="resultado-ruta">${nOrigen} &rarr; ${nDestino}</div>

        <div class="resultado-grid">
            <div class="dato-card">
                <div class="dato-label">Transporte recomendado</div>
                <div class="dato-valor">${transporte}</div>
                <div class="dato-extra">${combinacion}</div>
            </div>
            <div class="dato-card">
                <div class="dato-label">Andén / sector de salida</div>
                <div class="dato-valor" style="font-size:16px">${anden}</div>
            </div>
            <div class="dato-card">
                <div class="dato-label">Tiempo estimado</div>
                <div class="dato-valor">${tiempo} min</div>
                <div class="dato-extra">${tramos} tramos aprox.</div>
            </div>
            <div class="dato-card">
                <div class="dato-label">Costo estimado</div>
                <div class="dato-valor">$${costo.toLocaleString("es-AR")}</div>
                <div class="dato-extra">Tarifa SUBE (simulada)</div>
            </div>
        </div>

        <p class="resultado-aviso">* Datos simulados con fines académicos. Tiempos, andenes y tarifas son aproximados.</p>
    `;
    cont.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* --- Inicio --- */
window.addEventListener("DOMContentLoaded", () => {
    poblarSelects();
    const boton = document.getElementById("btn-buscar");
    if (boton) boton.addEventListener("click", calcularViaje);
});