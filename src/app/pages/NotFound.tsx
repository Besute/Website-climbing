import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="bg-background text-foreground min-h-screen flex flex-col"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {/* top bar */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <img src="/images2/logo_big_new_noback.png" className="cursor-pointer items-center sm:w-[25%] w-[30%] md:w-[17%] lg:w-[18%] h-fit object-cover object-top bg-transparent" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          Ошибка 404
        </span>
      </header>

      {/* main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* giant background number */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        >
          <span
            className="text-[clamp(14rem,40vw,32rem)] font-black leading-none text-foreground/[0.03]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            404
          </span>
        </div>

        {/* content */}
        <div className="relative z-10 text-center max-w-xl">
          <p className="text-[10px] tracking-[0.35em] uppercase text-accent mb-6">
            Такой страницы не существует
          </p>

          <h1
            className="text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.9] mb-8"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            404
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed mb-12 max-w-sm mx-auto">
            Страница, которую Вы ищете, отсутствует
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/"
              className="flex items-center gap-3 text-sm tracking-[0.15em] uppercase px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200"
            >
              Вернуться назад <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </main>
      {/* footer */}
      <footer className="border-t border-border px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
          Taganrog Climbing Club
        </span>
      </footer>
    </div>
  );
}
