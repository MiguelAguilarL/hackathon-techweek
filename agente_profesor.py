# Agente profesor para AULA+ - Paso 1: conexión con Groq
import os

from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Cargar la clave GROQ_API_KEY desde el archivo .env
load_dotenv()

# Un solo modelo de Groq para todo el agente
modelo = ChatGroq(
    model="qwen/qwen3.8-27b",
    api_key=os.environ["GROQ_API_KEY"],
    temperature=0.4,
)

# Prueba rápida: comprobar que la conexión funciona
if __name__ == "__main__":
    respuesta = modelo.invoke("Di hola en una sola línea")
    print(respuesta.content)
