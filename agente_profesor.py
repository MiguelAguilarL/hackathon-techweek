# Agente de cuestionarios para Aprender a la Jarocha - el estudiante elige el tipo
import json
import os

from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_groq import ChatGroq
from pydantic import BaseModel

# Cargar la clave GROQ_API_KEY desde el archivo .env
load_dotenv()

# Un solo modelo de Groq para todo el agente
modelo = ChatGroq(
    model="qwen/qwen3.8-27b",
    api_key=os.environ["GROQ_API_KEY"],
    temperature=0.4,
    max_tokens=1000,  # límite del plan on_demand de Groq (no se puede exceder)
)

# Molde del JSON que el agente debe devolver
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
- "respuesta_correcta" debe ser idéntico a uno de los textos de "opciones".
- "estado" = "generado".
- "tipo" = el tipo de cuestionario que recibiste.
- "tema" = "Ecuaciones de primer grado".
- "titulo" = título breve del cuestionario.
- "nivel_educativo" = "" (no se usa en la demo).
- "dificultad" = "" (no se usa en la demo).
- "mensaje" = "".
- "explicacion" = "" (no se usa en la demo).
- Responde en español, SOLO con el JSON (sin markdown, sin ``` ni texto adicional),
  lo más breve posible para que el JSON completo quepa en 1000 tokens.
"""

# Un solo agente, sin herramientas y sin memoria: cada cuestionario es independiente
agente = create_agent(
    model=modelo,
    system_prompt=INSTRUCCIONES,
)


def generar_respuesta(tipo_cuestionario: str) -> dict:
    """Envía el tipo elegido por el estudiante y regresa el cuestionario como dict."""
    resultado = agente.invoke(
        {"messages": [{"role": "user", "content": f"Tipo de cuestionario: {tipo_cuestionario}"}]},
    )
    texto = resultado["messages"][-1].content
    if isinstance(texto, list):  # bloques de contenido
        texto = "".join(
            bloque.get("text", "") if isinstance(bloque, dict) else str(bloque)
            for bloque in texto
        )
    texto = texto.strip()
    if texto.startswith("```"):  # limpia bloque markdown si viniera envuelto
        lineas = texto.splitlines()
        if lineas[0].startswith("```"):
            lineas = lineas[1:]
        if lineas and lineas[-1].startswith("```"):
            lineas = lineas[:-1]
        texto = "\n".join(lineas).strip()

    # json.loads convierte el JSON en un dict nativo de Python
    datos = json.loads(texto)
    # la validación garantiza la misma estructura del proyecto
    return ContenidoEducativo.model_validate(datos).model_dump()


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


def guardar_json(contenido: dict) -> None:
    """Guarda el diccionario en output/contenido_N.json (numerado, sin sobreescribir)."""
    os.makedirs("output", exist_ok=True)
    numero = 1
    while os.path.exists(f"output/contenido_{numero}.json"):
        numero += 1
    ruta = f"output/contenido_{numero}.json"
    with open(ruta, "w", encoding="utf-8") as archivo:
        json.dump(contenido, archivo, ensure_ascii=False, indent=2)
    print(f"\n[guardado en {ruta}]")


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
        if contenido["estado"] == "generado":
            guardar_json(contenido)
