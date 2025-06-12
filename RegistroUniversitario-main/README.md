# Proyecto Encuestas - Backend

Este proyecto es una API REST para la gestión de encuestas, desarrollada con Spring Boot y PostgreSQL. Puedes ejecutarla usando **Docker** (recomendado) o directamente en tu máquina local.

---

## 🚦 Requisitos previos

### Para cualquier método:
- **Java 21** (JDK)
- **Maven 3.8+**
- **PostgreSQL 15+**

### Si usas Docker:
- **Docker Desktop** ([descargar aquí](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (incluido en Docker Desktop)

---

## 🚀 Ejecución con Docker (recomendado)

1. **Clona el repositorio y entra a la carpeta del proyecto**
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd RegistroUniversitario-main
   ```

2. **Compila el proyecto y genera el JAR**
   ```sh
   mvn clean package
   ```
   Esto generará el archivo JAR en la carpeta `target/`.

3. **Levanta los servicios con Docker Compose**
   ```sh
   docker-compose up --build
   ```
   Esto levantará:
   - Un contenedor de PostgreSQL con la base de datos `universidad`
   - Un contenedor con la aplicación Spring Boot

4. **Accede a la API**
   - Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)  
     o [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
   - API REST: [http://localhost:8080](http://localhost:8080)

5. **Detén los servicios**
   ```sh
   docker-compose down
   ```

---

## 🚀 Ejecución sin Docker (local)

1. **Instala PostgreSQL** y crea una base de datos llamada `encuestasdb`.

2. **Configura las credenciales en `src/main/resources/application.properties`:**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/encuestasdb
   spring.datasource.username=postgres
   spring.datasource.password=TU_CONTRASEÑA
   ```

3. **Crea las tablas de sesión (solo si usas Spring Session JDBC):**
   - Ejecuta el script `spring_session_schema.sql` en tu base de datos.

4. **Compila y ejecuta la aplicación**
   ```sh
   mvn clean package
   java -jar target/mi-proyecto-spring-boot-0.0.1-SNAPSHOT.jar
   ```

5. **Accede a la API**
   - Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 🛠️ Notas útiles

- **Usuario administrador inicial:**  
  Se crea automáticamente al iniciar la app:  
  - Usuario: `admin`
  - Contraseña: `admin123`

- **Autenticación:**  
  - Haz login en `/api/auth/login` para obtener un token JWT.
  - Usa el botón "Authorize" en Swagger y pega el token como:  
    ```
    Bearer TU_TOKEN
    ```

- **Problemas comunes:**
  - Si ves errores de sesión, asegúrate de que las tablas `spring_session` y `spring_session_attributes` existen en la base de datos.
  - Si usas Docker, no necesitas instalar PostgreSQL localmente.

---

## 📦 Estructura del proyecto

- `src/main/java`: Código fuente de la aplicación
- `src/main/resources/application.properties`: Configuración
- `Dockerfile`: Imagen Docker de la app
- `docker-compose.yml`: Orquestación de servicios
- `spring_session_schema.sql`: Script para tablas de sesión

