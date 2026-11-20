/**
 * Dedicatórias (home band, 20/11/2026): title, one line, the four kinds and one
 * CTA that opens the contact form with «dedicatorias» already chosen.
 */
const kinds = [
  "Dedicatória gravada em áudio",
  "Poema ou mensagem lida no ar",
  "A sua música autoral no ar",
  "Playlist feita à medida",
];

const DedicatoriasRadio = () => {
  const openContactForm = () => {
    window.dispatchEvent(new CustomEvent("select-contact-subject", { detail: "dedicatorias" }));
  };

  return (
    <section id="dedicatorias" aria-labelledby="dedicatorias-heading" className="bg-[#5c1424] py-14 text-cream md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-widest text-amarelo">Dedicatórias na rádio</p>
            <h2 id="dedicatorias-heading" className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              A sua voz na nossa rádio
            </h2>
            <p className="mt-4 max-w-lg text-base text-cream/85 md:text-lg">
              Surpreenda alguém com uma mensagem, um poema ou uma música dedicada, no ar na Olha que Duas.
            </p>
          </div>
          <div className="min-w-0">
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {kinds.map((k) => (
                <li key={k} className="flex items-start gap-3 text-base text-cream/90">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amarelo" aria-hidden="true" />
                  {k}
                </li>
              ))}
            </ul>
            <a
              href="/?assunto=dedicatorias#contacto"
              onClick={openContactForm}
              className="mt-7 inline-flex h-[52px] items-center justify-center rounded-full bg-amarelo px-7 text-lg font-bold text-[#2b1a12] transition-colors hover:bg-amarelo-soft"
            >
              Pedir uma dedicatória
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DedicatoriasRadio;
