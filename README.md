#  Products App - Frontend

Este es el frontend de **Products App**, una aplicación Angular que permite gestionar productos mediante un CRUD. Se conecta al backend desarrollado en Spring Boot.

---

##  Tecnologías utilizadas

- Angular 17+ (Standalone components)
- TypeScript
- Angular Forms
- Angular HTTPClient
- Bootstrap 5 (estilos y validación visual)
- Cypress (para pruebas end-to-end)

---

##  Componentes principales

| Componente         | Descripción                                   |
|--------------------|-----------------------------------------------|
| `FormComponent`    | Formulario para crear y actualizar productos con validación. |
| `ProductsComponent`| Tabla dinámica para listar, editar y eliminar productos.     |

---

##  Estructura del Proyecto

src/
│
├── app/
│ ├── components/
│ │ ├── form/ # Formulario de productos
│ │ └── products/ # Tabla de productos
│ ├── models/ # Modelo de datos Product
│ └── services/ # Servicio HTTP ProductService
│
├── assets/
└── environments/

yaml
Copiar
Editar

---

## 🔌 Conexión con el backend

El servicio Angular se comunica con el backend Spring Boot a través de:

```ts
private url: string = "http://localhost:8080/products";
 Instalación y ejecución local
1. Instalar dependencias
bash
Copiar
Editar
npm install
2. Ejecutar el servidor de desarrollo
bash
Copiar
Editar
ng serve
Luego abre en tu navegador:
 http://localhost:4200

 Funcionalidades
Crear y actualizar productos desde un mismo formulario

Validación de campos (solo letras, sin números, precio mínimo)

Listar productos en una tabla con controles de edición y eliminación

Comunicación entre componentes con @Input y @Output

Feedback visual con Bootstrap (.is-invalid, alertas)