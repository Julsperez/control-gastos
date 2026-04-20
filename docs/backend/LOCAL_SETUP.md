# Backend — Configuración local (Windows)

Guía para levantar el backend de **Control de Gastos Personales** en un entorno de desarrollo local sobre **Windows 10 / Windows 11**.

---

## 1. Prerequisitos

| Herramienta | Versión mínima | Notas |
|-------------|---------------|-------|
| Python | 3.12+ | Probado con 3.12 y 3.14. Instalar desde python.org o Microsoft Store |
| pip | incluido con Python | El instalador de python.org lo incluye automáticamente |
| venv | incluido con Python | Recomendado para aislar dependencias |

### Verificar instalación

En PowerShell o cmd:

```powershell
py --version
# Python 3.14.x  (o la versión instalada)

py -m pip --version
# pip 24.x from ...
```

> **Nota sobre el launcher `py`:** En Windows, el instalador oficial registra el launcher `py` que gestiona múltiples versiones de Python. Se recomienda usar `py` en lugar de `python` para evitar conflictos si hay más de una versión instalada. Si solo hay una versión, `python` y `py` son equivalentes.

### Política de ejecución en PowerShell

Si al activar el entorno virtual aparece el error `"running scripts is disabled on this system"`, ejecutar una vez con permisos de administrador:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 2. Instalación paso a paso

Asumiendo que el repositorio ya está clonado, pararse en el directorio del backend desde PowerShell:

```powershell
cd control-gastos\backend
```

### 2.1 Crear y activar el entorno virtual

```powershell
# Crear el entorno virtual
py -m venv .venv

# Activar en PowerShell
.venv\Scripts\Activate.ps1

# Activar en cmd
.venv\Scripts\activate.bat
```

El prompt debe mostrar `(.venv)` al inicio cuando el entorno está activo:

```
(.venv) PS C:\Users\...\control-gastos\backend>
```

Para desactivar el entorno cuando sea necesario:

```powershell
deactivate
```

### 2.2 Instalar dependencias

```powershell
pip install -r requirements.txt
```

Las dependencias usan versiones `>=` (sin pinear exactas) para garantizar compatibilidad con Python 3.12 y 3.14:

```
fastapi>=0.115.0
uvicorn[standard]>=0.30.6
sqlalchemy>=2.0.35
pydantic[email]>=2.10.0
pydantic-settings>=2.6.0
PyJWT>=2.9.0
bcrypt>=4.0.0
python-multipart>=0.0.12
```

---

## 3. Configuración del archivo .env

Copiar el archivo de ejemplo como punto de partida:

```powershell
# PowerShell
Copy-Item .env.example .env

# cmd
copy .env.example .env
```

Abrir `.env` y ajustar los valores para desarrollo local. El cambio más importante es `DATABASE_URL`: el valor por defecto apunta a `/data/gastos.db`, una ruta que solo existe dentro del contenedor Docker. Para desarrollo local se debe usar una ruta relativa:

```dotenv
SECRET_KEY=una-clave-secreta-local-para-desarrollo
DATABASE_URL=sqlite:///./gastos.db
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:5173
```

Con `sqlite:///./gastos.db` el archivo de base de datos se crea dentro del directorio `backend/` al iniciar el servidor por primera vez.

> **Nota:** `SECRET_KEY` puede ser cualquier cadena larga en desarrollo. En producción debe ser un valor aleatorio seguro y nunca compartido. El servidor rechazará tokens firmados con una clave diferente a la configurada.

---

## 4. Correr el servidor

Con el entorno virtual activo y el `.env` configurado:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

La flag `--reload` reinicia el servidor automáticamente cuando se detectan cambios en el código fuente. No usar `--reload` en producción.

El servidor queda escuchando en `http://localhost:8000`.

> **Nota Windows:** Si `uvicorn` no es reconocido como comando, verificar que el entorno virtual está activo (`(.venv)` en el prompt). Alternativamente se puede invocar como módulo: `py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`.

---

## 5. Verificar que funciona

### Health check

Windows 10/11 incluye `curl.exe` de serie (desde Windows 10 versión 1803):

```powershell
curl http://localhost:8000/health
```

Respuesta esperada:

```json
{"status": "ok"}
```

Si `curl` no está disponible, usar PowerShell nativo:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

### Documentación interactiva

Abrir en el navegador:

```
http://localhost:8000/docs
```

Swagger UI lista todos los endpoints disponibles y permite ejecutar peticiones directamente desde el navegador.

---

## 6. Seed y base de datos

Al iniciar `uvicorn`, el backend ejecuta automáticamente dos operaciones:

1. **Creacion de tablas** — `Base.metadata.create_all()` crea las tablas `users`, `categorias`, `gastos` y `refresh_tokens` si no existen. La operacion es idempotente: si las tablas ya existen, no las toca.

2. **Seed de categorias** — `seed_categorias()` inserta las 10 categorias del sistema (Alimentacion, Transporte, etc.) si aun no están en la base de datos. Tambien idempotente.

No se requiere ningún comando manual para inicializar la base de datos en desarrollo normal.

### Inicialización manual

Si por alguna razon se necesita inicializar la base de datos sin levantar el servidor web (por ejemplo, en scripts de CI o migraciones forzadas), el proyecto incluye un script independiente:

```bash
python init_db.py
```

Este script crea las tablas y ejecuta el seed sin iniciar Uvicorn.

---

## 7. Variables de entorno — referencia completa

| Variable | Descripcion | Valor por defecto (`.env.example`) | Obligatoria |
|----------|-------------|-------------------------------------|-------------|
| `SECRET_KEY` | Clave para firmar y verificar los JWT. Debe ser secreta y unica por entorno. | `cambia-esto-en-produccion` | Si |
| `DATABASE_URL` | URL de conexion a la base de datos SQLAlchemy. Para desarrollo local usar `sqlite:///./gastos.db`. Para Docker, la ruta es `sqlite:////data/gastos.db`. | `sqlite:////data/gastos.db` | Si |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tiempo de vida del access token JWT en minutos. | `15` | No |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Tiempo de vida del refresh token en dias. | `7` | No |
| `CORS_ORIGINS` | Origen(es) permitidos por la politica CORS. Separar multiples valores con coma. Debe incluir la URL del frontend. | `http://localhost:5173` | Si |

---

## 8. Endpoints disponibles

| Metodo | Ruta | Autenticacion | Descripcion |
|--------|------|---------------|-------------|
| `GET` | `/health` | No | Estado del servidor |
| `POST` | `/api/v1/auth/register` | No | Registro de usuario |
| `POST` | `/api/v1/auth/login` | No | Login, retorna access + refresh token |
| `POST` | `/api/v1/auth/refresh` | Refresh token | Renueva el access token |
| `GET` | `/api/v1/gastos` | Bearer token | Lista gastos del usuario autenticado |
| `POST` | `/api/v1/gastos` | Bearer token | Crea un nuevo gasto |
| `DELETE` | `/api/v1/gastos/{id}` | Bearer token | Elimina un gasto por ID |
| `GET` | `/api/v1/categorias` | Bearer token | Lista categorias disponibles |
| `POST` | `/api/v1/categorias` | Bearer token | Crea una categoria personalizada |
| `GET` | `/api/v1/dashboard/resumen` | Bearer token | Resumen agregado de gastos |

Base URL: `http://localhost:8000/api/v1`

---

## 9. Opcion Docker

Si se prefiere no configurar el entorno Python localmente, el proyecto incluye un `docker-compose.yml` en la raiz del repositorio que levanta backend y frontend juntos. Requiere **Docker Desktop para Windows** instalado y corriendo.

```powershell
# Desde la raiz del repositorio (no desde backend/)
cd ..
docker compose up --build
```

Con Docker la `DATABASE_URL` del `.env.example` (`sqlite:////data/gastos.db`) funciona sin modificaciones porque el contenedor monta el volumen `/data/` internamente.

El backend queda disponible en `http://localhost:8000` igual que en el setup local.

---

## 10. Troubleshooting

### Puerto 8000 ocupado

**Sintoma:** `Only one usage of each socket address (protocol/network address/port) is normally permitted`

**Solucion 1:** Identificar el proceso que ocupa el puerto y terminarlo:

```powershell
# Ver qué proceso usa el puerto 8000
netstat -ano | findstr :8000

# La última columna es el PID. Terminarlo con:
taskkill /PID <PID> /F
```

**Solucion 2:** Levantar el servidor en un puerto diferente:

```powershell
uvicorn app.main:app --reload --port 8001
```

---

### SECRET_KEY con valor por defecto en produccion

**Sintoma:** El servidor arranca pero los tokens pueden estar comprometidos si `SECRET_KEY` es el valor del `.env.example`.

**Causa:** La aplicacion no valida que `SECRET_KEY` haya sido cambiada.

**Solucion:** Establecer una clave generada de forma segura antes de exponer el servicio:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Copiar el resultado en la variable `SECRET_KEY` del `.env`.

---

### ModuleNotFoundError al iniciar uvicorn

**Sintoma:** `ModuleNotFoundError: No module named 'fastapi'` u otro modulo del proyecto.

**Causas posibles:**

1. El entorno virtual no esta activo — verificar que el prompt muestre `(.venv)`.
2. Las dependencias no fueron instaladas — ejecutar `pip install -r requirements.txt`.
3. Se tiene mas de un Python instalado y `pip` instalo las dependencias en el Python del sistema, no en el venv.

**Verificacion:**

```powershell
# Debe apuntar dentro del directorio .venv\Scripts\
where python
# C:\...\control-gastos\backend\.venv\Scripts\python.exe  <- correcto
# C:\Users\...\AppData\Local\Programs\Python\...           <- incorrecto (Python del sistema)
```

---

### SQLite OperationalError: unable to open database file

**Sintoma:** `sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) unable to open database file`

**Causa:** `DATABASE_URL` esta configurada como `sqlite:////data/gastos.db`. La ruta `/data/` solo existe dentro del contenedor Docker. En desarrollo local el directorio no existe y SQLite no puede crear el archivo.

**Solucion:** Cambiar `DATABASE_URL` en el `.env` a una ruta relativa:

```dotenv
DATABASE_URL=sqlite:///./gastos.db
```

El archivo `gastos.db` se creara automaticamente en `backend/gastos.db` al levantar el servidor.

---

### Python no encontrado o versión incorrecta

**Sintoma:** `'python' is not recognized as an internal or external command` o se ejecuta la versión incorrecta.

**Causa:** Python no está en el PATH del sistema, o hay múltiples versiones instaladas.

**Solucion:** Usar el launcher `py` que gestiona versiones automáticamente:

```powershell
py --version        # versión activa
py -0              # lista todas las versiones instaladas
py -3.12 --version  # forzar una versión específica
```

Si Python no aparece en `py -0`, reinstalar desde [python.org](https://www.python.org/downloads/) marcando la opción **"Add Python to PATH"** durante la instalación.

---

### Error al instalar pydantic-core (no hay wheel para la versión de Python)

**Sintoma:** `ERROR: Could not find a version that satisfies the requirement pydantic-core==X.Y.Z`

**Causa:** El `requirements.txt` tiene versiones fijadas con `==` que no tienen wheel precompilado para la versión de Python instalada.

**Solucion:** El `requirements.txt` de este proyecto ya usa `>=` para evitar este problema. Si se ve este error, verificar que se está usando el `requirements.txt` del repositorio y no una versión antigua:

```powershell
pip install -r requirements.txt --upgrade
```

---

### AttributeError en bcrypt al importar passlib

**Sintoma:** `AttributeError: module 'bcrypt' has no attribute '__about__'`

**Causa:** Versión antigua del proyecto usaba `passlib[bcrypt]`, que es incompatible con `bcrypt>=4.0.0`. Este proyecto ya usa `bcrypt` directamente — si aparece este error, hay una instalación residual de `passlib`.

**Solucion:**

```powershell
pip uninstall passlib -y
pip install -r requirements.txt
```
