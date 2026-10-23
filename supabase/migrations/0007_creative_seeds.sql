-- 0007: Biblioteca creativa (diseño, video, color, audiovisual, guion, CM, redes, marca) para la IA local
-- Ejecutar tras 0006 en Supabase SQL Editor; luego reentrenar el cerebro en /admin/ia.

insert into amplikaa.ai_knowledge (titulo, contenido) values

('Principios del diseño gráfico',
 'El diseño gráfico organiza información visual para comunicar con claridad. Los pilares son: jerarquía (qué se ve primero), alineación, contraste, repetición y ritmo, proximidad (elementos juntos se leen como grupo) y espacio en blanco. El diseño no es decoración: es facilitar que el mensaje llegue.'),

('Composición y regla de los tercios',
 'La regla de los tercios divide el lienzo en nueve zonas con dos líneas horizontales y dos verticales; colocar el sujeto o punto de interés en las intersecciones crea composiciones dinámicas. Úsala como punto de partida, no como dogma: la simetría central también comunica fuerza y formalidad cuando el objetivo lo pide.'),

('Jerarquía visual y tamaño de tipos',
 'La jerarquía se construye con tamaño, peso, color y espacio: un titular grande y en negrita, un subtítulo medio y un cuerpo pequeño. Nunca compitas con más de dos niveles fuertes en la misma zona. Si todo es grande, nada importa; el ojo necesita un camino claro de lectura.'),

('Tipografía: emparejamiento y legibilidad',
 'Empareja una serif editorial con una sans limpia, o usa una sola familia con varios pesos. Máximo dos familias por pieza. Cuida el interlíado (1.4 a 1.6 en texto largo), el tracking en titulares y que el tamaño de cuerpo permita lectura cómoda incluso en móvil. La tipografía es el 80 por ciento del tono de la marca.'),

('Paleta de colores y armonía',
 'Una paleta sólida tiene un color primario de marca, un acento de acción y neutros. Usa reglas de armonía: complementario para contraste fuerte, análogo para calma, triádico para variedad. Limita a tres a cinco colores activos y define variantes claro/oscuro para cada uno.'),

('Sistema de color de marca',
 'El sistema de color fija códigos HEX, RGB y CMYK, reglas de uso (porcentaje de superficie) y accesibilidad (contraste mínimo 4.5:1 para texto normal). Documenta colores semánticos: éxito, advertencia, error. Consistencia de color es una de las señales más rápidas de profesionalismo percibido.'),

('Grids y retículas',
 'La retícula divide el lienzo en columnas y márgenes para alinear elementos con coherencia: editorial, web y redes usan columnas distintas pero el principio es el mismo. Romper el grid deliberadamente (un elemento sangrando fuera) genera impacto, pero solo si el resto está perfectamente alineado.'),

('Iconografía y set consistency',
 'Un set de iconos debe compartir grosor de trazo, estilo (relleno o línea), terminaciones y nivel de detalle. Mezclar estilos rompe la percepción de unidad. Para marca, conviene usar un solo set (Lucide, Phosphor, personalizado) y recolorear con tokens en lugar de redibujar.'),

('Fotografía y dirección de arte',
 'La dirección de arte define el look de las imágenes: paleta, iluminación, textura y casting de elementos. Para marca, crea una guía de referencia (moodboard) y repite la misma luz y encuadre en todas las piezas. La consistencia fotográfica vale más que una foto suelta brillante.'),

('Diseño para redes: formatos y safe zones',
 'Cada red tiene formatos: 1:1 y 4:5 en feed de Instagram, 9:16 en stories y reels, 16:9 en YouTube. Deja safe zones donde los iconos de la interfaz no tapen el contenido (esquinas superior e inferior en stories). Diseña el mensaje para verse bien en miniatura antes que en pantalla completa.'),

('Diseño de piezas publicitarias',
 'Un anuncio gráfico tiene un solo mensaje, un beneficio en titular, prueba o apoyo visual y un CTA claro. Evita párrafos: el anuncio se lee en un segundo. Adapta el ángulo (dolor, resultado, prueba social) por variante para poder testear, no solo cambies el color del fondo.'),

('Herramientas de diseño y flujo de trabajo',
 'Flujos habituales: Figma para UI y sistemas, Illustrator para vectores e iconos, Photoshop para foto y composición, Canva para rapidez con plantillas de marca. Trabaja con componentes y estilos maestros para reutilizar; el tiempo ahorrado en la décima pieza paga el diseño del sistema inicial.'),
('Edición de imágenes: capas y máscaras',
 'La edición no destructiva es la base profesional: capas, máscaras, smart objects y ajustes sin fijar (curvas, niveles, saturación). Nunca edites el píxel original sin copia. Las máscaras permiten fundir elementos con control total y deshacer cualquier paso más adelante.'),

('Retoque y composición realista',
 'Al componer elementos de fotos distintas, unifica temperatura de color, dirección de luz, grano y profundidad de campo. Añade una sombra de contacto sutil y evita bordes duros: el ojo detecta la falta de sombra antes que cualquier otro error de recorte.'),

('Recorte y siluetas de alta calidad',
 'Usa selección por color o select subject cuando exista, perfecciona el borde con refined edge y revisa a zoom alto en zonas de pelo o tela. Un mal recorte con halo de fondo blanco o negro es la forma más rápida de que una pieza se vea amateur.'),

('Formatos de imagen para web y print',
 'Para web: WebP o AVIF con fallback JPEG, sRGB, peso controlado y dimensiones 2x para pantallas retina. Para print: CMYK, 300 ppp, sangrado de 3 mm y tipos incrustados. Exportar siempre dos versiones (red y original) evita rehacer piezas cuando cambia el canal.'),

('Corrección de color vs color grading',
 'La corrección de color ajusta balance, exposición y contraste para que la imagen sea fiel y consistente. El color grading añade una intención estética: teals and oranges, cálidos nostálgicos, fríos corporativos. Primero corrige, luego grada; saltarse la corrección contamina todos los ajustes posteriores.'),

('Scopes y medición en color',
 'Los scopes (parada de luz, vectorscopio, waveform) miden valores reales de luminancia y croma. Exposición segura suele mantenerse por debajo de 100 IRE en vídeo, negros cerca de 0 sin aplastar. Confiar solo en el ojo en un monitor sin calibrar lleva a gradados que no se ven igual en otros dispositivos.'),

('Curvas y teoría del color aplicada',
 'Las curvas permiten ajustar sombras, medios y altas luces con precisión; la curva en S añade contraste. En grading, teñir sombras en frío y altas luces en cálido genera separación (teal & orange). Armoniza con el color de marca del cliente para que el video pertenezca a su sistema visual.'),

('LUTs: uso correcto',
 'Una LUT es un mapa de transformación de color, no un filtro mágico. Aplicar una LUT de look a material mal expuesto produce resultados sucios. Usa LUTs de corrección para espacio de trabajo y las de look al final de la cadena, con la opacidad reducida si satura.'),

('Flujo de trabajo de edición de video',
 'Flujo robusto: organizar metraje por escenas, montaje rough cut, refinamiento de ritmo, sound design, color, gráficos y exportación final. Trabaja con proxies si el material es pesado y guarda versiones con fecha. El orden importa: el color después del montaje definitivo ahorra retrabajos.'),

('Ritmo y storytelling en el montaje',
 'El ritmo se controla con duración de planos, silencios y música. Regla práctica: entra tarde y sal temprano en cada plano. En redes, engancha en los primeros 3 segundos y alterna planos para mantener frescura. Cada corte debe responder: ¿esto mueve la historia o solo es bonito?'),

('Audio en edición de video',
 'El audio define la percepción de calidad tanto como la imagen: dialog clarísimo, música a -18 a -12 dB bajo la voz, efectos con aire. Normaliza a -14 LUFS para plataformas. Un video con imagen perfecta y audio malo se percibe amateur al instante.'),

('Producción audiovisual: preproducción',
 'La preproducción define guion, storyboard, lista de planos, locaciones, casting y calendario. Invertir aquí reduce la mitad de los problemas en set. Un storyboard simple de palitos ya evita llegar sin el plano que cierra el argumento o sin el detalle que vende el producto.'),
('Producción en set: luz y encuadre',
 'La luz se construye con tres elementos: clave principal, relleno y contra. Una ventana buena puede ser clave; un reflector, relleno; y una luz detrás, separación del fondo. Encuadres limpios con fondo despejado transmiten más producción que fondos cargados de objetos distractores.'),

('Guion para piezas cortas (reels, ads)',
 'Estructura de un reel o anuncio de 15 a 30 segundos: gancho (problema o promesa), desarrollo (un solo punto), prueba o demo, CTA. Escribe para ser escuchado, no leído: frases cortas, lenguaje oral, un solo mensaje. El guion se prueba en voz alta antes de grabar.'),

('Copywriting audiovisual: hook y CTA',
 'El hook es la primera frase que decide si se quedan: una pregunta incómoda, un dato sorprendente o una promesa concreta. El CTA cierra con una sola acción clara. Evita presentaciones largas de marca al inicio: gana primero la atención, presenta la marca después.'),

('Storytelling en video de marca',
 'El video de marca funciona mejor con una transformación que con una lista de servicios: antes, fricción, método, después. Humaniza con personas reales del equipo o clientes. La emoción se construye con detalle concreto (un gesto, una cifra, un momento), no con adjetivos grandilocuentes.'),

('Guion de documental y testimonio',
 'En testimonios, guiona las preguntas, no las respuestas: busca anécdotas concreto con cifras y emociones. Graba b-roll de apoyo mientras se responde. El mejor documental de marca se arma en la edición: ordenar las respuestas como una historia con arco, no como un listado de frases.'),

('Community management: fundamentos',
 'El community management es cultivar la relación con la comunidad: responder, moderar, escuchar y programar contenido con tono coherente. No es solo publicar. Define personalidad de marca, tiempos de respuesta y protocolo de crisis antes de que lleguen los comentarios difíciles.'),

('Calendario de contenido y pilares',
 'Los pilares de contenido son los 3 a 5 temas que la marca puede defender con autoridad (educación, casos, cultura, producto, behind the scenes). Un calendario asigna pillar, formato y fecha. Esto evita el vacío de ideas y garantiza variedad sin improvisar cada mañana.'),

('Engagement: qué lo mueve',
 'El engagement se mueve con utilidad, identidad emocional y participación directa (preguntas, encuestas, retos). Los algoritmos premian comentarios y guardados por encima de likes. Diseña piezas que inviten a responder y responde los comentarios pronto: el diálogo multiplica el alcance.'),

('Redes sociales: estrategia por plataforma',
 'Instagram: estética y comunidad; TikTok: autenticidad y ritmo; YouTube: profundidad y búsqueda; LinkedIn: autoridad profesional; X: velocidad y opinión. Adapta el mensaje al comportamiento de cada plataforma en lugar de publicar el mismo corte en todas.'),

('Ritmo de publicación sostenible',
 'Mejor tres piezas fuertes por semana que tres al día mediocres. Define un mínimo viable que el equipo pueda sostener durante meses y crea plantillas para acelerar la producción. La constancia construye audiencia; los picos de pánico creativo la diluyen.'),

('Analítica de redes y métricas de engagement',
 'Mide más allá de seguidores: alcance, tasa de guardado, compartidos, comentarios cualitativos y clics al sitio. Identifica las piezas con mejor desempeño por ángulo y formato, y repite la fórmula con variaciones. Los seguidores son vanidad si no hay conversación ni acción.'),

('Gestión de crisis en redes',
 'Crisis: no publiques a la defensiva. Primero escucha, verifica hechos, responde con empatía y responsabilidad, y comunica los pasos correctivos. Un mensaje frío corporativo empeora la percepción; una respuesta humana, transparente y rápida la mitiga.'),
('Branding: identidad visual de marca',
 'La identidad visual es el sistema que hace reconocible a la marca: logotipo con versiones (principal, monocromo, isotipo), paleta, tipografías, iconografía, fotografía y grafismos. Debe funcionar en gran y pequeño, en claro y oscuro, en digital e impreso. Un buen sistema se adapta; un logo solo no es una marca.'),

('Manual de marca y gobernanza',
 'Un manual de marca documenta usos correctos e incorrectos: espacio de protección del logo, tamaños mínimos, colores, tono de voz y ejemplos aplicados. La gobernanza (quén aprueba, dónde viven los assets) evita que cada colaborador improvise versiones que diluyen el sistema.'),

('Naming y verbal identity',
 'El naming debe ser pronunciable, distinguible y preferiblemente disponible como dominio. La verbal identity define tono de voz, vocabulario propio y frases clave. Coherencia entre lo que la marca dice en un anuncio, en un correo y en un error de pago es lo que construye personalidad real.'),

('Auditoría de marca',
 'Una auditoría de marca revisa percepción interna y externa, consistencia en cada punto de contacto, fortaleza competitiva y brechas entre promesa y experiencia. Herramientas: entrevistas a clientes, revisión de activos, análisis de redes y benchmarking visual frente a competidores clave.'),

('Posicionamiento y mapa perceptual',
 'El posicionamiento define el territorio mental que la marca quiere ocupar (ej.: la más fácil de usar, la premium de servicio). Un mapa perceptual grafica a competidores por ejes elegidos por el cliente. El objetivo no es ser mejor en todo, sino ser claramente superior en un eje relevante.'),

('Brand equity y reconocimiento',
 'El brand equity es el valor intangible acumulado: reconocimiento, asociaciones positivas, lealtad y percepción de calidad. Se construye con exposición consistente y experiencia cumplida. Marcas con alto equity pueden cobrar más y lanzar productos con menos fricción de adquisición.'),

('Arquetipos de marca',
 'Los arquetipos (héroe, sabio, rebelde, cuidador, explorador, creador, gobernador, payaso) ayudan a definir personalidad y voz. Úsalos como brújula creativa, no como disfraz: una marca de servicios B2B que finge ser rebelde sin sustancia se siente inconsistente.'),

('Rebranding: cuándo y cómo',
 'Un rebranding se justifica cuando la marca ya no representa el negocio o la audiencia, no por agotamiento interno. Fasealo: investigación, estrategia, identidad, migración de activos y comunicación interna primero. Cambiar solo el logo sin cambiar experiencia es pintura de cara.'),

('Producción audiovisual: equipos accesibles',
 'Producción profesional no requiere cine: un buen smartphone, micrófono de solapa, luz de anillo o softbox y trípode permiten empezar. Prioriza audio y luz antes que cámara: afectan más la percepción de calidad. Escala el equipo a medida que el presupuesto y el volumen crecen.'),

('Iluminación para video casero',
 'Luz principal a 45 grados del sujeto, reflector o luz suave de relleno en el lado opuesto y algo de luz de fondo para separar. Evita mezclar temperaturas de color (luz de ventana amarilla con LED azulado). Un softbox barato mejora más que comprar otra cámara.'),

('Guion de spots y demovideos',
 'Un spot de marca de 30 a 60 segundos necesita un conflicto humano claro, la marca como aliada y un cierre memorabler (claim o situación). Un demovideo muestra el producto en uso real, sin narración innecesaria. Adapta el guion al canal: corte 15s para ads, versión larga para YouTube.'),

('Locución y grabación de voz',
 'Graba en lugar silencioso, con micrófono cercano, hablando con energía controlada y pausas marcadas. Lee el guion en voz alta antes de grabar. La locución clara y cálida eleva cualquier pieza; un audio con eco o viento grita amateurismo aunque la imagen sea bonita.'),
('Postproducción: efectos y motion graphics',
 'El motion graphics da vida a datos y mensajes: anima texto clave, transiciones simples y gráficos de producto. Menos es más: una animación limpia y sincronizada con la música se siente premium; los efectos gratuitos de plantilla restan seriedad. Prioriza claridad del mensaje sobre espectáculo.'),

('Exportación y códecs para cada canal',
 'Exporta según destino: MP4 H.264 con bitrate alto para redes, ProRes para edición intermedia, vertical 9:16 nativo para stories y reels (no recortes un 16:9 al final). Sube el master más limpio posible; las plataformas recomprimen y cada recompressão castiga dos veces si el original ya estaba mal.'),

('Publicidad: estrategia creativa',
 'La estrategia creativa define el ángulo, la promesa y las pruebas antes de diseñar. Ángulos habituales: problema-solución, comparación, prueba social, demostración de uso, oferta. Testea ángulos, no solo colores: un ángulo ganador multiplicado en variantes es el sistema de escalado de anuncios.'),

('Copy publicitario: headlines que convierten',
 'Un headline de anuncio nombra el beneficio o el dolor en palabras del cliente, no del producto. Fórmulas útiles: Cómo [lograr resultado] sin [dolor], [Resultado] en [tiempo], El método para [segmento]. El subtítulo resuelve la primera objeción; el CTA elimina la fricción de dar el paso.'),

('Creatividades y formatos de anuncios',
 'Para rendimiento: video corto con subtítulos (mayor alcance y retargeteable), carrusel para contar beneficios secuenciales y estáticos limpios para remarketing. Cambia el primer frame, el hook y el ángulo entre variantes. Las creatividades se fatigan: renuévalas con frecuencia antes de que suba el CPM.'),

('Remarketing creativo',
 'El remarketing recupera fríos con mensajes específicos: a visitantes sin lead, ofreces el lead magnet; a abandonos de formulario, una objeción resuelta; a clientes, cross-sell o referidos. El error es repetir el mismo genérico. Cada etapa merece su propia creatividad y su propia promesa.'),

('Producción de contenido UGC',
 'El contenido generado por usuarios (clientes o creadores reales) convierte porque se siente auténtico. Estructura briefs sencillos: problema, uso del producto, resultado, CTA. Recompensa con visibilidad o beneficio, obtén permiso de uso y guía lo mínimo: la fluidez no profesional es parte del valor.'),

('Análisis de marca: percepción',
 'Medir percepción de marca incluye reconocimiento asistido y espontáneo, atributos asociados, Net Promoter Score y share of search. Compara con competidores clave y con la percepción interna del equipo. Las brechas entre cómo se ve la marca desde dentro y desde el cliente son el mapa de trabajo del branding.'),

('Métricas de mercado y tamaño',
 'Métricas de mercado: TAM (mercado total), SAM (segmento servible), SOM (obtenible realista), share of voice, crecimiento del sector y sensibilidad al precio. Estas cifras contextualizan el pipeline: un negocio con techo bajo necesita precios o expansión distinta que uno con mercado enorme y poca penetración.'),

('Benchmark competitivo creativo',
 'Un benchmark creativo audita cómo comunican los competidores: tono, formatos, canales, frecuencia, claim y prueba social. No para copiar, sino para encontrar el espacio no ocupado. Si todos hablan de precio, gana el que hable de servicio o experiencia de forma demostrable.'),

('Storytelling de fundador y marca personal',
 'La marca personal del fundador humaniza la empresa: aprendizajes, detrás de escenas, opiniones con fundamento y disponibilidad para la comunidad. En B2B es canal de captación de clientes y talento. Autenticidad y consistencia pesan más que volumen; la fuerza de personalidad sin sustancia se desgasta.'),

('Producción audiovisual low budget profesional',
 'Con presupuesto ajustado: guion afilado, un solo locación con buena luz, audio decente y el ritmo del montaje hacen el trabajo. Filma cobertura de seguridad (planos de apoyo, detalle de manos, insertos) que permitan armar el corte en edición. La disciplina de rodaje compensa la falta de equipo.'),

('Flujo creativo completo: del brief al publish',
 'Flujo que escala: brief (objetivo, audiencia, mensaje, KPI) → guion/storyboard → producción → edición + color + audio → revisión de marca → programación → medición semanal → aprendizaje documentado. Cada pieza debe nacer de un objetivo y dejar un aprendizaje escrito; así el sistema aprende y deja de improvisar.');