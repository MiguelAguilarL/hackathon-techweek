# Agente profesor para AULA+ - Paso 2: instrucciones del agente
import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

# Cargar la clave GROQ_API_KEY desde el archivo .env
load_dotenv()

# Un solo modelo de Groq para todo el agente
modelo = ChatGroq(
    model="qwen/qwen3.8-27b",
    api_key=os.environ["GROQ_API_KEY"],
    temperature=0.4,
)

# Instrucciones que guían al agente (un solo prompt, un solo agente)
INSTRUCCIONES = """
Eres el asistente docente de AULA+, una plataforma educativa para
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
- Incluye explicaciones breves cuando corresponda.
- Organiza la respuesta con títulos y numeración para que sea fácil de leer.
- Si faltan datos importantes (por ejemplo, el tema o el nivel), no inventes:
  responde pidiendo una aclaración al profesor.
- Responde en español.
"""

def generar_respuesta(peticion_del_profesor: str) -> str:
    """Envía la petición del profesor al modelo y regresa el texto."""
    mensajes = [
        SystemMessage(content=INSTRUCCIONES),
        HumanMessage(content=peticion_del_profesor),
    ]
    respuesta = modelo.invoke(mensajes)
    return respuesta.content

if __name__ == "__main__":
    print("Agente AULA+ (escribe 'salir' para terminar)")
    while True:
        peticion = input("\nProfesor > ").strip()
        if peticion.lower() in ("salir", "exit"):
            break
        if not peticion:
            continue
        print("\nAgente >")
        print(generar_respuesta(peticion))
