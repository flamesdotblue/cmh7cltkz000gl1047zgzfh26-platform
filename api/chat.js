const fetch = globalThis.fetch || require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { messages = [] } = req.body || {};
    const user = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    let reply = '';

    if (OPENAI_API_KEY) {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a concise bilingual tutor for rural colleges. Reply in both English and Hindi as short bullet points. Keep responses lightweight.' },
            ...messages,
          ],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });
      if (!resp.ok) throw new Error('OpenAI error');
      const data = await resp.json();
      reply = data.choices?.[0]?.message?.content || '';
    } else if (ANTHROPIC_API_KEY) {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-latest',
          max_tokens: 300,
          temperature: 0.3,
          messages: [
            { role: 'user', content: 'You are a concise bilingual tutor for rural colleges. Reply in both English and Hindi as short bullet points. Keep responses lightweight.' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      if (!resp.ok) throw new Error('Anthropic error');
      const data = await resp.json();
      const text = Array.isArray(data.content) ? data.content.map(c => c.text || '').join('\n') : (data.content?.[0]?.text || '');
      reply = text;
    } else {
      reply = `English:\n- You asked: ${user.slice(0, 140)}\n- I can help with subjects, quizzes, tips.\n\nहिंदी:\n- आपने पूछा: ${user.slice(0, 140)}\n- मैं विषय, क्विज़, सुझावों में मदद कर सकता हूँ।`;
    }

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ reply });
  } catch (e) {
    res.status(200).json({ reply: 'English:\n- Network issue. Showing local tips.\n- Try again later.\n\nहिंदी:\n- नेटवर्क समस्या। स्थानीय सुझाव दिखा रहे हैं।\n- बाद में पुनः प्रयास करें।' });
  }
};
