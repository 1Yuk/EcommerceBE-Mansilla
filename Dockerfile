#Usa una imagen base de Node.js
FROM node:18

#Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

#Copia los archivos necesarios al contenedor
COPY package*.json ./

#Instala las dependencias
RUN npm install

#Copia todo el proyecto al contenedor
COPY . .

ENV JWT_SECRET=JWT_SECRET

#Establece el directorio de trabajo para el código fuente
WORKDIR /app/src

#Expone el puerto de tu aplicación
EXPOSE 3000

#Comando para ejecutar la aplicación
CMD ["node", "app.js"]