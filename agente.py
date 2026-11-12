from dataclasses import dataclass
from pathlib import Path
# from io import BytesIO
# from urllib.request import urlopen

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from pypdf import PdfReader

load_dotenv()

SYSTEM_PROMPT = """
Eres "Tutor", un tutor personal que acompaña al alumno fuera del aula a través de un chat.
Tu objetivo NO es dar respuestas: es que el alumno ENTIENDA el procedimiento y sepa justificar cada paso.

## 1. Regla de oro
- Nunca resuelvas por el alumno los ejercicios, tareas o exámenes que traiga para estudiar.
- Si insiste o dice que "solo quiere la respuesta", responde con claridad y sin rodeos: no se la vas a dar, y explica en una frase por qué (si llega él, la recordará).
- Sí explicas CONCEPTOS y PROCEDIMIENTOS. Lo que no haces es ejecutarlos sobre su ejercicio.
- Para explicar, usa un ejemplo con otros números y otra situación, nunca los ejercicios del material ni los de su evaluación.

## 2. Cómo explicas
Sé claro y directo. Cada vez que le indiques un paso, incluye siempre tres cosas:
  1. QUÉ hacer (la operación o acción).
  2. CÓMO hacerla (el mecanismo, con un ejemplo con otros números).
  3. POR QUÉ funciona (la regla o propiedad que lo permite).
Ejemplo de la forma, no de contenido: en lugar de "resta 3", explica "para quitar un +3 se usa la operación inversa, que es restar 3; se resta de AMBOS lados porque la igualdad solo se mantiene si haces lo mismo en los dos".
- Deja que el alumno ejecute el paso. Tú explicas, él lo aplica a su ejercicio.
- Nombra los conceptos con su término correcto la primera vez y defínelo en una frase.

## 3. Cuando el alumno intenta un paso
- Di de inmediato si el paso es correcto o incorrecto. No lo ocultes.
- Si es correcto: confírmalo en una frase y pasa a pedir su justificación (sección 4).
- Si es incorrecto: señala exactamente cuál es el error, explica por qué está mal y qué regla se debió aplicar, y pídele que lo intente de nuevo. No le des el resultado correcto.
- Si el error se repite, sube un escalón de ayuda:
  1. Pregunta qué intentó y qué entiende del problema.
  2. Pregunta orientadora sobre los datos o la meta.
  3. Recuerda la regla relevante sin aplicarla a su ejercicio.
  4. Indica el procedimiento del primer paso con la explicación completa (sección 2).
  5. Muestra un ejemplo resuelto de un problema PARECIDO, nunca el suyo.

## 4. Justificación obligatoria
- Después de cada paso o respuesta del alumno, pídele que explique por qué lo hizo así. No avances al siguiente paso sin esa explicación.
- No preguntes "¿qué tan seguro estás?". Pide razones: "¿Por qué restaste en ambos lados?", "¿Qué propiedad usaste?".
- Si la justificación es vaga ("porque sí", "así se hace", repite tu pista), no la aceptes: dile qué le falta y pídele que la complete con sus palabras.
- Si la justificación es correcta, dilo y avanza. Si es parcial, reconoce lo correcto y señala lo que falta.
- Si el alumno acierta pero no sabe justificar, trátalo como un paso a medias: explícale el porqué y pídele que lo repita con sus palabras.
- Al terminar el ejercicio, pídele que compruebe su resultado y que explique cómo lo comprobó.

## 5. Detectar dudas
- Identifica qué no entiende: un concepto, un paso, el vocabulario o la lectura del problema.
- Si la pregunta es ambigua, pregunta a qué se refiere antes de responder.
- Si detectas una idea equivocada, nómbrala directamente, explica por qué es incorrecta y da la idea correcta.
- Después de explicar un concepto, comprueba que entendió pidiéndole que lo explique con sus palabras o lo aplique a un caso nuevo.

## 6. Uso de la herramienta `consultar_material`
- Úsala cuando el alumno mencione sus apuntes, su clase o el material, o cuando empiece un tema nuevo y necesites saber cómo lo explicó su profesor.
- Llámala UNA sola vez por tema; si ya tienes el material en la conversación, reutilízalo.
- Usa la misma notación y los mismos pasos del material.
- Puedes proponer los ejercicios del material para practicar, sin dar sus soluciones y sin reutilizar sus números en tus ejemplos.

## 7. Estilo
- Responde siempre en español, con un tono claro, firme y respetuoso. Eres directo, no frío.
- Evita las felicitaciones exageradas y los rodeos. Reconoce lo correcto en una frase.
- Mensajes de 3 a 6 líneas. Si la explicación lo requiere, puedes extenderte un poco, pero ordenada en pasos.
- Haz UNA sola pregunta por mensaje.
- Un error se corrige con precisión, sin hacer sentir mal al alumno.
"""

RUTA_PDF_DEMO = Path(__file__).parent / "ecuaciones_lineales.pdf"
cache_texto = {}


@dataclass
class Contexto:
    materia: str


def limpiar(texto: str) -> str:
    lineas = [linea.strip() for linea in texto.splitlines()]
    return "\n".join(linea for linea in lineas if linea)


def leer_pdf(clave: str, abrir) -> str:
    if clave not in cache_texto:
        lector = PdfReader(abrir())
        texto = "\n".join(pagina.extract_text() or "" for pagina in lector.pages)
        cache_texto[clave] = limpiar(texto)
    return cache_texto[clave]


def obtener_material_demo() -> dict | None:
    if not RUTA_PDF_DEMO.exists():
        return None
    texto = leer_pdf(str(RUTA_PDF_DEMO), lambda: RUTA_PDF_DEMO)
    return {"nombre": RUTA_PDF_DEMO.name, "texto": texto}


# Producción: PDFs que el maestro sube a Vercel Blob
# def obtener_material_vercel(materia: str, tema: str) -> dict | None:
#     url = buscar_url_material(materia, tema)  # URL del PDF en Vercel Blob guardada al subirlo
#     if url is None:
#         return None
#     texto = leer_pdf(url, lambda: BytesIO(urlopen(url).read()))
#     return {"nombre": Path(url).name, "texto": texto}


@tool
def consultar_material(tema: str, runtime: ToolRuntime[Contexto]) -> str:
    """Consulta los apuntes y materiales que el profesor subió a la plataforma para la materia del alumno.

    Úsala SOLO cuando:
    - El alumno mencione sus apuntes, su clase, el material, el PDF o "lo que vimos con el profe".
    - El alumno empiece a estudiar un tema nuevo y necesites saber cómo se explicó en clase
      (definiciones, procedimiento, notación y ejercicios que usa su profesor).

    NO la uses cuando:
    - Ya consultaste ese mismo tema antes en la conversación: reutiliza lo que ya tienes en el historial.
    - El alumno solo saluda, platica o hace una pregunta general que puedes responder sin el material.

    Args:
        tema: tema o palabra clave del material a buscar, por ejemplo "ecuaciones lineales".
    """
    materia = runtime.context.materia
    print(f"[tool] consultar_material -> {materia} / {tema}")

    material = obtener_material_demo()
    # material = obtener_material_vercel(materia, tema)

    if material is None:
        return f"No se encontró material de {materia} sobre '{tema}'."

    return f"""
MATERIAL DE LA PLATAFORMA (archivo: {material["nombre"]})
Uso interno del tutor: alinea tus pistas con la notación y el procedimiento del profesor.
No le des al alumno las soluciones de los ejercicios; úsalos para practicar con pistas.

{material["texto"]}
"""


llm = ChatGroq(model="qwen/qwen3.8-27b", temperature=0.1,max_tokens=1000)
agente = create_agent(
    model=llm,
    tools=[consultar_material],
    system_prompt=SYSTEM_PROMPT,
    context_schema=Contexto,
    
)

if __name__ == "__main__":
    contexto_alumno = Contexto(materia="matematicas")
    historial = []
    while True:
        pregunta = input("Usuario: ")
        if pregunta.lower() == "salir":
            break
        historial.append(HumanMessage(content=pregunta))
        respuesta = agente.invoke({"messages": historial}, context=contexto_alumno)
        historial = respuesta["messages"]
        print(f"Agente: {historial[-1].text}")