import { useState } from 'react'
import { submitLead } from '../../api/leads'
import { useIsMobile } from '../../hooks/useIsMobile'

export interface ContactPrefill {
  title?: string
  config?: string
}

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  prefillData?: ContactPrefill
}

const TELEGRAM_BOT_URL = 'https://t.me/your_bot'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #e7e3d8',
  background: '#f5f0e8',
  color: '#1c1917',
  fontSize: 15,
  fontFamily: 'var(--sans)',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: '#78716c',
  marginBottom: 6,
}

export default function ContactModal({ isOpen, onClose, prefillData }: ContactModalProps) {
  const [tab, setTab]           = useState<'form' | 'telegram'>('form')
  const [name, setName]         = useState('')
  const [task, setTask]         = useState(
    prefillData?.title  ? `Хочу похожее: ${prefillData.title}` :
    prefillData?.config ? prefillData.config : ''
  )
  const [contact, setContact]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSubmitted(false)
      setError('')
      setName('')
      setContact('')
      setTask(prefillData?.title ? `Хочу похожее: ${prefillData.title}` : prefillData?.config ?? '')
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) { setError('Заполните имя и способ связи'); return }
    setLoading(true); setError('')
    try {
      await submitLead({ source: 'form', name, description: task, contact })
      setSubmitted(true)
    } catch {
      setError('Ошибка отправки. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  const isMobile = useIsMobile()

  if (!isOpen) return null

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(28, 25, 23, 0.5)',
        display: 'flex',
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? 0 : 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          border: '1px solid #e7e3d8',
          borderRadius: isMobile ? '12px 12px 0 0' : 8,
          padding: isMobile ? '28px 20px 32px' : '36px 32px',
          maxWidth: 460,
          width: '100%',
          position: 'relative',
          maxHeight: isMobile ? '92vh' : 'none',
          overflowY: isMobile ? 'auto' : 'visible',
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Закрыть"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 1440,
            border: '1px solid #e7e3d8',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#1c1917',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--sans)',
            transition: 'border-color 0.15s',
          }}
        >
          ×
        </button>

        <h3
          style={{
            fontFamily: 'var(--heading)',
            fontSize: 22,
            fontWeight: 600,
            color: '#1c1917',
            letterSpacing: '-0.015em',
            marginBottom: prefillData?.title ? 6 : 20,
          }}
        >
          Обсудим задачу
        </h3>
        {prefillData?.title && (
          <p style={{ fontSize: 13, color: '#78716c', marginBottom: 20 }}>
            Хочу похожее: {prefillData.title}
          </p>
        )}

        {/* Tab switcher — pill */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 24,
            border: '1px solid #e7e3d8',
            borderRadius: 1440,
            padding: 4,
          }}
        >
          {(['form', 'telegram'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 1440,
                border: 'none',
                background: tab === t ? '#1c1917' : 'transparent',
                color: tab === t ? '#f5f0e8' : '#1c1917',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--sans)',
              }}
            >
              {t === 'form' ? 'Форма' : 'Telegram-бот'}
            </button>
          ))}
        </div>

        {tab === 'form' ? (
          submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: '#f5f0e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  border: '1px solid #e7e3d8',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l4.5 4.5 9.5-10" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={{ fontWeight: 600, color: '#1c1917', marginBottom: 6, fontSize: 16 }}>
                Заявка получена!
              </p>
              <p style={{ color: '#78716c', fontSize: 14 }}>
                Свяжусь в течение нескольких часов.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>Ваше имя *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Александр"
                  style={inputStyle}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#1c1917')}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#e7e3d8')}
                />
              </div>
              <div>
                <label style={labelStyle}>Задача</label>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Кратко: что нужно сделать"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = '#1c1917')}
                  onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = '#e7e3d8')}
                />
              </div>
              <div>
                <label style={labelStyle}>Telegram или email *</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="@username или email@mail.ru"
                  style={inputStyle}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#1c1917')}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#e7e3d8')}
                />
              </div>
              {error && <p style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 4,
                  padding: '13px',
                  borderRadius: 1440,
                  border: 'none',
                  background: loading
                    ? '#e7e3d8'
                    : 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
                  color: '#1c1917',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--sans)',
                  transition: 'opacity 0.15s',
                }}
              >
                {loading ? 'Отправляем...' : 'Отправить заявку'}
              </button>
            </form>
          )
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background: 'linear-gradient(rgb(251, 146, 60), rgb(253, 186, 116))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.92c-.12.54-.46.66-.92.42l-2.52-1.86-1.22 1.18c-.14.14-.26.26-.52.26l.18-2.58 4.74-4.28c.2-.18-.04-.28-.32-.1l-5.86 3.7-2.52-.78c-.54-.18-.56-.54.12-.8l9.86-3.8c.44-.16.84.1.66.72z"
                  fill="#1c1917"
                />
              </svg>
            </div>
            <h4 style={{ fontFamily: 'var(--heading)', fontSize: 17, fontWeight: 600, color: '#1c1917', marginBottom: 8 }}>
              Написать в Telegram-бот
            </h4>
            <p style={{ color: '#78716c', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Бот уточнит детали задачи и передаст заявку мне. Отвечу в течение нескольких часов.
            </p>
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '13px 28px',
                borderRadius: 1440,
                border: 'none',
                background: 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
                color: '#1c1917',
                textDecoration: 'none',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Открыть бот →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
