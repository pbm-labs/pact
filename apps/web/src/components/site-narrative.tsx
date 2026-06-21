const PARAGRAPHS = [
  'In 1983, four computers connected for the first time under a new set of rules. Nobody in that room thought about identity. They didn\'t need to. Everyone online already knew everyone else.',
  'So the internet was born without a way to know who anyone really is. Not a flaw. Just a question nobody had to ask yet.',
  'Then the world got smaller, and full of strangers.',
  'A name on a screen could be anyone. Or no one. We built an entire civilization on a network that was never given the one thing every community needs to survive: a way to tell who\'s real.',
  'We got used to it. A foundation the size of the whole internet has been missing for forty years, hidden in plain sight.',
  'Here\'s what\'s quietly true right now: that foundation can still be laid. Not because forgery got worse — it\'s been perfect for years. Because real history can only be built one honest day at a time, and every day we wait is a day someone else gets that we never will.',
  'This isn\'t an alarm. It won\'t ring. One day it will simply be too late, and most people won\'t notice the moment it happened.',
  'The foundation the internet never had can still be poured. Not as a repair. As something finally finished, forty years late.',
  'The only thing left to decide is whether we lay it while it still matters — or after, when all that\'s left is living with the gap.',
] as const;

export function SiteNarrative() {
  return (
    <article className="narrative" aria-label="PACT narrative">
      {PARAGRAPHS.map((text, i) => (
        <p key={i} className={i === PARAGRAPHS.length - 1 ? 'narrative-closing' : undefined}>
          {text}
        </p>
      ))}
    </article>
  );
}
