import React, { createContext, useContext, useMemo, useState } from 'react';

const dict = {
  en: {
    learn: 'Learn',
    quiz: 'Quiz',
    rooms: 'Rooms',
    subjects: 'Subjects',
    level: 'Level',
    leveled_lessons: 'Leveled lessons with badges and progress.',
    hero_title: 'SmartClassroom for Rural Colleges',
    hero_subtitle: 'Interactive, bilingual learning with games, quizzes, and peer rooms. Mobile-first and low-bandwidth optimized.',
    get_started: 'Start Learning',
    try_quiz: 'Try a Quiz',
    low_bandwidth_note: 'Optimized for low bandwidth: assets lazy-loaded, animations accessible, and works offline when installed.',
    switch_language: 'Switch language',
    question: 'Question',
    submit: 'Submit',
    reset: 'Reset',
    your_score: 'Your Score',
    score_note: 'Great job! Earn more XP by exploring subjects and rooms.',
    retry: 'Retry',
    ask_ai: 'Ask AI',
    assistant_title: 'Quick AI Assistant',
    ask_placeholder: 'Ask in English or Hindi…',
    typing: 'Assistant is typing…',
    peer_room: 'Peer-to-Peer Room',
    copy_link: 'Copy Link',
    room_hint: 'Share this link with a friend (open in another tab/device). Messages sync instantly using your browser channel.',
    room_placeholder: 'Write a message…',
    send: 'Send',
    room_privacy: 'Local-first: Messages stay on your device/browser. For cross-device sync, open the same link in both.',
    assistant_welcome: 'Hello! Ask me anything about your subjects. I reply in English and Hindi.'
  },
  hi: {
    learn: 'सीखें',
    quiz: 'प्रश्नोत्तरी',
    rooms: 'कक्षाएँ',
    subjects: 'विषय',
    level: 'स्तर',
    leveled_lessons: 'स्तरबद्ध पाठ, बैज और प्रगति के साथ।',
    hero_title: 'ग्रामीण कॉलेजों के लिए स्मार्ट क्लासरूम',
    hero_subtitle: 'गेमिफिकेशन, क्विज़ और साथी कक्षाओं के साथ द्विभाषी, इंटरैक्टिव शिक्षा। मोबाइल-प्रथम और धीमे इंटरनेट के लिए अनुकूल।',
    get_started: 'शुरू करें',
    try_quiz: 'क्विज़ आज़माएँ',
    low_bandwidth_note: 'धीमे इंटरनेट के लिए अनुकूलित: एसेट्स लेज़ी-लोड, सुलभ एनिमेशन और इंस्टॉल करने पर ऑफ़लाइन भी काम करता है।',
    switch_language: 'भाषा बदलें',
    question: 'प्रश्न',
    submit: 'जमा करें',
    reset: 'रीसेट',
    your_score: 'आपका स्कोर',
    score_note: 'बहुत बढ़िया! विषय और कक्षाएँ खोज कर और XP अर्जित करें।',
    retry: 'फिर से कोशिश करें',
    ask_ai: 'AI से पूछें',
    assistant_title: 'त्वरित AI सहायक',
    ask_placeholder: 'अंग्रेज़ी या हिंदी में पूछें…',
    typing: 'सहायक लिख रहा है…',
    peer_room: 'साथी-कक्षा (रूम)',
    copy_link: 'लिंक कॉपी करें',
    room_hint: 'इस लिंक को दोस्त के साथ साझा करें (दूसरे टैब/डिवाइस पर खोलें)। संदेश तुरंत सिंक होंगे।',
    room_placeholder: 'संदेश लिखें…',
    send: 'भेजें',
    room_privacy: 'स्थानीय-प्रथम: संदेश आपके डिवाइस/ब्राउज़र में रहते हैं। दूसरे डिवाइस पर सिंक हेतु वही लिंक खोलें।',
    assistant_welcome: 'नमस्ते! अपने विषयों के बारे में कुछ भी पूछें। मैं अंग्रेज़ी और हिंदी दोनों में उत्तर दूँगा।'
  },
};

const I18nCtx = createContext({ t: (k) => k, lang: 'en', setLang: () => {} });

export function I18nProvider({ children, lang: initialLang, setLang: externalSetLang }) {
  const [langState, setLangState] = useState(initialLang || 'en');
  const lang = initialLang || langState;
  const setLang = (l) => { localStorage.setItem('lang', l); (externalSetLang || setLangState)(l); };
  const t = (key) => dict[lang]?.[key] || dict.en[key] || key;
  const value = useMemo(() => ({ t, lang, setLang }), [lang]);
  return React.createElement(I18nCtx.Provider, { value }, children);
}

export function useI18n() {
  return useContext(I18nCtx);
}
