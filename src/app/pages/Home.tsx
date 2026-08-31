import { useState, useEffect, useRef, use, useLayoutEffect } from "react";
import emailjs, { send } from '@emailjs/browser';
import { Menu, X, ArrowDown, ArrowUpRight, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { ym } from 'react-metrika';
import SineWaveText from "./../components/ui/saneWaveText.tsx"

const HERO_SLIDES = [
  {
    url: "/images2/1.jpg",
    alt: "",
    location: "",
  },
  {
    url: "/images2/2.jpg",
    alt: "",
    location: "",
  },
  {
    url: "/images2/3.jpg",
    alt: "",
    location: "",
  },
  {
    url: "/images2/4.jpg",
    alt: "",
    location: "",
  },
  {
    url: "/images2/5.jpg",
    alt: "",
    location: "",
  },
  {
    url: "/images2/6.jpg",
    alt: "",
    location: "",
  },
];
const ABOUT_IMG = "/images2/photo_2025-11-01_18-30-21.jpg";

const months = ["января", "февраля", "марта", "апреоя", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

type typeImageObject = {
  name: string;
  url: string;
};

interface Weather {
  wt: string;
  hum: number;
  tmp: number;
}

interface Photo {
  title: string;
  location: string;
  year: string;
  url: string;
  thumb: string;
  alt: string;
}

// Тип для папки (группы)
interface GalleryFolder {
  id: string;
  name: string;
  desc: string;
  count: number;
  cover: string;
  photos: Photo[];
}

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)

const SCHEDULE = [
  {
    day: "Понедельник",
    short: "ПН",
    slots: [],
    closed: true,
  },
  {
    day: "Вторник",
    short: "ВТ",
    slots: [],
    closed: true,
  },
  {
    day: "Среда",
    short: "СР",
    slots: [],
    closed: true,
  },
  {
    day: "Четверг",
    short: "ЧТ",
    slots: [
      { time: "19:15 - 21:45", label: "Выносливость, сила и техника", level: "Средний" },
    ],
  },
  {
    day: "Пятница",
    short: "ПТ",
    slots: [],
    closed: true,
  },
  {
    day: "Суббота",
    short: "СБ",
    slots: [],
    closed: true,
  },
  {
    day: "Воскресенье",
    short: "ВС",
    slots: [
      {time: "10:00 - 13:00", label: "Техника", level: "Начинающий"}
    ],
  },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const LEVEL_COLOR: Record<string, string> = {
  "Все уровни": "text-foreground/60 border-border",
  Начинающий: "text-emerald-400 border-emerald-400/40",
  Средний: "text-accent border-accent/40",
  Продвинутый: "text-sky-400 border-sky-400/40",
};

const LINKS = [
  {
    category: "Форумы",
    items: [
      { label: "Наш форум", sub: "Клубный форум по альпинизму", href: "https://taganrog-climbing.ru/forum/", image: "images2/message-svgrepo-com.svg" },
    ],
  },
  {
    category: "Группы в мессенджерах",
    items: [
      { label: "Группа в Телеграм", sub: "Следите за всей актуальной информацией в Телеграм", href: "https://t.me/TaganrogClimbingClub", image: "images2/telegram-svgrepo-com.svg" },
      { label: "Группа в Вконтакте", sub: "Следите за всей актуальной информацией в Вконтакте", href: "https://vk.ru/alpclub_tagan", image: "images2/vk-communication-internet-network-chat-interaction-svgrepo-com.svg" },
      { label: "Группа в MAX", sub: "Следите за всей актуальной информацией в MAX", href: "https://max.ru/join/uGR1ABVmY81aeiGM7aGAwXCII4l30p3U0801PtJeiqs", image: "images2/max-messenger-sign-logo.svg" },
    ],
  },
];

const NAV_LINKS = ["About", "Расписание", "Галерея", "Контакты", "Ссылки"];
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDay, setActiveDay] = useState("Четверг");
  const [currentMonth, setCurrentMonth] = useState(months[0]);
  const [currentDate, setCurrentDate] = useState("")
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [imageNames, setImageNames] = useState<Array<typeImageObject>>([]);
  const [galleryFolders, setGalleryFolders] = useState<GalleryFolder>([]);
  const heroRef = useRef<HTMLElement>(null);
  const [weather, setWeather] = useState<Weather>({wt: "null", hum: -1, tmp: -1});
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [messageData, setMessageData] = useState({
    Имя: "",
    Фамилия: "",
    Почта: "",
    Текст: "",
    Телефон: "",
    cc_emails: 'mail@taganrog-climbing.ru'
  });
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPrev, setHeroPrev] = useState<number | null>(null);
  const [heroFading, setHeroFading] = useState(false);
  
  const goToSlide = (idx: number) => {
      if (idx === heroSlide) return;
      setHeroPrev(heroSlide);
      setHeroFading(true);
      setHeroSlide(idx);
      setTimeout(() => { setHeroPrev(null); setHeroFading(false); }, 800);
    };
  
  useEffect(() => {
      const id = setInterval(() => {
        goToSlide((heroSlide + 1) % HERO_SLIDES.length);
      }, 5000);
      return () => clearInterval(id);
    }, [heroSlide]);
  


  const currentFolder = lightbox !== null ? galleryFolders[lightbox.folderIdx] : null;
  const currentPhotos = currentFolder?.photos ?? [];
  const currentPhoto = lightbox !== null ? currentPhotos[lightbox.photoIdx] : null;

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        messageData
      );
      ym(111509561,'reachGoal','FORM-SUBMIT')
      setMessageData({
        Имя: "",
        Фамилия: "",
        Почта: "",
        Текст: "",
        Телефон: "",
        cc_emails: 'mail@taganrog-climbing.ru'
      })
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setMessageData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useLayoutEffect(() => {
    async function getWeather() {
      const data = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Таганрог&appid=c27d5c183f839a14da650835233c9d0a&units=metric&lang=ru")
      const fullData = await data.json();
      setWeather({
        wt: fullData.weather[0].description,
        hum: fullData.main.humidity,
        tmp: fullData.main.temp
      })
    }
    getWeather();
  }, [])

  useEffect(() => {
    async function getImagesNames() {
      try {
        const modules = await import.meta.glob('./../../../public/images/**', {
          eager: true,
          import: 'default'
        });
        const foldersNames = new Set<string>();
        const byNames = {}
        for (const path in modules) {
          const pathname = path.split("/")
          if (!(pathname[pathname.length - 2] in byNames)) {
            byNames[pathname[pathname.length - 2]] = [];
          }
          const fileName = path.split('/').pop() || '';
          const imageUrl = modules[path] as string;
          byNames[pathname[pathname.length - 2]].push({
            url: imageUrl,
            name: fileName
          })
        }
        const toView = new Array <GalleryFolder>();
        let acc = 0;
        for (let i in byNames) {
          toView.push({
            id: `${acc}`,
            name: i,
            desc: "",
            count: byNames[i].length,
            cover: byNames[i][0].url,
            photos: []
          })
          for (let j of byNames[i]) {
            toView[toView.length - 1].photos.push({
              title: j.name,
              location: "",
              year: "",
              url: j.url,
              thumb: j.url,
              alt: i
            })
          }
          ++acc;
        }
        setGalleryFolders(toView);
      } catch (error) {
        console.log("Error!", error)
      }
    }
    getImagesNames();
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightbox) return;
      const { folderIdx, photoIdx } = lightbox;
      const len = galleryFolders[folderIdx].photos.length;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox({ folderIdx, photoIdx: (photoIdx + 1) % len });
      if (e.key === "ArrowLeft") setLightbox({ folderIdx, photoIdx: (photoIdx - 1 + len) % len });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((p) => p !== null ? (p + 1) % imageNames.length : null);
      if (e.key === "ArrowLeft") setLightbox((p) => p !== null ? (p - 1 + imageNames.length) % imageNames.length : null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function getCurrentDate() {
      const tod = (new Date());
      if (tod.getDay() == 0) {
        setActiveDay(SCHEDULE[6].day)
      } else {
        setActiveDay(SCHEDULE[tod.getDay() - 1].day)
      }
      setCurrentDate(`${tod.getDate()}`);
      setCurrentMonth(months[tod.getMonth()])
    }
    getCurrentDate();
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const currentDay = SCHEDULE.find((d) => d.day === activeDay)!;
  
  return (
    <div
      className="bg-background text-foreground min-h-screen"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {/* NAV */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        "bg-background/95 backdrop-blur border-b border-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <img loading="lazy" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} src="/images2/logo_big_new_noback.png" className="cursor-pointer items-center sm:w-[25%] w-[30%] md:w-[17%] lg:w-[18%] h-fit object-cover object-top bg-transparent"></img>
          {/* <span
            className="text-sm font-medium tracking-[0.2em] uppercase cursor-pointer items-center text-center"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.25em" }}
          >
            Taganrog Climbing Club
          </span> */}

          <nav className="hidden md:flex items-center gap-10">
            <button
                key={"Forum"}
                className="text-left text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <a href="https://taganrog-climbing.ru/forum/">форум</a>
            </button>
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                className="text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {(l == "About" ? "О нас" : l)}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-8 flex flex-col gap-6">
            <button
                key={"Forum"}
                className="text-left text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                <a href="https://taganrog-climbing.ru/forum/">форум</a>
            </button>
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                className="text-left text-sm tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {(l == "About" ? "О нас" : l)}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[600px] flex flex-col justify-end bg-stone-900 overflow-hidden"
      >
        {/* slides */}
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.url}
            src={slide.url}
            alt={slide.alt}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[5000ms]"
            style={{ opacity: i === heroSlide ? 1 : 0, zIndex: i === heroPrev ? 1 : 0 }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 pb-20 w-full">
          <h1
            className="text-[clamp(4rem,12vw,11rem)] font-black leading-[1] uppercase mb-8 text-foreground"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Taganrog<br />
            <span className="text-accent">Climbing</span><br />
            Club
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              onClick={() => scrollTo("Расписание")}
              className="flex items-center gap-3 text-sm tracking-[0.15em] uppercase px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200"
            >
              Посмотреть расписание <ArrowUpRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("About")}
              className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowDown size={14} className="animate-bounce" /> Узнать больше
            </button>
          </div>

          {/* slide controls */}
          <div className="flex items-center gap-4 mt-10">
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={slide.location}
                className="group flex items-center gap-2"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-500 ${
                    i === heroSlide
                      ? "w-7 h-3 bg-accent"
                      : "w-2 bg-foreground/30 group-hover:bg-foreground/60"
                  }`}
                />
                {i === heroSlide && (
                  <span className="text-[9px] tracking-[0.15em] uppercase text-accent">
                    {slide.location}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">/ 01 — О нас</p>
            <h2
              className="text-[clamp(2rem,4vw,4.5rem)] font-black leading-[0.95] uppercase mb-8 tracking-wide"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Больше,<br />
              чем скалодром<br />
            </h2>
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground max-w-xl">
              <p>
                Мы - это не просто зал с искусственным рельефом. Это школа, где новички становятся скалолазами, а альпинисты оттачивают технику перед вершинами.
              </p>
              <p>
                Наши тренировки проходят на специализированной стенде, конструкция которого позволяет тренировать базовые навыки скалолазания, есть нависания и разнообразные рельефы.
              </p>
              <p>
                Но стены недостаточно, чтобы почувствовать горы. 
                Поэтому «живая» часть нашей жизни - это регулярные выезды в походы. 
                Мы выезжаем на скалы, отрабатываем лазание с нижней и верхней страховкой на реальном рельефе и учимся принимать решения в условиях, максимально приближенных к автономным восхождениям. 
                Вместе мы тренируемся и общаемся, в одиночку лазать страшно и скучно.
              </p>
            </div>
            {/* <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-10">
              {[["10+", "Совершённых поездок"], ["14", "Countries"], ["9a+", "Hardest send"]].map(
                ([val, label]) => (
                  <div key={label}>
                    <div
                      className="text-3xl font-black text-accent mb-1"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {val}
                    </div>
                    <div className="text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
                      {label}
                    </div>
                  </div>
                )
              )}
            </div> */}
          </div>

          <div className="order-1 lg:order-2 relative bg-stone-900 aspect-[4/5] lg:aspect-auto lg:h-[600px]">
            <img
              loading="lazy"
              src={ABOUT_IMG}
              alt="Climber on steep granite face"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section id="расписание" className="py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">/ 02 — Расписание</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1.1] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Расписание<br />Занятий
            </h2>
          </div>

          {/* Day picker */}
          <div className="flex gap-1 flex-wrap mb-10">
            {SCHEDULE.map((d) => (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={`text-[11px] tracking-[0.15em] uppercase px-4 py-3 border transition-all duration-200 ${
                    activeDay === d.day
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                <span className="hidden sm:inline">{d.day}</span>
                <span className="sm:hidden">{d.short}</span>
                {d.closed && <span className="ml-2 text-[9px] text-red-400">Закрыто</span>}
                {!d.closed && <span className="ml-2 text-[9px] text-green-400">Открыто</span>}
              </button>
            ))}
          </div>

          {/* Selected day slots */}
          <div className="min-h-[100px]">
            {currentDay.closed ? (
              <div className="border border-border bg-card p-12 text-center">
                <div
                  className="text-4xl font-black uppercase text-muted-foreground/30 mb-3"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Закрыто
                </div>
                <p className="text-sm text-muted-foreground">Занятий сегодня нет. Восстанавливайте силы и отдыхайте!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentDay.slots.map((slot) => (
                  <div
                    key={slot.time}
                    className="grid grid-cols-1 sm:grid-cols-[9rem_1fr_8rem] gap-4 items-center border border-border bg-card px-6 py-5 hover:border-accent/30 transition-colors duration-200"
                  >
                    <span className="text-sm text-accent">{slot.time}</span>
                    <span
                      className="text-xl font-black uppercase"
                    >
                      <a href="https://www.taganrog-climbing.ru/forum/viewtopic.php?t=2" className="group flex items-start justify-between gap-6 py-4 border-b border-border hover:border-accent/30 transition-colors duration-200">
                        Подробности можете узнать на форуме <ExternalLink size={20} className="flex-shrink-0 mt-1 text-muted-foreground/40 group-hover:text-accent transition-colors duration-200"></ExternalLink>
                      </a>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="галерея" className="py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">/ 03 — Галерея</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.95] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Фото некоторых поездок
            </h2>
            {openFolder && (
              <button
                onClick={() => setOpenFolder(null)}
                className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Вернуться ко всем папкам
              </button>
            )}
          </div>

          {/* FOLDER LIST */}
          {!openFolder && (
            <div className="divide-y divide-border border-t border-border">
              {galleryFolders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setOpenFolder(folder.id)}
                  className="group w-full flex items-center gap-6 py-5 text-left hover:bg-card transition-colors duration-150"
                >
                  {/* cover mosaic */}
                  <div className="w-12 h-12 flex-shrink-0 overflow-hidden bg-stone-900 ml-2">
                    <img loading="lazy" src={folder.cover} alt="" aria-hidden className="w-full h-full object-cover" />
                  </div>

                  {/* name */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xl font-black uppercase group-hover:text-accent transition-colors duration-200"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {folder.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{folder.desc}</div>
                  </div>

                  {/* count */}
                  <span className="text-[11px] text-muted-foreground flex-shrink-0 tabular-nums">
                    {folder.photos.length} {folder.photos.length === 1 ? "фото" : "фото"}
                  </span>

                  <ArrowUpRight
                    size={14}
                    className="flex-shrink-0 text-muted-foreground/30 group-hover:text-accent transition-colors duration-200"
                  />
                </button>
              ))}
            </div>
          )}

          {/* OPEN FOLDER — photo list */}
          {openFolder && (() => {
            const folderIdx = galleryFolders.findIndex((f) => f.id === openFolder);
            const folder = galleryFolders[folderIdx];
            return (
              <div>
                {/* folder header */}
                <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border">
                  <div className="w-10 h-10 overflow-hidden bg-stone-900 flex-shrink-0">
                    <img loading="lazy" src={folder.cover} aria-hidden className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div
                      className="text-2xl font-black uppercase"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {folder.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{folder.desc}</div>
                  </div>
                </div>

                {/* photo rows */}
                <div className="divide-y divide-border border-t border-border">
                  {folder.photos.map((photo, photoIdx) => (
                    <button
                      key={photoIdx}
                      onClick={() => setLightbox({ folderIdx, photoIdx })}
                      className="group w-full flex items-center gap-6 py-4 text-left hover:bg-card transition-colors duration-150"
                    >
                      <span className="text-[11px] text-muted-foreground w-6 flex-shrink-0 tabular-nums ml-2">
                        {String(photoIdx + 1).padStart(2, "0")}
                      </span>

                      <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-stone-900">
                        <img loading="lazy" src={photo.thumb} aria-hidden className="w-full h-full object-cover" />
                      </div>

                      <span
                        className="flex-1 text-lg font-black uppercase group-hover:text-accent transition-colors duration-200"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {photo.title}
                      </span>

                      <span className="hidden sm:block text-[11px] text-muted-foreground flex-shrink-0">
                        {photo.location}
                      </span>
                      <span className="text-[11px] text-muted-foreground flex-shrink-0 w-10 text-right">
                        {photo.year}
                      </span>

                      <ArrowUpRight
                        size={13}
                        className="flex-shrink-0 text-muted-foreground/30 group-hover:text-accent transition-colors duration-200"
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox !== null && currentPhoto && currentFolder && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur flex flex-col"
          onClick={() => setLightbox(null)}
        >
          {/* top bar */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground flex-shrink-0">
                {currentFolder.name}
              </span>
              <span className="text-muted-foreground/40">—</span>
              <span
                className="text-lg font-black uppercase text-foreground truncate"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {currentPhoto.title}
              </span>
              <span className="hidden sm:block text-[11px] text-muted-foreground flex-shrink-0">
                {currentPhoto.location}, {currentPhoto.year}
              </span>
            </div>
            <div className="flex items-center gap-5 flex-shrink-0">
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {lightbox.photoIdx + 1} / {currentPhotos.length}
              </span>
              <button
                onClick={() => setLightbox(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* image */}
          <div className="flex-1 flex items-center justify-center p-6 min-h-0">
            <img
              loading="lazy"
              src={currentPhoto.url}
              alt={currentPhoto.alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* bottom nav */}
          <div
            className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox({ folderIdx: lightbox.folderIdx, photoIdx: (lightbox.photoIdx - 1 + currentPhotos.length) % currentPhotos.length })}
              className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setLightbox({ folderIdx: lightbox.folderIdx, photoIdx: (lightbox.photoIdx + 1) % currentPhotos.length })}
              className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}


      {/* CONTACT */}
      <section id="контакты" className="py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">/ 04 — Контакты</p>
              <h2
                className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.95] uppercase mb-8"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Свяжитесь<br />
                С нами
              </h2>

              <div className="space-y-6">
                {[
                  { icon: MapPin, label: "Место тренировки", value: "Школа №24 (Таганрог, ул. Дзержинского 149)" },
                  { icon: Phone, label: "Олег Евгеньевич Бутко", value: "8 952 413 01 32" },
                  {icon: Phone, label: "Данил Валерьевич Науменко", value: "8 950 853 68 53"},
                  {icon: Phone, label: "Дмитрий Владимирович Нечаев", value: "8 988 547 32 72"},
                  { icon: Mail, label: "Почта для связи", value: "mail@taganrog-climbing.ru" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-4 items-start">
                    <div className="mt-0.5 p-2 border border-border text-accent">
                      <Icon size={14} />
                    </div>
                    <div>
                      <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
                        {label}
                      </div>
                      <div className="text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={sendEmail} className="flex flex-col gap-5" id="Form">
              <label className="text-center">Оставьте свои контакты, чтобы мы смогли с вами связаться</label>
              <div className="grid grid-cols-2 gap-4">
                {["Имя", "Фамилия"].map((p) => (
                  <div key={p}>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                      {p}
                    </label>
                    <input
                    value={messageData[p as keyof typeof messageData]}
                      type="text"
                      name={p}
                      onChange={handleChange}
                      placeholder={p}
                      className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                  Ваша почта
                </label>
                <input
                  onChange={handleChange}
                  value={messageData.Почта}
                  type="email"
                  name="Почта"
                  placeholder="you@example.com"
                  className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                  Ваш контактный телефон
                </label>
                <input
                value={messageData.Телефон}
                  type="tel"
                  name="Телефон"
                  onChange={handleChange}
                  placeholder="Формат: +79999999999"
                  className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground block mb-2">
                  Сообщение
                </label>
                <textarea
                value={messageData.Текст}
                  rows={5}
                  onChange={handleChange}
                  name="Текст"
                  placeholder="Расскажите об ожиданиях и целях"
                  className="w-full bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-3 text-sm tracking-[0.15em] uppercase px-6 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 mt-2"
              >
                Отправить сообщение <ArrowUpRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* LINKS */}
      <section id="ссылки" className="mb-5 pt-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">/ 05 — Ссылки</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.95] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Может быть<br />вам интересно
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Переходите по ссылкам в каналы в различных мессенджерах, на форум по скалолазанью и многое другое
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {LINKS.map((group) => (
              <div key={group.category}>
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-6 pb-3 border-b border-border">
                  — {group.category}
                </div>
                <div className="space-y-1">
                  {group.items.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="group flex items-start justify-between gap-6 py-4 border-b border-border hover:border-accent/30 transition-colors duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div
                          className="flex gap-2 text-base font-black uppercase group-hover:text-accent transition-colors duration-200 truncate"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                        >
                          {link.label}
                          {link.image != "" ? <img src={link.image} className="h-6 w-6"/> : <div></div>}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{link.sub}</div>
                      </div>
                      <ExternalLink
                        size={13}
                        onClick={() => {
                          if (link.label == "Форум по альпинизму") {
                            ym(111509561,'reachGoal','FORUM_VISIT')
                          } else if (link.label == "Группа в Телеграм") {
                            ym(111509561,'reachGoal','TELEGRAM_VISIT')
                          } else if (link.label == "Группа в Вконтакте") {
                            ym(111509561,'reachGoal','VK_VISIT')
                          } else if (link.label == "Группа в MAX") {
                            ym(111509561,'reachGoal','MAX_VISIT')
                          }
                        }}
                        className="flex-shrink-0 mt-1 text-muted-foreground/40 group-hover:text-accent transition-colors duration-200"
                      />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <SineWaveText speed={3} waveSpeed={0.02} amplitude={window.innerWidth >= 1500 ? 25 : 25} className="mb-10" fontSize="text-xl md:text-2xl lg:text-3xl" text={`Сегодня ${activeDay} ${currentDate} ${currentMonth} и cейчас в Таганроге ${weather.wt}, на улице ${weather.hum}% влажности и ${weather.tmp}°C!`} rainbow={false}/>
      {/* FOOTER */}      
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="text-sm font-black uppercase tracking-[0.25em]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Taganrog Climbing Club
          </span>
          <span className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
            © 2026 — All heights reserved
          </span>
        </div>
      </footer>
    </div>
  );
}
