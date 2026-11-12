# Agente profesor para Aprender a la Jarocha - consola con un solo agente Groq
import json
import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import InMemorySaver
from pydantic import BaseModel

# Cargar la clave GROQ_API_KEY desde el archivo .env
load_dotenv()

# Un solo modelo de Groq para todo el agente
modelo = ChatGroq(
    model="qwen/qwen3.8-27b",
    api_key=os.environ["GROQ_API_KEY"],
    temperature=0.4,
    max_tokens=1000,  # límite del plan on_demand de Groq
)

# Molde del JSON que el agente debe devolver
class Pregunta(BaseModel):
    enunciado: str
    opciones: list[str] = []          # vacía si no es opción múltiple
    respuesta_correcta: str
    explicacion: str = ""
    dificultad: str = ""              # "básica/media/avanzada" en evaluaciones


class ContenidoEducativo(BaseModel):
    estado: str                       # "generado" | "necesita_aclaracion"
    tipo: str                         # "actividad" | "evaluacion_diagnostica"
    titulo: str = ""
    tema: str = ""
    nivel_educativo: str = ""
    mensaje: str = ""                 # aclaración o nota breve para el profesor
    preguntas: list[Pregunta] = []


# Instrucciones que guían al agente (un solo prompt, un solo agente)
INSTRUCCIONES = """
Eres el asistente docente de Aprender a la jarocha, una plataforma educativa para
estudiantes de secundaria y bachillerato.

Tu trabajo es ayudar al profesor a generar dos tipos de contenido:

1. ACTIVIDADES EDUCATIVAS: ejercicios para practicar (opción múltiple,
   verdadero/falso, respuesta corta, etc.).
2. EVALUACIONES DIAGNÓSTICAS: exámenes para medir conocimientos previos,
   con diferentes niveles de dificultad (básico, intermedio, avanzado).

Reglas:
- Identifica si el profesor solicita una actividad o una evaluación diagnóstica.
- Comprende el tema, el nivel educativo, la cantidad de preguntas y el tipo
  de ejercicio solicitado.
- Genera contenido claro y apropiado para el nivel indicado.
- Incluye siempre las respuestas correctas.
- Explicaciones breves: máximo 2 oraciones por pregunta.
- Si faltan datos importantes (por ejemplo, el tema o el nivel), no inventes:
  usa estado="necesita_aclaracion", escribe en "mensaje" qué falta y deja
  preguntas vacías.
- Todo lo demás: estado="generado".
- Responde en español.
"""

# Un solo agente con memoria: el checkpointer recuerda la conversación
agente = create_agent(
    model=modelo,
    system_prompt=INSTRUCCIONES,
    checkpointer=InMemorySaver(),
    response_format=ContenidoEducativo,  # obliga al modelo a devolver el JSON
)

# Mismo "hilo" de conversación durante toda la sesión
CONFIG = {"configurable": {"thread_id": "profesor"}}


def generar_respuesta(peticion_del_profesor: str) -> ContenidoEducativo:
    """Envía la petición al agente (recuerda lo anterior) y regresa el JSON."""
    resultado = agente.invoke(
        {"messages": [{"role": "user", "content": peticion_del_profesor}]},
        config=CONFIG,
    )
    return resultado["structured_response"]


def mostrar_en_pantalla(contenido: ContenidoEducativo) -> None:
    """Imprime el contenido en forma legible para el profesor."""
    if contenido.estado != "generado":
        print(contenido.mensaje)
        return
    print(f"{contenido.titulo}  ({contenido.tipo} | {contenido.nivel_educativo})")
    for i, p in enumerate(contenido.preguntas, 1):
        print(f"\n{i}. {p.enunciado}")
        for j, opcion in enumerate(p.opciones):
            print(f"   {'ABCD'[j]}) {opcion}")
        print(f"   Respuesta: {p.respuesta_correcta}")
        if p.explicacion:
            print(f"   Explicación: {p.explicacion}")
        if p.dificultad:
            print(f"   Dificultad: {p.dificultad}")


def guardar_json(contenido: ContenidoEducativo) -> None:
    """Guarda el JSON en output/contenido_N.json (numerado, sin sobreescribir)."""
    os.makedirs("output", exist_ok=True)
    numero = 1
    while os.path.exists(f"output/contenido_{numero}.json"):
        numero += 1
    ruta = f"output/contenido_{numero}.json"
    with open(ruta, "w", encoding="utf-8") as archivo:
        json.dump(contenido.model_dump(), archivo, ensure_ascii=False, indent=2)
    print(f"\n[guardado en {ruta}]")


if __name__ == "__main__":
    print("Aprender a la Jarocha (escribe 'salir' para terminar)")
    while True:
        peticion = input("\nProfesor > ").strip()
        if peticion.lower() in ("salir", "exit"):
            break
        if not peticion:
            continue
        contenido = generar_respuesta(peticion)
        print("\nAgente >")
        mostrar_en_pantalla(contenido)
        if contenido.estado == "generado":
            guardar_json(contenido)
