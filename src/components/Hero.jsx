import Spline from '@splinetool/react-spline';
import { useI18n } from '../i18n';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const { t } = useI18n();
  const glassRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (glassRef.current) {
        const tx = (x - 0.5) * 20;
        const ty = (y - 0.5) * 20;
        glassRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        glassRef.current.style.background = `linear-gradient(${(x*360).toFixed(0)}deg, rgba(20,184,166,0.25), rgba(59,130,246,0.25))`;
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/vZX5NNlylxke-6DM/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-white/10 to-white/60 dark:from-neutral-950/10 dark:via-neutral-950/20 dark:to-neutral-950/70"></div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={glassRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="pointer-events-auto w-full rounded-3xl border border-white/30 bg-white/50 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10"
          style={{ willChange: 'transform' }}
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t('hero_title')}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
            {t('hero_subtitle')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#learn" className="inline-flex items-center justify-center rounded-full bg-teal-600 px-5 py-2.5 text-white shadow hover:bg-teal-700 transition" aria-label={t('get_started')}>
              {t('get_started')}
            </a>
            <a href="#quiz" className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-gray-900 shadow hover:bg-white transition dark:border-white/10 dark:bg-white/10 dark:text-white" aria-label={t('try_quiz')}>
              {t('try_quiz')}
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-600 dark:text-gray-400 max-w-xl">
            {t('low_bandwidth_note')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
