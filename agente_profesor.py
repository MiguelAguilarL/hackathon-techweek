# Agente de cuestionarios para Aprender a la Jarocha - el estudiante elige el tipo
import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel

# Cargar la clave GROQ_API_KEY desde el archivo .env
load_dotenv()

# Un solo modelo de Groq para todo el agente
modelo = ChatGroq(
    model="qwen/qwen3.8-27b",
    api_key=os.environ["GROQ_API_KEY"],
    temperature=0.1,  # bajada de 0.4: con 0.4 el modelo se equivocaba en las cuentas
    max_tokens=1000,  # límite del plan on_demand de Groq (no se puede exceder)
)

# Molde del cuestionario que el agente debe devolver
class Pregunta(BaseModel):
    enunciado: str
    opciones: list[str] = []          # ["Verdadero", "Falso"] en V/F
    respuesta_correcta: str
    explicacion: str = ""
    dificultad: str = ""              # "" en la demo


class ContenidoEducativo(BaseModel):
    estado: str                       # "generado" | "necesita_aclaracion"
    tipo: str                         # "opcion_multiple" | "verdadero_falso" | "completar_respuesta"
    titulo: str = ""
    tema: str = ""
    nivel_educativo: str = ""
    mensaje: str = ""                 # nota breve solo si falta un dato
    preguntas: list[Pregunta] = []


# Instrucciones que guían al agente (un solo prompt, un solo agente)
INSTRUCCIONES = """
Eres el generador de cuestionarios de "Aprender a la Jarocha". Tu público es el ESTUDIANTE
(no el profesor). Recibirás UN solo dato: el tipo de cuestionario que eligió, y debes
generar exactamente 5 preguntas.

TEMA ÚNICO: ECUACIONES DE PRIMER GRADO.
- Todas las preguntas y afirmaciones deben ser sobre ecuaciones de primer grado
  (ejemplos: 3x + 5 = 20, 2x - 7 = x + 4, 5(x - 2) = 3x + 6).
- Nunca generes preguntas de otro tema, materia o contenido, aunque se solicite.
- Puedes variar las operaciones, las incógnitas y el nivel de dificultad de las preguntas,
  pero siempre dentro de ecuaciones de primer grado.

TIPOS DE CUESTIONARIO (según el valor que recibas):
1. "opcion_multiple" / "opción múltiple": 5 preguntas; cada una con EXACTAMENTE 4 opciones
   y UNA sola correcta; deben consistir en resolver o analizar ecuaciones de primer grado.
2. "verdadero_falso" / "verdadero o falso": 5 afirmaciones sobre ecuaciones de primer grado;
   cada una con exactamente 2 opciones: "Verdadero" y "Falso"; UNA sola correcta.
3. "completar_respuesta" / "completar respuesta": 5 preguntas con un espacio en blanco (____)
   en el enunciado; EXACTAMENTE 4 opciones y UNA sola correcta, que complete correctamente
   la ecuación o el procedimiento.
- Si el tipo no coincide con ninguno de los tres, genera "opcion_multiple".

REGLAS DE SALIDA:
- Genera SIEMPRE exactamente 5 preguntas (ni 4 ni 6), sin importar nada más.
- Resuelve cada ecuación tú mismo y comprueba que "respuesta_correcta" sea la correcta
  antes de responder; nunca marques mal una respuesta correcta.
- "respuesta_correcta" debe ser idéntico a uno de los textos de "opciones".
- "estado" = "generado".
- "tipo" = el tipo de cuestionario que recibiste.
- "tema" = "Ecuaciones de primer grado".
- "titulo" = título breve del cuestionario.
- "nivel_educativo" = "" (no se usa en la demo).
- "dificultad" = "" (no se usa en la demo).
- "mensaje" = "".
- "explicacion" = "" (no se usa en la demo).
- Devuelve el cuestionario en json, en español y lo más breve posible para que quepa
  en 1000 tokens.
"""

# Un solo agente, sin herramientas y sin memoria: cada cuestionario es independiente.
# El modelo devuelve el objeto ya validado (salida estructurada de Groq).
agente = modelo.with_structured_output(ContenidoEducativo, method="json_mode")


def generar_respuesta(tipo_cuestionario: str) -> dict:
    """Envía el tipo elegido por el estudiante y regresa el cuestionario como dict."""
    contenido = agente.invoke([
        SystemMessage(content=INSTRUCCIONES),
        HumanMessage(content=f"Tipo de cuestionario: {tipo_cuestionario}"),
    ])
    # model_dump() convierte el objeto en un dict nativo de Python
    return contenido.model_dump()


def mostrar_en_pantalla(contenido: dict) -> None:
    """Imprime el cuestionario en forma legible para el estudiante."""
    if contenido["estado"] != "generado":
        print(contenido["mensaje"])
        return
    print(f"{contenido['titulo']}  ({contenido['tipo']} | {contenido['tema']})")
    for i, p in enumerate(contenido["preguntas"], 1):
        print(f"\n{i}. {p['enunciado']}")
        for j, opcion in enumerate(p["opciones"]):
            print(f"   {'ABCD'[j]}) {opcion}")
        print(f"   Respuesta: {p['respuesta_correcta']}")
        if p["explicacion"]:
            print(f"   Explicación: {p['explicacion']}")


if __name__ == "__main__":
    print("Aprender a la Jarocha - Cuestionarios (escribe 'salir' para terminar)")
    while True:
        tipo = input(
            "\nTipo (opcion_multiple / verdadero_falso / completar_respuesta) > "
        ).strip()
        if tipo.lower() in ("salir", "exit"):
            break
        if not tipo:
            continue
        contenido = generar_respuesta(tipo)
        print("\nAgente >")
        mostrar_en_pantalla(contenido)
