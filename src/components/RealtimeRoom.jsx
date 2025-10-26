import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { Users, Copy } from 'lucide-react';

export default function RealtimeRoom() {
  const { t } = useI18n();
  const [room, setRoom] = useState(() => (location.hash?.slice(1) || Math.random().toString(36).slice(2, 8)));
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chanRef = useRef(null);

  useEffect(() => {
    if (!location.hash) location.hash = room;
  }, [room]);

  useEffect(() => {
    if ('BroadcastChannel' in window) {
      const ch = new BroadcastChannel(`smartclassroom-${room}`);
      chanRef.current = ch;
      ch.onmessage = (ev) => {
        setMessages((m) => [...m, ev.data]);
      };
      return () => ch.close();
    }
  }, [room]);

  function send() {
    if (!input.trim()) return;
    const msg = { at: Date.now(), text: input.trim(), me: true };
    setMessages((m) => [...m, msg]);
    setInput('');
    try { chanRef.current?.postMessage({ ...msg, me: false }); } catch {}
  }

  const shareUrl = useMemo(() => `${location.origin}${location.pathname}#${room}`, [room]);

  function copy() {
    navigator.clipboard.writeText(shareUrl);
  }

  return (
    <div className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Users size={18} />
          <h3 className="text-lg font-bold">{t('peer_room')}</h3>
        </div>
        <div className="flex items-center gap-2">
          <code className="rounded bg-black/5 px-2 py-1 text-xs dark:bg-white/10">{room}</code>
          <button onClick={copy} className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1 text-xs dark:border-white/10" aria-label={t('copy_link')}>
            <Copy size={14} /> {t('copy_link')}
          </button>
        </div>
      </div>
      <div className="h-56 overflow-y-auto rounded-xl border border-black/5 p-3 dark:border-white/10 bg-white/50 dark:bg-neutral-900/50">
        {messages.length === 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('room_hint')}</p>
        )}
        <div className="space-y-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.me ? 'bg-teal-600 text-white' : 'bg-black/5 dark:bg-white/10'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="flex-1 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-white/10 dark:bg-neutral-800"
          placeholder={t('room_placeholder')}
          aria-label={t('room_placeholder')}
        />
        <button onClick={send} className="rounded-full bg-teal-600 px-4 py-2 text-white hover:bg-teal-700">{t('send')}</button>
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">{t('room_privacy')}</p>
    </div>
  );
}
