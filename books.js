const groups = [
  { id:'bruma-1', section:'principal', title:'Nacidos de la Bruma · Era 1', note:'Completa la trilogía original en orden.', books:[
    ['final','El Imperio Final','The Final Empire'],
    ['pozo','El pozo de la ascensión','The Well of Ascension'],
    ['heroe','El héroe de las eras','The Hero of Ages'],
  ]},
  { id:'puente', section:'principal', title:'Dos novelas independientes', note:'Las dos lecturas que Sanderson propone antes de abrir el Archivo.', books:[
    ['aliento','El aliento de los dioses','Warbreaker'],
    ['trenza','Trenza del mar Esmeralda','Tress of the Emerald Sea'],
  ]},
  { id:'archivo-1', section:'principal', title:'El Archivo de las Tormentas · Inicio', note:'Tras el primer tomo, el autor propone una pausa opcional. Puedes elegir una lectura de «Pausas» o seguir con el Archivo.', books:[
    ['reyes','El camino de los reyes','The Way of Kings'],
  ]},
  { id:'archivo-2', section:'principal', title:'El Archivo de las Tormentas · Segundo tramo', note:'La novela corta va después del segundo tomo. Aquí puedes hacer otra pausa opcional.', books:[
    ['palabras','Palabras radiantes','Words of Radiance'],
    ['danza','Danzante del filo','Edgedancer','Novela corta · también en Arcanum ilimitado'],
  ]},
  { id:'archivo-3', section:'principal', title:'El Archivo de las Tormentas · Tercer tramo', note:'La novela corta va después del tercer tomo. Aquí queda otra pausa opcional.', books:[
    ['jura','Juramentada','Oathbringer'],
    ['esquirla','Esquirla del amanecer','Dawnshard','Novela corta'],
  ]},
  { id:'archivo-4', section:'principal', title:'El Archivo de las Tormentas · Cuarto tramo', note:'En su video, Sanderson coloca El hombre iluminado después del cuarto tomo.', books:[
    ['ritmo','El ritmo de la guerra','Rhythm of War'],
    ['sol','El hombre iluminado','The Sunlit Man','Novela independiente'],
  ]},
  { id:'archivo-5', section:'principal', title:'El Archivo de las Tormentas · Quinto tomo', note:'Actualización de la ruta para incluir el quinto tomo publicado después del video.', books:[
    ['viento','Viento y verdad','Wind and Truth'],
  ]},
  { id:'bruma-2', section:'pausas', title:'Nacidos de la Bruma · Era 2', note:'Mantén el orden de los cuatro tomos. Después del tercer tomo se habilita una lectura complementaria.', books:[
    ['aleacion','Aleación de ley','The Alloy of Law'],
    ['sombras','Sombras de identidad','Shadows of Self'],
    ['brazales','Brazales de duelo','The Bands of Mourning'],
    ['secreta','Nacidos de la Bruma: Historia secreta','Mistborn: Secret History','También en Arcanum ilimitado'],
    ['metal','El metal perdido','The Lost Metal'],
  ]},
  { id:'independientes', section:'pausas', title:'Novelas para intercalar', note:'Dos opciones independientes que el autor menciona para las pausas del Archivo.', books:[
    ['yumi','Yumi y el pintor de pesadillas','Yumi and the Nightmare Painter'],
    ['elantris','Elantris','Elantris'],
  ]},
  { id:'arcanum', section:'complementos', title:'Relatos de Arcanum ilimitado', note:'La antología reúne lecturas breves. Las novelas cortas que intercalamos en otras secciones aparecen en su lugar de lectura. Su fragmento de Arena blanca se puede sustituir por la edición gráfica completa.', books:[
    ['alma','El alma del emperador','The Emperor’s Soul'],
    ['esperanza','La esperanza de Elantris','The Hope of Elantris','Después de Elantris','elantris'],
    ['undecimo','El undécimo metal','The Eleventh Metal','Ya puedes leerlo tras El Imperio Final','final'],
    ['allomante','El alomante Jak y los Pozos de Eltania','Allomancer Jak and the Pits of Eltania','Intercálalo después de Aleación de ley','aleacion'],
    ['silencio','Sombras por Silencio en los bosques del infierno','Shadows for Silence in the Forests of Hell'],
    ['ocaso','Sexto del Ocaso','Sixth of the Dusk','Lectura opcional antes de Islas de la Ascuaoscura'],
  ]},
  { id:'otros', section:'complementos', title:'Más Cosmere', note:'Lecturas adicionales. La posición de Islas es una sugerencia editorial para esta web.', books:[
    ['diciembre','The Fires of December','The Fires of December','Novela independiente · edición digital distribuida a mecenas en 2026'],
    ['arena','Arena blanca','White Sand','Novela gráfica'],
    ['islas','Islas de la Ascuaoscura','Isles of the Emberdark','Sugerida al final del recorrido principal','viento'],
  ]},
  { id:'cuentos-ilustrados', section:'complementos', title:'Hoid’s Storybook Collection', note:'Ediciones ilustradas de 2026. Sugerencia para esta ruta: déjalas para después de completar los cinco tomos del Archivo.', books:[
    ['cuentos-hoid','Hoid’s Storybook Collection','Hoid’s Storybook Collection','Colección ilustrada · lectura opcional','viento'],
  ]},
  { id:'escuadron', section:'fuera', title:'Escuadrón · Saga principal', note:'Una serie aparte. Sanderson la recomienda como entrada a su ciencia ficción. Sigue el orden de los tomos.', books:[
    ['sky1','Escuadrón','Skyward'], ['sky2','Estelar','Starsight'], ['sky3','Citónica','Cytonic'], ['sky4','Desafiante','Defiant'],
  ]},
  { id:'otras-sagas', section:'fuera', title:'Otras puertas de entrada', note:'Selección de recomendaciones del autor fuera del Cosmere. Puedes empezar con cualquiera.', books:[
    ['steel','Steelheart','Steelheart','The Reckoners · libro 1'],
    ['alcatraz','Alcatraz contra los Bibliotecarios Malvados','Alcatraz vs. the Evil Librarians','Libro 1'],
    ['ritmatista','El Rithmatista','The Rithmatist'],
    ['mago','La guía del mago frugal para sobrevivir en la Inglaterra del Medievo','The Frugal Wizard’s Handbook for Surviving Medieval England'],
    ['legion','Legión','Legion','Empieza por la primera novela corta'],
  ]},
];
const sections = [
  ['principal','Ruta principal'],
  ['pausas','Pausas'],
  ['complementos','Complementos'],
  ['fuera','Fuera del Cosmere'],
];
