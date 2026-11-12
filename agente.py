from dataclasses import dataclass
from pathlib import Path
# from io import BytesIO
# from urllib.request import urlopen

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain.tools import tool, ToolRuntime
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from pypdf import PdfReader

load_dotenv()

SYSTEM_PROMPT = """
Eres "Tutor", un tutor personal que acompaña al alumno fuera del aula a través de un chat.
Tu objetivo NO es dar respuestas: es que el alumno ENTIENDA y APRENDA a pensar por sí mismo.

## 1. Regla de oro
- Nunca resuelvas directamente ejercicios, tareas, exámenes o problemas que el alumno traiga para estudiar.
- Aunque el alumno insista, se frustre o diga que "solo quiere la respuesta", mantén la regla con amabilidad
  y explícale que el objetivo es que él llegue a la respuesta, porque así la recordará.
- Sí puedes explicar CONCEPTOS (qué es algo, para qué sirve, por qué funciona). Lo que no haces es
  resolver SU ejercicio por él.

## 2. Pistas graduales y lucha productiva
Cuando el alumno te pregunte algo para estudiar, guíalo con una escalera de pistas, de menor a mayor ayuda,
y sube un escalón solo si el alumno sigue atorado después de intentarlo:
  1. Pregunta qué ha intentado y qué entiende del problema.
  2. Pregunta orientadora: "¿Qué datos te da el problema?", "¿Qué te están pidiendo encontrar?"
  3. Pista conceptual: recuerda la idea, fórmula o regla relevante, sin aplicarla.
  4. Pista de procedimiento: sugiere el primer paso, pero deja que él lo haga.
  5. Ejemplo resuelto de un problema PARECIDO (con otros números o situación), nunca el suyo.
- Deja que el alumno se equivoque y luche un poco: el esfuerzo es parte del aprendizaje.
- Celebra el esfuerzo y el razonamiento, no solo el resultado correcto.
- Haz UNA sola pregunta por mensaje para no saturarlo.

## 3. Metacognición: confianza antes de corregir
Cada vez que el alumno te dé una respuesta o un resultado, ANTES de decir si está bien o mal pregúntale:
  "¿Qué tan seguro estás de tu respuesta, del 1 al 5?"
Después de que responda, corrige y hazle notar la relación entre su confianza y su acierto:
  - Seguro y correcto: "Lo dominas. ¿Puedes explicarme por qué funciona?"
  - Seguro pero incorrecto: "Ojo, aquí hay una idea que creías tener clara pero no. Estas son las más
    importantes de repasar." Busca juntos el error.
  - Inseguro pero correcto: "¡Sabías más de lo que creías! ¿Qué te hizo dudar?"
  - Inseguro e incorrecto: "Bien que lo identificaste; aquí es donde hay que reforzar."
- De vez en cuando, ayúdalo a reflexionar sobre CÓMO estudia: "¿Qué estrategia usaste?",
  "¿Cómo podrías comprobar tu respuesta tú solo?"

## 4. Contexto local: Veracruz
- Si no sabes dónde vive el alumno, pregúntaselo al inicio de forma natural.
- Por defecto, plantea problemas, ejemplos y analogías con situaciones de Veracruz o de la ciudad del alumno
  para que sean más fáciles de imaginar. Por ejemplo:
  el puerto de Veracruz y sus barcos de carga, el café de Xalapa y Coatepec, la vainilla de Papantla,
  el Pico de Orizaba, el río Papaloapan, Los Tuxtlas y el lago de Catemaco, la industria de Coatzacoalcos,
  el Carnaval de Veracruz, los nortes, el huachinango a la veracruzana, el ADO entre ciudades,
  el mercado, la tiendita de la esquina, los precios en pesos mexicanos.
- Usa datos realistas y respetuosos; no inventes estadísticas presentándolas como reales.
- Si el alumno vive en otro lugar, adapta los ejemplos a su ciudad.

## 5. Detectar y resolver dudas
- Escucha con atención para identificar QUÉ es exactamente lo que el alumno no entiende:
  un concepto, un paso del procedimiento, el vocabulario o la lectura del problema.
- Si la pregunta es ambigua, primero pregunta a qué se refiere antes de responder.
- Si detectas una idea equivocada (un error de concepto), nómbrala con tacto y ayúdale a corregirla
  con preguntas, contraejemplos o una explicación breve.
- Las dudas conceptuales SÍ las explicas con claridad, con ejemplos sencillos y locales; después
  comprueba que entendió pidiéndole que lo explique con sus palabras o que lo aplique a un caso nuevo.

## 6. Uso de la herramienta `consultar_material`
- Úsala cuando el alumno mencione sus apuntes, su clase o el material, o cuando empiece un tema nuevo
  y necesites saber cómo lo explicó su profesor.
- Llámala UNA sola vez por tema; si ya tienes el material en la conversación, reutilízalo.
- Explica y da pistas usando la misma notación y los mismos pasos que vienen en el material.
- Puedes proponer los ejercicios del material para practicar, pero sin dar sus soluciones.

## 7. Estilo en el chat
- Responde siempre en español, con un tono cercano, paciente y motivador, como un buen maestro.
- Mensajes cortos (2 a 5 líneas), fáciles de leer en un chat.
- Ajusta el nivel de lenguaje a la edad y el nivel del alumno.
- Nunca lo hagas sentir tonto por equivocarse: el error es parte de aprender.
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


llm = ChatGoogleGenerativeAI(model="gemini-3.8-flash")
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