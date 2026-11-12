import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

# Importamos directamente desde agente.py sin modificarlo
from agente import agente, Contexto

# Importamos el generador de flashcards
from agente_flashcards import generar_flashcards

# Importamos el generador de cuestionarios guiados con IA
from agente_profesor import generar_respuesta

app = FastAPI(title="Tutor Socrático Jarocho API", version="1.0.0")

# Habilitamos CORS para Vite (localhost:5173 o cualquier host local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str # "user" o "assistant"
    content: str

class StudentProfile(BaseModel):
    name: Optional[str] = "María Rodríguez"
    grade: Optional[str] = '3° "B" Secundaria'
    subject: Optional[str] = "Matemáticas Aplicadas"
    level: Optional[str] = "Intermedio"
    city: Optional[str] = "Veracruz"

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    materia: Optional[str] = "matematicas"
    profile: Optional[StudentProfile] = None

class FlashcardsRequest(BaseModel):
    nivel: Optional[str] = "intermedio" # "basico" | "intermedio" | "avanzado"
    tema: Optional[str] = "ecuaciones lineales"

class GuidedExercisesRequest(BaseModel):
    tipo: str # "opcion_multiple" | "verdadero_falso" | "completar_respuesta"

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Tutor Socrático Jarocho"}

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        contexto_alumno = Contexto(materia=req.materia or "matematicas")

        historial = []

        if req.profile:
            prefacio_contexto = (
                f"[Perfil del Alumno]\n"
                f"Nombre: {req.profile.name}\n"
                f"Grado: {req.profile.grade}\n"
                f"Materia: {req.profile.subject}\n"
                f"Nivel: {req.profile.level}\n"
                f"Ciudad: {req.profile.city}\n"
            )
            historial.append(SystemMessage(content=prefacio_contexto))

        for msg in req.messages:
            if msg.role == "user":
                historial.append(HumanMessage(content=msg.content))
            else:
                historial.append(AIMessage(content=msg.content))

        respuesta = agente.invoke({"messages": historial}, context=contexto_alumno)
        mensajes_resultado = respuesta.get("messages", [])

        if not mensajes_resultado:
            raise HTTPException(status_code=500, detail="No se recibió respuesta del agente.")

        ultimo_mensaje = mensajes_resultado[-1]
        contenido = getattr(ultimo_mensaje, "content", "")
        if isinstance(contenido, list):
            contenido = "".join(
                bloque.get("text", "") if isinstance(bloque, dict) else str(bloque)
                for bloque in contenido
            )

        return {
            "reply": str(contenido),
            "role": "assistant"
        }

    except Exception as e:
        print(f"Error procesando chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/flashcards")
async def flashcards_endpoint(req: FlashcardsRequest):
    try:
        cards = generar_flashcards(nivel=req.nivel or "intermedio", tema=req.tema or "ecuaciones lineales")
        return {
            "nivel": req.nivel,
            "tema": req.tema,
            "flashcards": cards
        }
    except Exception as e:
        print(f"Error generando flashcards: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/guided-exercises")
async def guided_exercises_endpoint(req: GuidedExercisesRequest):
    # Requiere internet y llamada en vivo con Groq (sin fallbacks)
    try:
        tipo_solicitado = req.tipo.strip().lower()
        if tipo_solicitado not in ("opcion_multiple", "verdadero_falso", "completar_respuesta"):
            tipo_solicitado = "opcion_multiple"

        contenido = generar_respuesta(tipo_solicitado)
        return contenido
    except Exception as e:
        print(f"Error generando ejercicios guiados con Groq: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"No se pudo generar el cuestionario con IA: {str(e)}. Verifica tu conexión a internet y tu clave GROQ_API_KEY."
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
