import type { Dictionary } from '../types';

export const es: Dictionary = {
  nav: {
    language: 'Idioma',
    intake: 'Ingesta de correo',
    whitepaper: 'Whitepaper',
  },
  footer: {
    terms: 'Términos',
    privacy: 'Privacidad',
    ledger: 'Ledger',
    contact: 'Contacto',
  },
  common: {
    home: 'Inicio',
    continue: 'Continuar',
    copy: 'Copiar',
    copied: 'Copiado',
    loading: 'Cargando…',
    toggleTheme: 'Cambiar tema',
  },
  home: {
    heroTitle: 'La IA puede falsificarlo todo.',
    heroAccent: 'Menos el ayer.',
    lede: 'PACT registra leftover para agentes. La consulta es tipo más identidad. PACT no decide.',
    kindMail: 'Correo',
    kindCt: 'Certificados',
    kindRekor: 'Firmas',
    hintMail: 'Dominio de envío (header_from)',
    hintCt: 'Hostname en SAN/CN',
    hintRekor: 'Sujeto residual de Rekor — URI de GitHub, correo o host',
    identityLabel: 'Identidad',
    aside: 'Sin puntuación. Sin mezcla. Vacío es una respuesta. El juicio queda fuera.',
    whitepaperCta: 'Whitepaper',
  },
  connect: {
    backHome: '← Inicio',
    eyebrow: 'Ingesta de correo',
    title: 'Conservar el leftover de correo',
    intro:
      'Añade un destino de informes para conservar los informes DMARC independientes. Esto no es un perfil. Certificados y firmas se consultan por sus propias identidades.',
    yourDomain: 'Dominio de envío',
    pathCloudflareTitle: 'Uso Cloudflare',
    pathCloudflareDesc: 'Un clic — añadimos la línea DNS.',
    pathManualTitle: 'Añadirla a mano',
    pathManualDesc:
      'Una línea para pegar donde gestiones el DNS — GoDaddy, Namecheap u otro host.',
    pathToolTitle: 'Ya uso una herramienta',
    pathToolDesc: 'Postmark o similar — añade esta dirección como destino de informes.',
    putOnLedger: 'Poner en el ledger',
    ledgerExplain:
      'Registra el dominio de envío para no descartar informes de correo. No adjunta leftover de GitHub ni un log de firmas a este sitio.',
    backToPaths: 'Elegir un método',
    whatDoesThisDo: '¿Qué hace esto?',
    cloudflareExplain:
      'Iniciarás sesión en Cloudflare y añadiremos PACT como destino de informes en DNS para conservar el leftover de correo. Después no hay un perfil de dominio.',
    toolIntro: 'En la configuración de tu herramienta, añade esto:',
    toolExplain:
      'Tu herramienta ya recoge informes de este dominio. Añadir esta dirección nos incluye en el leftover de correo. Pon primero el dominio de envío en el ledger. El historial empieza cuando llega el primer informe independiente (suele ser en 24–48 horas).',
    manualIntro:
      'Pega esto donde gestiones el DNS de tu sitio (pregunta a tu host si no sabes dónde):',
    manualExplain:
      'Una línea para que los sistemas receptores independientes envíen informes agregados aquí. Si ya tienes una línea similar, añade nuestra dirección en vez de reemplazarla. Pon primero el dominio de envío en el ledger. El historial empieza cuando llega el primer informe independiente (suele ser en 24–48 horas).',
    doneTitle: 'La ingesta de correo está activa.',
    doneBody:
      'El dominio de envío está en el ledger. Conserva la línea DNS. El leftover de correo aparece cuando llega el primer informe independiente — no al enviar este formulario. Consúltalo como kind=mail.',
    doneNext: 'Consultar el ledger',
    errors: {
      invalid_domain: 'Introduce un dominio válido (p. ej. example.com).',
      server_config: 'Falta CONNECT_STATE_SECRET o las credenciales de escritura del ledger.',
      oauth_not_configured: 'El inicio de sesión de Cloudflare no está configurado en este servidor.',
      missing_code: 'El inicio de sesión se canceló o no se completó.',
      invalid_state: 'La sesión caducó — vuelve a intentarlo.',
      token_exchange: 'No se pudo terminar la conexión con Cloudflare.',
      zone_not_found:
        'Este dominio no estaba en la cuenta de Cloudflare que elegiste. Prueba con otra cuenta.',
      dmarc_update:
        'No se pudo terminar la configuración automática. Prueba la opción manual.',
      register: 'Casi — el último paso falló. Inténtalo de nuevo.',
      somethingWrong: 'Algo salió mal.',
    },
  },
  whitepaper: {
    eyebrow: 'PACT',
    title: 'Whitepaper',
    subtitle: 'Procedencia de trazas acumuladas y comprobables',
    updated: 'Agosto de 2026',
  },
  legal: {
    eyebrow: 'Legal',
    lastUpdated: 'Última actualización: 26 de agosto de 2026',
    termsTitle: 'Términos del servicio',
    privacyTitle: 'Política de privacidad',
    emailLabel: 'Email',
    terms: [
      {
        title: '1. Aceptación de los términos',
        body: 'Al acceder o utilizar este sitio web (webuildreal.dev) y los servicios relacionados del movimiento we build real, aceptas estos Términos del servicio. Si no estás de acuerdo, no uses el sitio ni envíes un dominio de envío para la ingesta de correo.',
      },
      {
        title: '2. Quiénes somos',
        body: 'Este sitio es la casa pública de we build real, un movimiento por una historia verificable. PACT es un protocolo abierto. PBM Labs LLC (“nosotros”), una limited liability company de Wyoming, proporciona la primera implementación de referencia de PACT. El sitio documenta esa implementación y ofrece ingesta de leftover de correo. El leftover comprobable está en la API pública del ledger, no en un perfil humano de dominio.',
      },
      {
        title: '3. El servicio',
        body: 'PACT captura rastros residuales que sistemas independientes ya emiten y los registra en un árbol Merkle de solo añadido. Cada fuente residual es un tipo distinto en ese árbol. El leftover de correo proviene de informes agregados DMARC. El leftover de certificados proviene de logs públicos de Certificate Transparency. El leftover de firmas proviene del log público Rekor, indexado por sujeto residual (URI de GitHub, correo o host) — no por un sitio web conectado. Los tipos no se mezclan en una puntuación. La ingesta de correo pone un dominio de envío en el ledger y requiere añadir PACT como destino de informes en DNS. No leemos el contenido de los mensajes, las identidades de los destinatarios ni los datos del buzón.',
      },
      {
        title: '4. Ledger público',
        body: 'La información publicada en el ledger — incluidas identidades residuales, historial confirmado de forma independiente y pruebas criptográficas — está pensada para ser visible y consultable por agentes. No envíes un dominio de envío si no estás autorizado a hacer que los metadatos de autenticación de ese dominio formen parte de un libro público.',
      },
      {
        title: '5. Tus responsabilidades',
        body: 'Solo debes enviar dominios de envío que controles o que estés autorizado a gestionar. Eres responsable de la exactitud de los cambios de DNS que realices, de cumplir tus propias políticas y la legislación aplicable, y de no usar el servicio para acosar, defraudar o falsear a terceros. No puedes intentar acceso no autorizado, interferir con el servicio, hacer scraping de forma que lo degrade, introducir malware ni hacer un uso indebido del sitio.',
      },
      {
        title: '6. Sin asesoramiento; sin garantía de legitimidad',
        body: 'El historial y las pruebas criptográficas son un registro informativo de trazas residuales de sistemas independientes — informes de correo, logs públicos de certificados y logs públicos de firmas — como tipos distintos. No constituyen asesoramiento legal, financiero, de cumplimiento ni empresarial, y no garantizan que un nombre, organización o persona sea legítimo, seguro para operar o libre de riesgo. El juicio queda fuera del registro. Sigues siendo el único responsable de tus propias decisiones.',
      },
      {
        title: '7. Sin servicios financieros',
        body: 'No somos un banco, corredor, negocio de servicios monetarios ni institución financiera. No procesamos, retenemos, custodiamos ni transferimos moneda, valores ni activos financieros.',
      },
      {
        title: '8. Propiedad intelectual',
        body: 'El contenido del sitio, la marca y el diseño de “we build real” son propiedad de PBM Labs LLC o de sus licenciantes, salvo que se indique lo contrario. La especificación del Protocolo PACT y el whitepaper se publican abiertamente para su revisión e implementación; se fomentan implementaciones de terceros del protocolo, sujetas a sus propios términos de licencia cuando corresponda. No se conceden derechos salvo el derecho limitado a usar este sitio según lo previsto.',
      },
      {
        title: '9. Servicios de terceros',
        body: 'El sitio puede depender de o enlazar a terceros (por ejemplo, proveedores DNS como Cloudflare, infraestructura de hosting y edge, y proveedores de bases de datos). No controlamos los servicios de terceros y no somos responsables de su contenido, disponibilidad o políticas. Tu uso de esos servicios está sujeto a sus términos.',
      },
      {
        title: '10. Exención de garantías',
        body: 'El sitio y el servicio se proporcionan “tal cual” y “según disponibilidad”, sin garantías de ningún tipo, expresas o implícitas, incluidas las de comerciabilidad, idoneidad para un fin particular y no infracción. No garantizamos que el servicio sea ininterrumpido, libre de errores, completo o seguro, ni que las raíces o pruebas publicadas cumplan tus requisitos.',
      },
      {
        title: '11. Limitación de responsabilidad',
        body: 'En la máxima medida permitida por la ley, PBM Labs LLC y sus miembros, directivos y contratistas no son responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos derivados de tu uso del sitio o del servicio, incluida la confianza en el ledger público, incluso si se les informó de la posibilidad de tales daños.',
      },
      {
        title: '12. Cambios',
        body: 'Podemos actualizar estos Términos de vez en cuando. La versión revisada se publicará en esta página con una fecha actualizada. El uso continuado del sitio tras los cambios constituye la aceptación de los Términos revisados.',
      },
      {
        title: '13. Ley aplicable',
        body: 'Estos Términos se rigen por las leyes del Estado de Wyoming, Estados Unidos, sin tener en cuenta los principios de conflicto de leyes.',
      },
      {
        title: '14. Contacto',
        body: 'Avisos legales y preguntas sobre estos Términos: hello@pbm-labs.com.',
      },
    ],
    privacy: [
      {
        title: '1. Resumen',
        body: 'Esta Política de privacidad explica cómo PBM Labs LLC trata la información cuando usas webuildreal.dev — la casa pública del movimiento we build real y de la primera implementación de referencia del protocolo abierto PACT. PACT registra rastros residuales: informes agregados DMARC, metadatos de registros públicos de Certificate Transparency y metadatos del log público Rekor. Los informes agregados de correo no contienen contenido de mensajes ni identidades personales. Los datos de CT y Rekor ya son escape público de logs, incluidas las identidades Rekor ya publicadas en ese log.',
      },
      {
        title: '2. Información que procesamos',
        body: 'Datos de dominio y protocolo: dominios de envío enviados para la ingesta de correo; metadatos de informes agregados DMARC (organización informante, periodo, recuentos de acierto/fallo de autenticación, selectores e identificadores de infraestructura en forma hasheada o resumida); metadatos de primera aparición de Certificate Transparency desde logs públicos (emisor, not-before, hora del log, huella); sujetos residuales de Rekor tal como ya constan en el log (URI de GitHub, correo o host; hora integrada; id de entrada); hojas y raíces Merkle y datos públicos de verificación. Datos del flujo de ingesta: cadenas de dominio que envías; si usas OAuth de Cloudflare, tokens e información de zona necesarios para actualizar DNS en tu nombre durante esa sesión. Preferencias del navegador: tema e idioma almacenados en el almacenamiento local de tu dispositivo. No operamos cuentas de usuario de consumo ni perfiles de marketing en este sitio.',
      },
      {
        title: '3. Qué no recopilamos',
        body: 'No accedemos, leemos ni almacenamos cuerpos de mensajes de email, asuntos, identidades de destinatarios ni contenidos de buzones a través del Protocolo PACT. Los informes agregados que usa el protocolo no son datos personales por diseño.',
      },
      {
        title: '4. Cómo usamos la información',
        body: 'Usamos la información anterior para operar la ingesta de leftover de correo, ingerir y publicar historial confirmado de forma independiente, mantener pruebas criptográficas, prevenir abusos y mejorar la fiabilidad del servicio. Los campos del ledger se publican para que cualquiera — incluidos agentes — pueda volver a comprobar lo ocurrido.',
      },
      {
        title: '5. Ledger público',
        body: 'Las identidades residuales y su historial confirmado de forma independiente y sus pruebas están pensados para ser públicos en la API del ledger. No envíes un dominio de envío a menos que entiendas que los metadatos de autenticación relacionados aparecerán en un libro público. Este sitio no publica un perfil humano de evidencia ordenado.',
      },
      {
        title: '6. Proveedores de servicios',
        body: 'Usamos proveedores de infraestructura para alojar el sitio y almacenar datos del protocolo (incluido hosting edge y servicios de bases de datos). Si te conectas mediante OAuth de Cloudflare, Cloudflare procesa la autenticación y las actualizaciones de DNS bajo sus términos. Los proveedores pueden procesar datos en Estados Unidos u otras jurisdicciones donde operen.',
      },
      {
        title: '7. Cookies y almacenamiento local',
        body: 'No usamos píxeles de seguimiento publicitario ni de analítica en este sitio. Almacenamos preferencias esenciales (como el tema y el idioma) en el almacenamiento local de tu navegador. Puedes borrarlas en la configuración del navegador.',
      },
      {
        title: '8. Conservación',
        body: 'Los datos del libro público se conservan para preservar la integridad del registro de solo añadido. Los registros operativos y los datos de sesión de ingesta se conservan solo según sea necesario para operar, asegurar y depurar el servicio, y para cumplir obligaciones legales.',
      },
      {
        title: '9. Seguridad',
        body: 'Aplicamos medidas técnicas y organizativas razonables adecuadas a un servicio público de verificación. Ningún método de transmisión o almacenamiento es completamente seguro.',
      },
      {
        title: '10. Tus derechos',
        body: 'Según tu ubicación, puedes tener derechos de acceso, rectificación o eliminación de los datos personales que conservemos sobre ti. Los nombres de dominio y las entradas del libro público no se tratan como datos personales en el modelo principal de esta política; contáctanos si crees que conservamos datos personales sobre ti de otra forma. No vendemos datos personales.',
      },
      {
        title: '11. Cambios',
        body: 'Podemos actualizar esta Política de privacidad de vez en cuando. La versión revisada se publicará en esta página con una fecha actualizada.',
      },
      {
        title: '12. Contacto',
        body: 'Preguntas de privacidad: hello@pbm-labs.com.',
      },
    ],
  },
};
