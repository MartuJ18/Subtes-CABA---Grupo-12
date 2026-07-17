/* =====================================================================
   CONSULTA DE VIAJES — Datos simulados
   Calcula: transporte recomendado, andén/sector, tiempo y costo estimado.
   Todos los valores son SIMULADOS con fines académicos.
===================================================================== */

/* --- Parámetros simulados --- */
const TARIFA_BASE = 757;        // Tarifa simulada por viaje (SUBE)
const MIN_POR_ESTACION = 2.2;   // Minutos simulados entre estaciones

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

/* --- Utilidades --- */
function indiceEnLinea(estacion) {
    const deLaLinea = ESTACIONES.filter(e => e.l === estacion.l);
    return deLaLinea.findIndex(e => e.n === estacion.n);
}

function sentido(linea, idxOrigen, idxDestino) {
    const t = TERMINALES[linea];
    return idxDestino > idxOrigen ? t[1] : t[0];
}

/* --- Poblar el <select> de líneas --- */
function poblarLineas() {
    const selLinea = document.getElementById("linea");
    if (!selLinea) return;

    Object.keys(TERMINALES).forEach(l => {
        selLinea.add(new Option(`Línea ${l}`, l));
    });
}

/* --- Poblar los <select> de origen/destino según la línea elegida --- */
function poblarEstaciones(linea) {
    const selOrigen = document.getElementById("origen");
    const selDestino = document.getElementById("destino");
    if (!selOrigen || !selDestino) return;

    selOrigen.innerHTML = "";
    selDestino.innerHTML = "";

    if (!linea) {
        selOrigen.add(new Option("Elegí primero una línea...", ""));
        selDestino.add(new Option("Elegí primero una línea...", ""));
        selOrigen.disabled = true;
        selDestino.disabled = true;
        return;
    }

    selOrigen.add(new Option("Elegí una estación...", ""));
    selDestino.add(new Option("Elegí una estación...", ""));

    ESTACIONES.filter(e => e.l === linea).forEach(e => {
        selOrigen.add(new Option(e.n, e.n));
        selDestino.add(new Option(e.n, e.n));
    });

    selOrigen.disabled = false;
    selDestino.disabled = false;
}

/* --- Calcular y mostrar el resultado --- */
function calcularViaje() {
    const selLinea = document.getElementById("linea");
    const selOrigen = document.getElementById("origen");
    const selDestino = document.getElementById("destino");
    const cont = document.getElementById("resultado");

    if (!selLinea.value || !selOrigen.value || !selDestino.value) {
        cont.classList.remove("hidden");
        cont.innerHTML = `<p class="error-msg">Elegí una línea, una estación de origen y una de destino.</p>`;
        return;
    }

    if (selOrigen.value === selDestino.value) {
        cont.classList.remove("hidden");
        cont.innerHTML = `<p class="error-msg">El origen y el destino son la misma estación. Elegí destinos distintos.</p>`;
        return;
    }

    const linea = selLinea.value;
    const nOrigen = selOrigen.value;
    const nDestino = selDestino.value;

    const idxO = indiceEnLinea({ n: nOrigen, l: linea });
    const idxD = indiceEnLinea({ n: nDestino, l: linea });

    const tramos = Math.abs(idxD - idxO);
    const tiempo = Math.round(tramos * MIN_POR_ESTACION + 2);
    const transporte = `Línea ${linea} (directo)`;
    const anden = `Andén Línea ${linea} — sentido ${sentido(linea, idxO, idxD)}`;
    const costo = TARIFA_BASE; // tarifa plana simulada

    cont.classList.remove("hidden");
    cont.innerHTML = `
        <div class="resultado-titulo">Resultado de tu viaje</div>
        <div class="resultado-ruta">${nOrigen} &rarr; ${nDestino}</div>

        <div class="resultado-grid">
            <div class="dato-card">
                <div class="dato-label">Transporte recomendado</div>
                <div class="dato-valor">${transporte}</div>
                <div class="dato-extra">No requiere combinación</div>
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

        <p class="resultado-aviso">* Datos simulados con fines académicos. Tiempos y tarifas son aproximados.</p>
    `;
    cont.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* --- Inicio --- */
window.addEventListener("DOMContentLoaded", () => {
    poblarLineas();
    poblarEstaciones("");

    const selLinea = document.getElementById("linea");
    if (selLinea) {
        selLinea.addEventListener("change", () => {
            poblarEstaciones(selLinea.value);
            const cont = document.getElementById("resultado");
            if (cont) cont.classList.add("hidden");
        });
    }

    const boton = document.getElementById("btn-buscar");
    if (boton) boton.addEventListener("click", calcularViaje);
});
