import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { addXp } from '../utils/gamification';

const BASE_QUESTIONS = [
  {
    id: 1,
    q_en: 'What is the value of 2 + 2?',
    q_hi: '2 + 2 का मान क्या है?',
    options: ['3', '4', '5', '6'],
    answerIndex: 1,
  },
  {
    id: 2,
    q_en: 'Water boils at what temperature (at sea level)?',
    q_hi: 'समुद्र तल पर पानी किस तापमान पर उबलता है?',
    options: ['90°C', '100°C', '110°C', '50°C'],
    answerIndex: 1,
  },
  {
    id: 3,
    q_en: 'Which language is primarily used for web styling?',
    q_hi: 'वेब स्टाइलिंग के लिए मुख्य रूप से कौन सी भाषा उपयोग होती है?',
    options: ['HTML', 'CSS', 'Python', 'SQL'],
    answerIndex: 1,
  },
];

export default function QuizCard() {
  const { t, lang } = useI18n();
  const [i, setI] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => BASE_QUESTIONS, []);
  const current = questions[i];

  useEffect(() => { setSelected(null); }, [i]);

  function submit() {
    if (selected === null) return;
    const correct = selected === current.answerIndex;
    if (correct) {
      setScore((s) => s + 1);
      addXp(20);
    }
    if (i + 1 < questions.length) setI((n) => n + 1);
    else setFinished(true);
  }

  function reset() {
    setI(0); setSelected(null); setScore(0); setFinished(false);
  }

  return (
    <div className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{t('quiz')}</h3>
        <span className="text-sm text-gray-600 dark:text-gray-300">{t('question')} {Math.min(i + 1, questions.length)} / {questions.length}</span>
      </div>

      {!finished ? (
        <div>
          <p className="text-lg font-medium mb-4">{lang === 'en' ? current.q_en : current.q_hi}</p>
          <div className="grid grid-cols-1 gap-2">
            {current.options.map((opt, idx) => (
              <label key={idx} className={`cursor-pointer rounded-xl border p-3 transition hover:shadow-sm ${selected === idx ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-black/10 dark:border-white/10'}`}>
                <input type="radio" name="opt" className="hidden" onChange={() => setSelected(idx)} checked={selected === idx} />
                <span className="text-sm sm:text-base">{opt}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={submit} className="rounded-full bg-teal-600 px-4 py-2 text-white hover:bg-teal-700">{t('submit')}</button>
            <button onClick={reset} className="rounded-full border border-black/10 bg-white px-4 py-2 dark:border-white/10 dark:bg-transparent">{t('reset')}</button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-bold">{t('your_score')}: {score} / {questions.length}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('score_note')}</p>
          <button onClick={reset} className="mt-4 rounded-full bg-teal-600 px-5 py-2 text-white hover:bg-teal-700">{t('retry')}</button>
        </div>
      )}
    </div>
  );
}
