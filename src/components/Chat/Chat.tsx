import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../../api/chat'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useInView } from '../../hooks/useInView'

interface Message {
  id: string
  text: string
  from: 'user' | 'bot'
}

const STORAGE_KEY_SESSION = 'chat_session_id'
const STORAGE_KEY_MESSAGES = 'chat_messages'

function getOrCreateSessionId(): string {
  const stored = localStorage.getItem(STORAGE_KEY_SESSION)
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem(STORAGE_KEY_SESSION, id)
  return id
}

const sessionId = getOrCreateSessionId()

const GREETING: Message = {
  id: 'greeting',
  text: 'Здравствуйте. Напишите вопрос, отвечу в течение нескольких часов.',
  from: 'bot',
}

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES)
    if (raw) return JSON.parse(raw) as Message[]
  } catch { /* ignore */ }
  return [GREETING]
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const [sent, setSent]         = useState(false)
  const isMobile = useIsMobile()
  const { ref: sectionRef, inView } = useInView()
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevLengthRef = useRef(messages.length)

  // Persist messages to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevLengthRef.current = messages.length
  }, [messages])

  // SSE: receive admin replies in real time
  useEffect(() => {
    const es = new EventSource(`/api/chat/stream/${sessionId}`)
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as { id: string; text: string; from_visitor: boolean }
        if (!data.from_visitor) {
          setMessages((prev) => [...prev, { id: data.id, text: data.text, from: 'bot' }])
        }
      } catch { /* ignore malformed events */ }
    }
    return () => es.close()
  }, [])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text, from: 'user' }])
    setInput('')
    setSending(true)

    try {
      await sendChatMessage(sessionId, text)
      setSent(true)
      setTimeout(() => setSent(false), 2500)
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: 'Не удалось отправить. Попробуйте ещё раз.', from: 'bot' },
      ])
    } finally {
      setSending(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <section
      id="chat"
      style={{
        background: '#f5f0e8',
        borderTop: '1px solid #e7e3d8',
      }}
    >
      <div
        ref={sectionRef}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile ? '64px 16px' : '96px 24px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: isMobile ? 32 : 64,
          alignItems: 'center',
        }}
      >
        {/* Left */}
        <div style={{
          opacity: 0,
          animation: inView ? 'slideInLeft 0.6s ease 0s forwards' : 'none',
        }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#78716c',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 12,
            }}
          >
            Контакты
          </p>
          <h2
            style={{
              fontFamily: 'var(--heading)',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 600,
              color: '#1c1917',
              letterSpacing: '-0.02em',
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            Напишите
            <br />прямо здесь
          </h2>
          <p style={{ color: '#78716c', lineHeight: 1.65, fontSize: 16, marginBottom: 32 }}>
            Сообщение придёт мне в Telegram. Отвечаю в рабочие дни, обычно в течение нескольких часов.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Telegram: @alexsey_dev' },
              { label: 'Пн-пт, 9:00-22:00 МСК' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 14,
                  color: '#78716c',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#f97316',
                    flexShrink: 0,
                  }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: chat widget */}
        <div
          style={{
            borderRadius: 8,
            border: '1px solid #e7e3d8',
            background: '#ffffff',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: 420,
            position: 'relative',
            opacity: 0,
            animation: inView ? 'slideInRight 0.6s ease 0.15s forwards' : 'none',
          }}
        >
          {/* Sent toast */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: `translateX(-50%) translateY(${sent ? 0 : -12}px)`,
              opacity: sent ? 1 : 0,
              transition: 'opacity 0.2s, transform 0.2s',
              background: '#16a34a',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              padding: '6px 14px',
              borderRadius: 1440,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            ✓ Отправлено
          </div>

          {/* Chat header */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #e7e3d8',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(rgb(251, 146, 60), rgb(253, 186, 116))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 600,
                color: '#1c1917',
                flexShrink: 0,
              }}
            >
              М
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1c1917' }}>Алексей</div>
              <div style={{ fontSize: 12, color: '#78716c' }}>FullStack разработчик</div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.from === 'user' ? '#1c1917' : '#f5f0e8',
                    border: msg.from === 'user' ? 'none' : '1px solid #e7e3d8',
                    color: msg.from === 'user' ? '#f5f0e8' : '#1c1917',
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {sending && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: '16px 16px 16px 4px',
                    background: '#f5f0e8',
                    border: '1px solid #e7e3d8',
                    color: '#78716c',
                    fontSize: 14,
                    letterSpacing: 2,
                  }}
                >
                  ···
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #e7e3d8',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Напишите сообщение..."
              disabled={sending}
              aria-label="Текст сообщения"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 1440,
                border: '1px solid #e7e3d8',
                background: '#f5f0e8',
                color: '#1c1917',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'var(--sans)',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#1c1917')}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#e7e3d8')}
            />
            <button
              onClick={send}
              disabled={!input.trim() || sending}
              aria-label="Отправить"
              style={{
                width: 42,
                height: 42,
                borderRadius: 1440,
                border: 'none',
                background: input.trim() && !sending
                  ? 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))'
                  : '#e7e3d8',
                color: '#1c1917',
                cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
