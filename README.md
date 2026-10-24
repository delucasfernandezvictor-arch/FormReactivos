# FormReactivos · Formularios con validación en Angular

Registro de productos de inventario implementado dos veces, con **formularios reactivos** y con **formularios template-driven**, para comparar ambos enfoques.

**Demo:** https://form-reactivos-nine.vercel.app

## Funcionalidades
- `/registro`: formulario reactivo (`FormBuilder`, `Validators`) con validadores personalizados (SKU, fecha no futura).
- `/driven`: el mismo formulario con `[(ngModel)]` y directivas de validación propias (`NG_VALIDATORS`).
- Mensajes de error por campo y contraseña con requisitos mínimos (8 caracteres, letras y números).
- La contraseña se transforma en un hash **SHA-256** (Web Crypto API) antes de guardar los datos.
- Descarga del producto registrado en **PDF** (jsPDF), modo oscuro y diseño adaptado a móvil.

## Tecnologías
Ionic 9 · Angular 22 (Standalone, Signals, Reactive Forms, Template-driven Forms) · TypeScript · jsPDF · Vercel

## Instalación
```bash
git clone https://github.com/delucasfernandezvictor-arch/FormReactivos.git
cd FormReactivos
npm install
ionic serve
```

## Autor
Víctor de Lucas Fernández · [LinkedIn](https://www.linkedin.com/in/victor-de-lucas-fernandez-37b709294/)
