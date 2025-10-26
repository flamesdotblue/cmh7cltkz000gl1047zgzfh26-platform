import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import SubjectsGrid from './components/SubjectsGrid.jsx';
import QuizCard from './components/QuizCard.jsx';
import ChatAssistant from './components/ChatAssistant.jsx';
import RealtimeRoom from './components/RealtimeRoom.jsx';
import { I18nProvider } from './i18n.js';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <I18nProvider lang={lang} setLang={setLang}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100 selection:bg-teal-300/60 selection:text-black">
        <Navbar />
        <main className="relative">
          <Hero />

          <section id="learn" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <SubjectsGrid />
          </section>

          <section id="quiz" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <QuizCard />
          </section>

          <section id="rooms" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <RealtimeRoom />
          </section>
        </main>

        <AnimatePresence>
          {mounted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className="fixed bottom-4 right-4 z-20"
            >
              <ChatAssistant />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </I18nProvider>
  );
}
