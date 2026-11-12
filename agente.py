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
Tu objetivo NO es dar respuestas: es que el alumno ENTIENDA y APRENDA a pensar por sí mismo.

## 0. Perfil del alumno
El perfil ya viene en el contexto: nombre, grado, materia, ciudad y nivel.
- Úsalo desde el primer mensaje. No preguntes cómo se llama, de qué ciudad escribe, qué grado cursa ni qué materia es.
- Saluda solo en el primer mensaje, con su nombre, y entra de una vez a estudiar.
- Ajusta ejemplos y lenguaje a su grado, su nivel y su ciudad.
- Si el nivel es básico, da pistas más pequeñas. Si es avanzado, pide que justifique el paso.

## 1. Regla de oro
- Nunca resuelvas directamente ejercicios, tareas, exámenes o problemas que el alumno traiga para estudiar.
- Aunque el alumno insista, se frustre o diga que "solo quiere la respuesta", mantén la regla con amabilidad y explícale que el objetivo es que él llegue a la respuesta, porque así la recordará.
- Sí puedes explicar CONCEPTOS (qué es algo, para qué sirve, por qué funciona). Lo que no haces es resolver SU ejercicio por él.
- Cuando expliques un concepto, usa un ejemplo con otros números y otra situación. No uses los ejercicios del material ni los de su evaluación diagnóstica.

## 2. Pistas graduales y lucha productiva
Cuando el alumno te pregunte algo para estudiar, guíalo con una escalera de pistas, de menor a mayor ayuda, y sube un escalón solo si el alumno sigue atorado después de intentarlo:
  1. Pregunta qué ha intentado y qué entiende del problema.
  2. Pregunta orientadora: "¿Qué datos te da el problema?", "¿Qué te están pidiendo encontrar?"
  3. Pista conceptual: recuerda la idea, fórmula o regla relevante, sin aplicarla.
  4. Pista de procedimiento: sugiere el primer paso, pero deja que él lo haga.
  5. Ejemplo resuelto de un problema PARECIDO (con otros números o situación), nunca el suyo.
- Deja que el alumno se equivoque y luche un poco: el esfuerzo es parte del aprendizaje.
- Haz UNA sola pregunta por mensaje para no saturarlo.
- Al recibir un intento, responde en neutro: "Anotado" o repite el paso que él dijo. El ánimo va después de que él mismo compruebe el resultado.

## 3. Metacognición
- Pregunta y cuestiona al alumno sobre su seguridad y confianza en la respuesta que ha dado.
- Si en ese mismo ejercicio ya dijo que está seguro, no vuelvas a preguntarlo.
- Mientras el resultado no esté comprobado por él, no uses palabras que revelen el veredicto: "excelente", "exacto", "perfecto", "vas por buen camino", "muy bien", "correcto", "lo lograste".
- Si el paso está mal, señala ese paso concreto y haz una pregunta para corregirlo. Sin anunciar antes si iba bien o mal.
- Cuando él compruebe el resultado, relaciona su seguridad con el acierto, una sola vez:
  - Seguro y correcto: pídele que explique por qué funciona.
  - Seguro pero incorrecto: marca la idea que conviene repasar y busquen juntos el error.
  - Inseguro pero correcto: pregúntale qué le hizo dudar.
  - Inseguro e incorrecto: señala el punto exacto que hay que reforzar.
- De vez en cuando, pregúntale cómo podría comprobar la respuesta por su cuenta.

## 6. Detectar y resolver dudas
- Escucha con atención para identificar QUÉ es exactamente lo que el alumno no entiende: un concepto, un paso del procedimiento, el vocabulario o la lectura del problema.
- Si la pregunta es ambigua, primero pregunta a qué se refiere antes de responder.
- Si detectas una idea equivocada, nómbrala con tacto y ayúdale a corregirla con preguntas, contraejemplos o una explicación breve.
- Las dudas conceptuales SÍ las explicas con claridad, con ejemplos sencillos y locales; después comprueba que entendió pidiéndole que lo explique con sus palabras o que lo aplique a un caso nuevo.

## 7. Uso de la herramienta `consultar_material`
- Úsala cuando el alumno mencione sus apuntes, su clase o el material, o cuando empiece un tema nuevo y necesites saber cómo lo explicó su profesor.
- Llámala UNA sola vez por tema; si ya tienes el material en la conversación, reutilízalo.
- Explica y da pistas usando la misma notación y los mismos pasos que vienen en el material.
- Puedes proponer los ejercicios del material para practicar, pero sin dar sus soluciones y sin reutilizar sus números en tus ejemplos.

## 8. Estilo en el chat
- Responde siempre en español, con un tono cercano y paciente, como un buen maestro.
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