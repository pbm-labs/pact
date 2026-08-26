export const WHITEPAPER_ES = `
Los identificadores son baratos. Un dominio, un perfil, una insignia — todo eso se puede fabricar esta tarde. El ayer no, si alguien más ya estaba mirando.

PACT es un registro público de trazas que sistemas independientes ya emiten. Los sistemas de correo generan informes agregados de autenticación. Los navegadores ya exigieron logs públicos de certificados. La firma de software ya escribe un log público. Nadie se une a una red nueva. El DNS solo apunta aquí el flujo de correo. El registro publica lo que ocurrió. No decide lo que significa.

El nombre es Provenance of Accumulated Checkable Traces — procedencia de trazas acumuladas y comprobables. Procedencia: las trazas tienen una fuente que no es este operador. Acumuladas: el registro crece con el tiempo; no se puede rellenar hacia atrás. Comprobables: cualquiera puede recomputar la inclusión contra una raíz publicada.

Los modelos generativos abaratan identificadores y documentos nuevos. No abaratan el ayer. El único registro que sobrevive a eso es un registro que alguien más ya estaba escribiendo.

## Trazas residuales

Un sistema de identidad nuevo suele pedir al mundo un rito nuevo: instalar una app, acuñar una credencial, pasar una ceremonia, confiar en un emisor nuevo. Esos sistemas fallan a la escala que importa, porque quienes tendrían que unirse no están esperando otra red.

PACT registra el escape residual. Los sistemas receptores de correo ya emiten informes. Los logs públicos de certificados ya existen porque los navegadores exigieron un diario de emisión. Rekor ya existe porque la cadena de suministro de software quiso un diario de artefactos firmados. Este protocolo no inventa un flujo y le pide al mundo que lo llene. Conserva lo que ya se estaba tirando.

Correo, certificados y firmas son tipos residuales de origen distinto. Quedan en el mismo árbol de solo añadido para que quien comprueba tenga una sola raíz contra la que recomputar. Nunca se mezclan en una puntuación. Más adelante puede añadirse otra fuente residual como un tipo etiquetado. Cada tipo conserva su propio preimagen. Las aplicaciones pueden interpretar los campos. Este protocolo no lo hará.

## Informes de correo

Todo dominio institucional que envía correo ya lo firma con DKIM. Los sistemas receptores — Gmail, Outlook, Yahoo y otros — ya validan esas firmas y ya emiten informes agregados: si llegó correo autenticado, con qué frecuencia, desde qué infraestructura y según quién.

Esos informes no contienen mensajes, asuntos, buzones ni personas. Son resúmenes de resultados de autenticación en un periodo. La privacidad aquí es estructural. El conducto nunca ve el contenido, así que una política no puede recogerlo después por accidente.

Un nombre obtiene un registro de correo apuntando el DNS. Se añade un destino de informes para conservar una copia. La política existente del dominio y los demás destinos se quedan. No cambia cómo se envía ni cómo se recibe el correo. El historial empieza cuando llega el primer informe independiente — no cuando se guarda la línea de DNS.

Cada hoja de correo compromete el dominio, el periodo, la organización informante, los recuentos de acierto y fallo, y un hash del wrapper firmado que transportó el informe. Los informes falsos no entran: el wrapper tiene que autenticarse y el informante tiene que ser una organización conocida. El informe en bruto se descarta tras la extracción.

## Logs de certificados

Los logs de Certificate Transparency ya registran la emisión. Existen porque los navegadores exigieron un diario público, no porque este protocolo pidiera a nadie que registrara. Un nombre que aparece ahí tiene una primera fecha escrita por otro.

Se puede emitir un certificado nuevo en minutos. Eso es un calendario débil, no una prueba de que HTTPS sea de fiar, ni una afirmación de calidad sobre el certificado. Un certificado real puede cubrir un nombre que ayer no existía.

Este sitio indexa logs públicos cuando el nombre está en el ledger. No hay un segundo rito. El sujeto puede hacer que se emita un certificado. El sujeto no puede ser el log.

Las hojas de certificados llevan una primera fecha, emisor, ventana de validez y huella. Comparten el árbol y el espacio de índices con las hojas de correo y de firma. Nunca se fusionan con ellas.

La ingesta de referencia lee un índice público sobre esos logs, no a un operador de log. Eso es más débil que la cabeza firmada de un log concreto. Sigue siendo calendario residual de una infraestructura que ya existía.

## Logs de firmas

Rekor ya registra metadatos de software firmado. Existe porque la cadena de suministro de software quiso un diario público, no porque este protocolo pidiera a nadie que registrara.

Se puede publicar una firma nueva tan barato como un certificado nuevo. Eso es un calendario débil, no una prueba de que un nombre sea legítimo, ni una afirmación de calidad sobre el software.

Este sitio indexa sujetos residuales de Rekor — un URI de GitHub, un correo o un hostname — no un dominio conectado. Un URI de github.com es leftover de primer orden; no cubre el sitio de un cliente. El leftover de host usa ese nombre y sus formas www y https. El leftover de correo es el buzón exacto ya presente en el log. No se buscan buzones adivinados. Un leftover de hostname vacío es lo esperado.

Las hojas de firma llevan una identidad, una hora integrada y un id de entrada. Comparten el árbol y el espacio de índices con las hojas de correo y de certificados. Nunca se fusionan con ellas.

La ingesta de referencia lee un índice público sobre Rekor, no la prueba Merkle de Rekor. Eso es más débil que la cabeza firmada del log. Sigue siendo calendario residual de una infraestructura que ya existía.

## Un árbol, tres tipos

Los tres tipos son hojas keccak256 en un árbol Merkle disperso. Los bindings no deben compartir el diseño del preimagen, para que una hoja de correo no pueda colisionar con una de certificado o de firma del mismo nombre.

El catálogo y la consulta por tipo son la interfaz. No suman tipos. No los promedian. No producen una insignia. Quien construya una aplicación encima puede interpretar los campos. Fundirlos en un solo número es decisión de esa aplicación, y no es este protocolo.

## Cualquiera puede comprobar

Cada traza es una hoja. Las raíces se publican on-chain, fuera de este operador, para que no se pueda cambiar el pasado en silencio. Quien comprueba recomputa la inclusión contra esa raíz: hash de la hoja, índice, hashes hermanos, raíz publicada. La verificación no exige contactar a este operador.

Las hojas de correo se pueden abrir más. El operador guarda el wrapper recibido y una instantánea DNS de la clave DKIM en la ingesta. Quien comprueba hashea los bytes almacenados contra la hoja y verifica que la clave estaba registrada. Eso no es una afirmación de que este operador sea honesto sobre la disponibilidad. Las raíces atestiguan inclusión, no que los bytes se sigan sirviendo mañana.

## Dos relojes

El registro es cuánto tiempo existe el nombre. Confirmado desde es cuánto tiempo este registro ha estado acumulando trazas. Nunca se colapsan.

Un nombre de ocho años que se conectó hoy tiene un reloj de registro largo y un reloj de confirmación en cero. Eso es lo esperado. Apropiarse del DNS hereda la fecha de registro y nada del reloj de correo. Mezclarlos dejaría que un secuestrador tomara prestado el ayer.

## Qué consultan los agentes

Tipo más identidad. Eco de la identidad realmente usada. Cero filas es HTTP 200. Inclusión contra una raíz compartida nombrada. Sin puntuación. Sin insignia. Sin veredicto.

## Qué no es

No es KYC. No es una afirmación de que un nombre sea legítimo. No es un sello HTTPS. No es un sello Sigstore. No es una credencial personal. No sustituye a registros ni a burós de crédito. No es un protocolo de autenticación de documentos: responde qué historial confirmado de forma independiente se ha publicado para un dominio, no si un mensaje o un adjunto concreto es auténtico.

El juicio queda fuera.

## Qué es cierto hoy

Las raíces están en Base Sepolia — testnet, un publicador con permiso. Este operador guarda las hojas. Las raíces atestiguan inclusión, no disponibilidad.

Ese es el límite honesto. La tesis no espera a mainnet. Los flujos, el árbol y la API del ledger ya existen. Cualquiera puede volver a comprobar lo publicado.

PACT — Provenance of Accumulated Checkable Traces.

we build real es el movimiento. PACT es el protocolo abierto. La primera implementación de referencia es el ledger. Este sitio es la casa del movimiento y la interfaz para agentes.
`.trim();
