import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { Sun, Moon, Globe, Rocket, Star } from 'lucide-react';

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/70 px-3 py-1 text-sm shadow-sm backdrop-blur dark:bg-white/10 hover:scale-105 transition"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        <span className="hidden sm:block">{theme === 'dark' ? 'Dark' : 'Light'}</span>
      </button>
    </div>
  );
}

function LanguageToggle() {
  const { t, lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/70 px-3 py-1 text-sm shadow-sm backdrop-blur dark:bg-white/10 hover:scale-105 transition"
      aria-label={t('switch_language')}
    >
      <Globe size={16} />
      <span className="uppercase">{lang}</span>
    </button>
  );
}

export default function Navbar() {
  const { t } = useI18n();
  const [xp, setXp] = useState(() => Number(localStorage.getItem('xp') || '0'));
  useEffect(() => {
    const onStorage = () => setXp(Number(localStorage.getItem('xp') || '0'));
    window.addEventListener('storage', onStorage);
    const id = setInterval(onStorage, 1500);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(id); };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60 border-b border-black/5 dark:border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="SmartClassroom Home">
          <Rocket className="text-teal-600 dark:text-teal-400" size={20} />
          <span>SmartClassroom</span>
        </a>
        <div className="flex items-center gap-2">
          <a href="#learn" className="px-3 py-1 rounded-full text-sm hover:bg-black/5 dark:hover:bg-white/10">{t('learn')}</a>
          <a href="#quiz" className="px-3 py-1 rounded-full text-sm hover:bg-black/5 dark:hover:bg-white/10">{t('quiz')}</a>
          <a href="#rooms" className="px-3 py-1 rounded-full text-sm hover:bg-black/5 dark:hover:bg-white/10">{t('rooms')}</a>
          <div className="mx-1 hidden sm:flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-200/70 to-yellow-200/70 dark:from-amber-500/20 dark:to-yellow-500/20 px-2 py-1 border border-amber-400/30">
            <Star className="text-amber-500" size={14} />
            <span className="text-xs font-medium">XP {xp}</span>
          </div>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
