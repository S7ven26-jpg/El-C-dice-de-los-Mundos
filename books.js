const groups = [
  { id:'bruma-1', section:'principal', title:'Nacidos de la Bruma · Era 1', shortTitle:'Era 1', note:'Completa la trilogía original en orden antes de pasar a la Era 2.', books:[
    ['final','El Imperio Final','Mistborn: The Final Empire'],
    ['pozo','El pozo de la ascensión','The Well of Ascension'],
    ['heroe','El héroe de las eras','The Hero of Ages'],
  ]},
  { id:'sel', section:'principal', title:'Autoconclusivos para respirar', shortTitle:'Autoconclusivos', note:'Una novela y una lectura breve antes de empezar el Archivo.', books:[
    ['elantris','Elantris','Elantris'],
    ['alma','El alma del emperador','The Emperor’s Soul','Novela corta · también en Arcanum ilimitado'],
  ]},
  { id:'archivo', section:'principal', title:'El Archivo de las Tormentas', shortTitle:'El Archivo', note:'Los primeros cuatro tomos, con dos novelas cortas intercaladas.', books:[
    ['reyes','El camino de los reyes','The Way of Kings'],
    ['palabras','Palabras radiantes','Words of Radiance'],
    ['danza','Danzante del filo','Edgedancer','Novela corta · también en Arcanum ilimitado'],
    ['jura','Juramentada','Oathbringer'],
    ['esquirla','Esquirla del amanecer','Dawnshard','Novela corta'],
    ['ritmo','El ritmo de la guerra','Rhythm of War'],
  ]},
  { id:'puente', section:'principal', title:'Entre sagas', shortTitle:'Entre sagas', note:'Una novela independiente antes de volver a Nacidos de la Bruma.', books:[
    ['aliento','El aliento de los dioses','Warbreaker'],
  ]},
  { id:'bruma-2', section:'principal', title:'Nacidos de la Bruma · Era 2', shortTitle:'Era 2', note:'Completa la trilogía original antes de leer este tramo.', books:[
    ['secreta','Nacidos de la Bruma: Historia secreta','Mistborn: Secret History','Novela corta · también en Arcanum ilimitado'],
    ['aleacion','Aleación de ley','The Alloy of Law'],
    ['sombras','Sombras de identidad','Shadows of Self'],
    ['brazales','Brazales de duelo','The Bands of Mourning'],
    ['metal','El metal perdido','The Lost Metal'],
  ]},
  { id:'otros-mundos', section:'principal', title:'Los viajes de Hoid y otros mundos', shortTitle:'Otros mundos', note:'Tres novelas independientes en el orden que elegiste.', books:[
    ['trenza','Trenza del mar Esmeralda','Tress of the Emerald Sea'],
    ['yumi','Yumi y el pintor de pesadillas','Yumi and the Nightmare Painter'],
    ['sol','El hombre iluminado','The Sunlit Man'],
  ]},
  { id:'archivo-5', section:'principal', title:'Cierre del primer arco del Archivo', shortTitle:'El Archivo V', note:'Regresa al Archivo para leer el quinto tomo.', books:[
    ['viento','Viento y verdad','Wind and Truth'],
  ]},
  { id:'lecturas-finales', section:'principal', title:'Al final del recorrido', shortTitle:'Lecturas finales', note:'La antología contiene material que adelanta detalles de varias obras. Consúltala aquí al final de tu ruta.', books:[
    ['antologia','Arcanum ilimitado','Arcanum Unbounded','Antología · incluye relatos que puedes haber leído por separado'],
    ['islas','Islas de la Ascuaoscura','Isles of the Emberdark'],
    ['diciembre','The Fires of December','The Fires of December','Tapa dura de Tor en EE. UU. · prevista para el 8 de diciembre de 2026'],
  ]},
  { id:'arcanum', section:'complementos', title:'Relatos de Arcanum ilimitado', note:'La antología reúne lecturas breves. Las novelas cortas que intercalamos en otras secciones aparecen en su lugar de lectura. Su fragmento de Arena blanca se puede sustituir por la edición gráfica completa.', books:[
    ['esperanza','La esperanza de Elantris','The Hope of Elantris','Después de Elantris','elantris'],
    ['undecimo','El undécimo metal','The Eleventh Metal','Ya puedes leerlo tras El Imperio Final','final'],
    ['allomante','El alomante Jak y los Pozos de Eltania','Allomancer Jak and the Pits of Eltania','Intercálalo después de Aleación de ley','aleacion'],
    ['silencio','Sombras por Silencio en los bosques del infierno','Shadows for Silence in the Forests of Hell'],
    ['ocaso','Sexto del Ocaso','Sixth of the Dusk','Lectura opcional antes de Islas de la Ascuaoscura'],
  ]},
  { id:'otros', section:'complementos', title:'Más Cosmere', note:'Lecturas adicionales fuera de tu ruta principal.', books:[
    ['arena','Arena blanca','White Sand','Novela gráfica'],
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
  ['complementos','Complementos'],
  ['fuera','Fuera del Cosmere'],
];
