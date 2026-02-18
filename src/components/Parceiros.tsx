import { siteConfig } from "@/config/site";

const Parceiros = () => {
  return (
    <section id="parceiros" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <span className="label-sm text-primary mb-3 block">Parceiros</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4">
            Quem <span className="text-gradient-brand">caminha conosco</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Marcas e pessoas que partilham dos nossos valores e propósito.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {siteConfig.partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-transform duration-200 hover:scale-105"
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-24 w-24 md:h-32 md:w-32 object-contain rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Parceiros;
