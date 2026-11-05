# Logotipos del Stack principal

Los únicos recursos servidos al visitante son los seis PNG locales de
`public/icons/stack/`. Los SVG originales de esta carpeta se conservan como
evidencia de procedencia, no se cargan en la página.

## Fuentes y derechos

- Java, Angular, TypeScript, Docker y Kubernetes: variantes `original` de
  [Devicon](https://github.com/devicons/devicon), fijadas al commit
  `32fe1d3b3f36ad11f90ab94f7db59738139c2bf6`. Se conserva íntegra su
  [licencia MIT](sources/LICENSE-devicon.txt).
- Spring Boot: [símbolo oficial](https://spring.io/img/projects/spring-boot.svg)
  publicado por Spring; hexágono con símbolo de encendido, no la hoja de Spring
  Framework. Spring is a trademark of Broadcom Inc. and/or its subsidiaries.
- URLs exactas, hashes de fuentes y PNG, dimensiones y tamaños:
  [`logos.json`](logos.json).
- Las marcas pertenecen a sus titulares; la licencia MIT de Devicon no concede
  derechos sobre las marcas. No se sugiere patrocinio ni afiliación.
- La [política de Spring](https://spring.io/trademarks) restringe el uso de sus
  logotipos. La descarga desde el sitio oficial no acredita permiso independiente
  para publicarlos: revisar autorización antes de un despliegue público. No se ha
  realizado despliegue ni se afirma disponer de esa autorización.

## Preparación

1. Descarga de los SVG originales desde las URLs registradas.
2. Rasterización con Chromium, conservando colores, transparencias y proporción
   del `viewBox`, sin modificar el dibujo.
3. Recorte del margen transparente sobrante y reducción proporcional Lanczos.
4. Centrado con margen óptico en lienzos RGBA de **81 × 81 px**.
5. Compresión PNG sin pérdidas, sin metadatos innecesarios.

La página mantiene las cajas anteriores de **27 × 27 px**, con resolución 3×.
Solo cambia la ocupación visual dentro del PNG: Java 81 px de alto, Angular 75,
Spring Boot 75 de ancho, TypeScript 69, Docker 81 y Kubernetes 78. Ningún CSS de
grid, espaciado, tipografía o breakpoint se modificó.

Peso combinado: **32.056 bytes**. Cada imagen tiene `alt` identificativo; su etiqueta
visible adyacente se oculta únicamente al árbol de accesibilidad para evitar
anunciar dos veces la misma tecnología. Sin JavaScript, CDN o peticiones externas.

Las pruebas unitarias verifican firmas PNG, resolución, canal alfa, presupuesto y
hashes. Playwright verifica píxeles transparentes y coloreados, alternativas,
decodificación, geometría y etiquetas incluso si falla la descarga.
