# Práctica Nodepop.

## Descargar el repositorio o clonarlo.
> git clone https://github.com/Pepeciruela/nodepop.git

## Instalar las dependencias.

> npm install

## Inicializar la base de datos. Esto creará 4 anuncios y un nuevo usuario.

> npm run iniciarDB

## Para arrancar el proyecto podemos usar:

Para trabajar el producción:

> npm run start

Para trabajar en desarrollo (facilita ver los cambios en el momento):

> nodemon 
o
> npm run dev

## Rutas del proyecto:

### Ruta a la web:

Tanto las rutas a la página de login como a la página de anuncios tienen implementada una internacionalización en la parte superios, permitiendo cambiar el idioma entre español e inglés.

> http://localhost:3000

En esta ruta obtendremos la opción de login para acceder a la plataforma. El email y contraseña de acceso es el siguiente:

* email
> user@example.com
* password
> 1234

> http://localhost:3000/anuncios

En esta ruta obtendremos todos los anuncios existentes y podremos aplicar los filtros necesarios. Es una ruta protegida que require de login para acceder (ver punto anterior).

* Nombre
> http://localhost:3000/?nombre=mo
* Venta (un producto está a la venta si es True o está siendo buscado si es False)
> http://localhost:3000/?venta=true
* Tags
> http://localhost:3000/?tags=mobile,motor
* Precio (usando X-, -X o X-Y para los intervalos del precio)
> http://localhost:3000/?precio=50-400
* Se pueden mezclar diferentes filtros de búsqueda, para una mayor precisión:
> http://localhost:3000/?precio=50-400&tags=motor

### Ruta a la API:

> http://localhost:3000/api/login

Con el método POST desde un servicio tipo POSTMAN nos permitirá autenticarnos, para acceder al token que da permiso para operar.

> http://localhost:3000/api/anuncios

Es una ruta protegida que require poner el token de autentificación obtenido en la petición POST a login.

Esta ruta devolverá un JSON con todos los anuncios existentes. Sobre esta URL podremos aplicar los filtros existentes para nuestra búsqueda al igual que en la ruta Web.

Además podemos utilizar el método POST para crear nuevos anuncios y el metodo DELETE para eliminarlos (en este caso eliminaremos los anuncios por su ID).

### Ruta a los TAGS:

> http://localhost:3000/api/tags





