import json
from pathlib import Path
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from pypdf import PdfReader

load_dotenv()

RUTA_PDF = Path(__file__).parent / "ecuaciones_lineales.pdf"

# Fallback robusto offline curado pedagógicamente según el programa de secundaria y bachillerato
FLASHCARDS_FALLBACK = {
    "basico": [
        {
            "id": 1,
            "category": "Definición Clave",
            "front": "¿Qué es una ecuación lineal de primer grado?",
            "back": "Es una igualdad matemática que involucra una o más variables elevadas únicamente a la potencia 1 (sin exponentes cuadráticos ni cúbicos).",
            "hint": "Imagina una balanza equilibrada donde ambos platillos pesan lo mismo.",
            "level": "basico"
        },
        {
            "id": 2,
            "category": "Operaciones Inversas",
            "front": "Si un número está SUMANDO en un lado de la ecuación, ¿cómo pasa al otro lado?",
            "back": "Pasa con la operación contraria: RESTANDO. En realidad, se resta esa misma cantidad en ambos lados para mantener la igualdad.",
            "hint": "¿Qué deshace una suma?",
            "level": "basico"
        },
        {
            "id": 3,
            "category": "Operaciones Inversas",
            "front": "En la ecuación 3x = 15, ¿qué operación debes realizar para despejar x?",
            "back": "Debes DIVIDIR ambos lados entre 3, ya que el 3 está multiplicando a la x (x = 15 / 3 = 5).",
            "hint": "El 3 está pegado a la x multiplicándola.",
            "level": "basico"
        },
        {
            "id": 4,
            "category": "Partes de la Ecuación",
            "front": "¿Cuál es la diferencia entre un término con variable y un término independiente?",
            "back": "El término con variable tiene letra (ej: 4x, -2y). El término independiente es solo un número fijo sin letras (ej: +7, -10).",
            "hint": "Fíjate si el número está acompañado por la incógnita o si está solo.",
            "level": "basico"
        },
        {
            "id": 5,
            "category": "Comprobación",
            "front": "¿Cómo compruebas si el valor que obtuviste para x es correcto?",
            "back": "Sustituyes el valor de x en la ecuación original y verificas que el lado izquierdo sea exactamente igual al lado derecho.",
            "hint": "Cambia la letra por tu número y haz las cuentas.",
            "level": "basico"
        }
    ],
    "intermedio": [
        {
            "id": 1,
            "category": "Agrupación de Términos",
            "front": "En la ecuación 5x - 8 = 2x + 7, ¿cuál es el primer paso estratégico para resolverla?",
            "back": "Agrupar los términos con 'x' en un solo miembro (por ejemplo a la izquierda: 5x - 2x) y los términos independientes al otro (7 + 8).",
            "hint": "Reúne las incógnitas de un lado y los números del otro.",
            "level": "intermedio"
        },
        {
            "id": 2,
            "category": "Propiedad Distributiva",
            "front": "¿Cómo se resuelve una ecuación con paréntesis como 3(x - 4) = 18?",
            "back": "Se aplica la propiedad distributiva multiplicando el 3 por cada término dentro del paréntesis: 3x - 12 = 18, y luego se despeja x = 10.",
            "hint": "Multiplica el de afuera por cada uno de los de adentro.",
            "level": "intermedio"
        },
        {
            "id": 3,
            "category": "Signos y Paréntesis",
            "front": "¿Qué ocurre con los signos cuando hay un signo menos antes de un paréntesis: -(2x - 5)?",
            "back": "Todos los términos interiores cambian de signo al eliminar el paréntesis: resulta -2x + 5.",
            "hint": "El signo menos multiplica por -1 a todo lo que está dentro.",
            "level": "intermedio"
        },
        {
            "id": 4,
            "category": "Ecuaciones Fraccionarias Simples",
            "front": "En (x + 2) / 4 = 3, ¿qué paso elimina la fracción de inmediato?",
            "back": "Multiplicar ambos lados de la igualdad por el denominador 4: x + 2 = 12, por lo tanto x = 10.",
            "hint": "El 4 divide a todo el miembro izquierdo.",
            "level": "intermedio"
        },
        {
            "id": 5,
            "category": "Modelado de Problemas",
            "front": "Si el triple de la edad de Juan aumentado en 5 años es 26, ¿cuál es la ecuación?",
            "back": "La ecuación es 3x + 5 = 26. Al despejar: 3x = 21 -> x = 7 años.",
            "hint": "'Triple' = multiplicar por 3; 'aumentado' = sumar.",
            "level": "intermedio"
        }
    ],
    "avanzado": [
        {
            "id": 1,
            "category": "Mínimo Común Múltiplo (MCM)",
            "front": "¿Cómo se resuelve una ecuación lineal con varios denominadores como x/2 + x/3 = 5?",
            "back": "Se multiplica toda la ecuación por el MCM de los denominadores (MCM de 2 y 3 es 6): 6(x/2) + 6(x/3) = 6(5) -> 3x + 2x = 30 -> 5x = 30 -> x = 6.",
            "hint": "Busca el múltiplo común más pequeño para cancelar todas las fracciones de un solo golpe.",
            "level": "avanzado"
        },
        {
            "id": 2,
            "category": "Casos Especiales: Sin Solución",
            "front": "¿Cuándo se dice que una ecuación lineal NO tiene solución (es inconsistente)?",
            "back": "Cuando al simplificar se cancelan las variables y se llega a una falsedad matemática, como 0 = 7 (por ejemplo: 2x + 3 = 2x + 10).",
            "hint": "Las líneas en la gráfica son paralelas y nunca se cruzan.",
            "level": "avanzado"
        },
        {
            "id": 3,
            "category": "Casos Especiales: Infinitas Soluciones",
            "front": "¿Qué es una identidad algebraica y cuántas soluciones tiene?",
            "back": "Es una igualdad que se cumple para CUALQUIER valor de x (ej: 2(x + 1) = 2x + 2 -> 0 = 0). Tiene infinitas soluciones.",
            "hint": "Ambos lados de la ecuación son idénticos.",
            "level": "avanzado"
        },
        {
            "id": 4,
            "category": "Ecuaciones Literales",
            "front": "¿Cómo despejas la variable 'x' en la ecuación literal ax + b = c (donde a ≠ 0)?",
            "back": "Primero restas b: ax = c - b. Luego divides entre el coeficiente a: x = (c - b) / a.",
            "hint": "Trata a las letras a, b y c como si fueran números fijos.",
            "level": "avanzado"
        },
        {
            "id": 5,
            "category": "Propiedades de la Igualdad",
            "front": "¿Cuál es la justificación formal para multiplicar una ecuación por una cantidad negativa?",
            "back": "La propiedad multiplicativa de la igualdad: si a = b, entonces a * c = b * c para todo c ≠ 0. Si c = -1, los signos de ambos lados se invierten simultáneamente.",
            "hint": "La igualdad se preserva siempre que la misma operación uniforme se aplique en ambos miembros.",
            "level": "avanzado"
        }
    ]
}


def extraer_texto_pdf() -> str:
    if not RUTA_PDF.exists():
        return ""
    try:
        reader = PdfReader(RUTA_PDF)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception as e:
        print(f"Error leyendo PDF: {e}")
        return ""


def generar_flashcards(nivel: str = "intermedio", tema: str = "ecuaciones lineales") -> list:
    nivel_normalizado = nivel.lower()
    if "bás" in nivel_normalizado or "bas" in nivel_normalizado:
        nivel_clave = "basico"
    elif "avan" in nivel_normalizado:
        nivel_clave = "avanzado"
    else:
        nivel_clave = "intermedio"

    texto_pdf = extraer_texto_pdf()

    try:
        llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0.2, max_tokens=1000)

        prompt_sistema = f"""
Eres un especialista en diseño pedagógico interactivo para educación secundaria y bachillerato en México.
Tu tarea es generar un conjunto de exactamente 5 a 6 flashcards interactivas de estudio sobre '{tema}', adaptadas al nivel '{nivel_clave.upper()}'.

Directrices por nivel:
- BASICO: Conceptos elementales, lenguaje muy claro, metáforas cotidianas, despejes directos de un paso con números enteros, sin tecnicismos excesivos.
- INTERMEDIO: Ecuaciones con paréntesis, términos a ambos lados de la igualdad, simplificación de términos semejantes, modelado verbal.
- AVANZADO: Ecuaciones con fracciones y MCM, ecuaciones literales, identidades vs contradicciones (sin solución o infinitas soluciones), justificación rigurosa de propiedades.

Formato de respuesta:
Debes responder ÚNICAMENTE con un arreglo JSON válido (sin código markdown ni explicaciones adicionales), con esta estructura exacta para cada tarjeta:
[
  {{
    "id": 1,
    "category": "Categoría breve (ej: Concepto Clave, Procedimiento, Truco)",
    "front": "¿Pregunta o concepto a reflexionar?",
    "back": "Explicación clara, directa y fundamentada.",
    "hint": "Pista mnemotécnica o sugerencia breve.",
    "level": "{nivel_clave}"
  }}
]
"""
        mensaje_usuario = f"Material de apoyo de la clase:\n{texto_pdf[:2500]}\n\nGenera las flashcards para el nivel: {nivel_clave}"

        respuesta = llm.invoke([
            SystemMessage(content=prompt_sistema),
            HumanMessage(content=mensaje_usuario)
        ])

        contenido = respuesta.content.strip()
        # Limpiamos bloques markdown si vinieran envueltos en ```json ... ```
        if contenido.startswith("```"):
            lineas = contenido.splitlines()
            if lineas[0].startswith("```"):
                lineas = lineas[1:]
            if lineas and lineas[-1].startswith("```"):
                lineas = lineas[:-1]
            contenido = "\n".join(lineas).strip()

        datos = json.loads(contenido)
        if isinstance(datos, list) and len(datos) > 0:
            return datos
    except Exception as e:
        print(f"[agente_flashcards] Aviso: Usando flashcards de alta fidelidad curadas para '{nivel_clave}': {e}")

    return FLASHCARDS_FALLBACK.get(nivel_clave, FLASHCARDS_FALLBACK["intermedio"])


if __name__ == "__main__":
    print("Probando generador de flashcards:")
    for n in ["basico", "intermedio", "avanzado"]:
        cards = generar_flashcards(n)
        print(f"Nivel {n}: {len(cards)} tarjetas generadas.")
