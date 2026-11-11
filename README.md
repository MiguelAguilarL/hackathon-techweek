# RETO: APRENDER A LA JAROCHA

### EL PROBLEMA

Muchas y muchos estudiantes de secundaria y bachillerato en Veracruz estudian con conexión limitada, desde el celular y sin alguien que les resuelva dudas fuera del aula. La IA puede ser un buen tutor, si se usa bien.

### LO QUE BUSCAMOS

Un tutor o herramienta educativa que ayude a aprender de verdad, no a copiar: que pregunte antes de responder, se adapte al nivel, funcione bien en celular y con poca conexión, y le dé al docente una vista útil del avance del grupo.

### PARA QUIEN

Estudiantes de secundaria y bachillerato, y sus docentes.

---

## CÓMO EJECUTAR EL AGENTE (AULA+)

```powershell
# 1. Crear entorno virtual e instalar dependencias (solo la primera vez)
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# 2. Configurar tu clave de Groq en el archivo .env
#    GROQ_API_KEY=tu_clave_aqui

# 3. Ejecutar el agente
python agente_profesor.py
```

Escribe tu petición en lenguaje natural y presiona Enter.
Escribe `salir` para terminar. Cada respuesta se guarda en `output/`.