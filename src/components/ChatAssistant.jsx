import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { MessageCircle, Send, X } from 'lucide-react';

async function fetchChat(messages) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error('Network');
    const data = await res.json();
    return data.reply;
  } catch (e) {
    const last = messages[messages.length - 1]?.content || '';
    return `Offline helper: ${last.length > 120 ? last.slice(0, 120) + '…' : last}. Keep learning!`;
  }
}

export default function ChatAssistant() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: t('assistant_welcome') }]);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, open]);
  useEffect(() => { if (!open) setInput(''); }, [open]);

  async function onSend() {
    if (!input.trim()) return;
    const msg = { role: 'user', content: input.trim() };
    setMessages((m) => [...m, msg]);
    setInput('');
    setLoading(true);
    const sys = lang === 'en' ? 'You are a concise bilingual tutor. Reply in English and Hindi with short bullet points.' : 'आप एक द्विभाषी सहायक हैं। छोटे बिंदुओं में हिंदी और अंग्रेज़ी दोनों में जवाब दें।';
    const reply = await fetchChat([{ role: 'system', content: sys }, ...messages, msg]);
    setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    setLoading(false);
  }

  return (
    <div>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-white shadow-lg hover:bg-teal-700"
        >
          <MessageCircle size={18} /> {t('ask_ai')}
        </button>
      )}
      {open && (
        <div className="w-[min(92vw,380px)] rounded-2xl border border-white/20 bg-white/80 backdrop-blur shadow-2xl dark:border-white/10 dark:bg-neutral-900/80">
          <div className="flex items-center justify-between px-4 py-2 border-b border-black/5 dark:border-white/10">
            <div className="text-sm font-semibold">{t('assistant_title')}</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close chat"><X size={16} /></button>
          </div>
          <div className="max-h-72 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block rounded-2xl px-3 py-2 ${m.role === 'user' ? 'bg-teal-600 text-white' : 'bg-black/5 dark:bg-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500">{t('typing')}</div>}
            <div ref={endRef} />
          </div>
          <div className="flex items-center gap-2 p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
              className="flex-1 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-white/10 dark:bg-neutral-800"
              placeholder={t('ask_placeholder')}
              aria-label={t('ask_placeholder')}
            />
            <button onClick={onSend} disabled={loading} className="rounded-full bg-teal-600 p-2 text-white disabled:opacity-50" aria-label="Send"><Send size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
