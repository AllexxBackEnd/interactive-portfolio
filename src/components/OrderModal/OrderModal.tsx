import { useState } from 'react'
import { submitLead } from '../../api/leads'
import { useIsMobile } from '../../hooks/useIsMobile'

export interface OrderConfig {
  configSummary: string
  total: number
}

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  config?: OrderConfig
}

const fmt    = (n: number) => n.toLocaleString('ru-RU')
const toUsd = (rub: number) => Math.round(rub / 90).toLocaleString('en-US')
const toByn = (rub: number) => Math.round(rub / 29).toLocaleString('ru-RU')

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

export default function OrderModal({ isOpen, onClose, config }: OrderModalProps) {
  const [name, setName]           = useState('')
  const [telegram, setTelegram]   = useState('')
  const [whatsapp, setWhatsapp]   = useState('')
  const [email, setEmail]         = useState('')
  const [comment, setComment]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const isMobile = useIsMobile()

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSubmitted(false)
      setError('')
      setName('')
      setTelegram('')
      setWhatsapp('')
      setEmail('')
      setComment('')
    }, 300)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const contact = [
      telegram.trim() && `Telegram: ${telegram.trim()}`,
      whatsapp.trim() && `WhatsApp: ${whatsapp.trim()}`,
      email.trim()    && `Email: ${email.trim()}`,
    ].filter(Boolean).join('\n')
    if (!name.trim() || !contact) { setError('Заполните имя и хотя бы один способ связи'); return }
    setLoading(true); setError('')
    try {
      const description = config?.configSummary + (comment.trim() ? `\nКомментарий: ${comment.trim()}` : '')
      await submitLead({ source: 'calculator', name, description, contact })
      setSubmitted(true)
    } catch {
      setError('Ошибка отправки. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const configLine = config?.configSummary.replace(/,\s*итого:.*$/, '') ?? ''

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
        <button
          onClick={handleClose}
          aria-label="Закрыть"
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32,
            borderRadius: 1440,
            border: '1px solid #e7e3d8',
            background: '#ffffff',
            cursor: 'pointer',
            color: '#1c1917', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--sans)',
          }}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 8,
              background: '#f5f0e8', border: '1px solid #e7e3d8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l4.5 4.5 9.5-10" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontWeight: 600, color: '#1c1917', marginBottom: 6, fontSize: 16 }}>Заявка получена!</p>
            <p style={{ color: '#78716c', fontSize: 14 }}>Свяжусь в течение нескольких часов.</p>
          </div>
        ) : (
          <>
            <h3 style={{
              fontFamily: 'var(--heading)',
              fontSize: 22, fontWeight: 600, color: '#1c1917',
              letterSpacing: '-0.015em', marginBottom: 20,
            }}>
              Оформить заказ
            </h3>

            {config && (
              <div style={{
                padding: '16px 20px',
                borderRadius: 8,
                background: '#f5f0e8',
                border: '1px solid #e7e3d8',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}>
                <p style={{ fontSize: 13, color: '#78716c', lineHeight: 1.55, flex: 1 }}>
                  {configLine}
                </p>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--display)',
                    fontSize: 24,
                    fontWeight: 400,
                    color: '#1c1917',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.2,
                  }}>
                    ~{fmt(config.total)} ₽
                  </div>
                  <div style={{ fontSize: 12, color: '#78716c', fontWeight: 500, whiteSpace: 'nowrap', marginTop: 3 }}>
                    ~{toUsd(config.total)} $ · ~{toByn(config.total)} Br
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>Ваше имя *</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Александр" style={inputStyle}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#1c1917')}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#e7e3d8')}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Контакт * <span style={{ fontWeight: 400, color: '#a8a29e' }}>— хотя бы один</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {([
                    { label: 'TG',    value: telegram, setter: setTelegram, placeholder: '@username',         type: 'text'  },
                    { label: 'WA',    value: whatsapp, setter: setWhatsapp, placeholder: '+7 999 123 45 67',  type: 'tel'   },
                    { label: 'Email', value: email,    setter: setEmail,    placeholder: 'email@mail.ru',     type: 'email' },
                  ] as const).map(({ label, value, setter, placeholder, type }) => (
                    <div key={label} style={{ display: 'flex', gap: 8 }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 48, borderRadius: 8,
                        background: '#f5f0e8', border: '1px solid #e7e3d8',
                        fontSize: 11, fontWeight: 700, color: '#78716c',
                        flexShrink: 0, letterSpacing: '0.04em',
                      }}>
                        {label}
                      </span>
                      <input
                        type={type} value={value} onChange={(e) => setter(e.target.value)}
                        placeholder={placeholder} style={{ ...inputStyle, flex: 1 }}
                        onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#1c1917')}
                        onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#e7e3d8')}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Комментарий</label>
                <textarea
                  value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="Детали, пожелания, вопросы..." rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = '#1c1917')}
                  onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = '#e7e3d8')}
                />
              </div>
              {error && <p style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>}
              <button
                type="submit" disabled={loading}
                style={{
                  marginTop: 4, padding: '13px',
                  borderRadius: 1440, border: 'none',
                  background: loading ? '#e7e3d8' : 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
                  color: '#1c1917', fontSize: 15, fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--sans)', transition: 'opacity 0.15s',
                }}
              >
                {loading ? 'Отправляем...' : 'Отправить заявку'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
