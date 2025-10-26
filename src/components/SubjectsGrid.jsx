import { useI18n } from '../i18n';
import { BookOpen, BadgeCheck, Trophy } from 'lucide-react';
import { addXp, getLevelFromXp } from '../utils/gamification';

const SUBJECTS = [
  { id: 'math', name_en: 'Mathematics', name_hi: 'गणित', color: 'from-teal-500 to-cyan-500' },
  { id: 'science', name_en: 'Science', name_hi: 'विज्ञान', color: 'from-indigo-500 to-blue-500' },
  { id: 'english', name_en: 'English', name_hi: 'अंग्रेज़ी', color: 'from-pink-500 to-rose-500' },
  { id: 'hindi', name_en: 'Hindi', name_hi: 'हिंदी', color: 'from-amber-500 to-orange-500' },
  { id: 'computer', name_en: 'Computer Science', name_hi: 'कम्प्यूटर विज्ञान', color: 'from-emerald-500 to-lime-500' },
  { id: 'history', name_en: 'History', name_hi: 'इतिहास', color: 'from-fuchsia-500 to-purple-500' },
];

export default function SubjectsGrid() {
  const { t, lang } = useI18n();
  const xp = Number(localStorage.getItem('xp') || '0');
  const level = getLevelFromXp(xp);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen size={22} /> {t('subjects')}</h2>
        <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-100/70 px-3 py-1 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
          <Trophy size={16} />
          <span className="text-sm font-medium">{t('level')} {level}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => addXp(10)}
            className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${s.color} p-[1px] shadow transition hover:scale-[1.01]`}
            aria-label={`Open ${lang === 'en' ? s.name_en : s.name_hi}`}
          >
            <div className="rounded-2xl h-full w-full bg-white p-5 dark:bg-neutral-950">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {lang === 'en' ? s.name_en : s.name_hi}
                </h3>
                <BadgeCheck className="text-white drop-shadow-sm" />
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {t('leveled_lessons')}
              </p>
              <div className="mt-4 inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs text-gray-700 dark:bg-white/10 dark:text-gray-200">
                +10 XP
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
