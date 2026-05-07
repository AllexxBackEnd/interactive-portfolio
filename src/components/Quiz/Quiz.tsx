import { useState } from 'react'
import { submitLead } from '../../api/leads'
import { useIsMobile } from '../../hooks/useIsMobile'

interface QuizProps {
  isOpen: boolean
  onClose: () => void
}

const STEPS = [
  {
    title: 'Тип проекта',
    field: 'projectType' as const,
    options: [
      { value: 'landing', label: 'Лендинг / сайт-визитка'  },
      { value: 'website', label: 'Корпоративный сайт'       },
      { value: 'shop',    label: 'Интернет-магазин'         },
      { value: 'bot',     label: 'Telegram-бот'             },
      { value: 'webapp',  label: 'Веб-приложение'           },
      { value: 'other',   label: 'Другое'                   },
    ],
  },
  {
    title: 'Бюджет',
    field: 'budget' as const,
    options: [
      { value: 'lt30',    label: 'До 30 000 ₽'           },
      { value: '30-80',   label: '30 000 — 80 000 ₽'     },
      { value: '80-200',  label: '80 000 — 200 000 ₽'    },
      { value: 'gt200',   label: 'От 200 000 ₽'          },
      { value: 'unknown', label: 'Пока не знаю'           },
    ],
  },
  {
    title: 'Сроки',
    field: 'deadline' as const,
    options: [
      { value: 'urgent',    label: 'Срочно (1-2 недели)'  },
      { value: 'month',     label: 'В течение месяца'     },
      { value: '2-3months', label: '2-3 месяца'           },
      { value: 'flexible',  label: 'Не критично'          },
    ],
  },
]

const TOTAL_STEPS = STEPS.length + 1

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

interface QuizData { projectType: string; budget: string; deadline: string }
type StepField = 'projectType' | 'budget' | 'deadline'

export default function Quiz({ isOpen, onClose }: QuizProps) {
  const [step, setStep]           = useState(0)
  const [data, setData]           = useState<QuizData>({ projectType: '', budget: '', deadline: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const [name, setName]         = useState('')
  const [telegram, setTelegram] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail]       = useState('')
  const [contactError, setContactError] = useState('')

  const current = STEPS[step]

  const handleSelect = (field: StepField, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
    setStep((s) => s + 1)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const contact = [
      telegram.trim() && `Telegram: ${telegram.trim()}`,
      whatsapp.trim() && `WhatsApp: ${whatsapp.trim()}`,
      email.trim()    && `Email: ${email.trim()}`,
    ].filter(Boolean).join('\n')
    if (!name.trim() || !contact) { setContactError('Заполните имя и хотя бы один способ связи'); return }
    setContactError('')
    setLoading(true)
    try {
      await submitLead({
        source: 'quiz',
        name,
        contact,
        projectType: data.projectType,
        budget: data.budget,
        deadline: data.deadline,
      })
    } catch {
      // non-critical
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep(0)
      setData({ projectType: '', budget: '', deadline: '' })
      setSubmitted(false)
      setName('')
      setTelegram('')
      setWhatsapp('')
      setEmail('')
      setContactError('')
    }, 300)
  }

  const isMobile = useIsMobile()

  if (!isOpen) return null

  const isContactStep = step === STEPS.length

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
          maxWidth: 480,
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
          }}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background: '#f5f0e8',
                border: '1px solid #e7e3d8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l4.5 4.5 9.5-10" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--heading)', fontSize: 22, fontWeight: 600, color: '#1c1917', marginBottom: 8, letterSpacing: '-0.015em' }}>
              Заявка отправлена!
            </h3>
            <p style={{ color: '#78716c', lineHeight: 1.6, marginBottom: 28, fontSize: 15 }}>
              Свяжусь в течение нескольких часов.
            </p>
            <button
              onClick={handleClose}
              style={{
                padding: '12px 28px',
                borderRadius: 1440,
                border: 'none',
                background: 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
                color: '#1c1917',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
              }}
            >
              Отлично!
            </button>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 2,
                    background: i <= step ? '#1c1917' : '#e7e3d8',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 600, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Шаг {step + 1} из {TOTAL_STEPS}
            </p>

            {isContactStep ? (
              <>
                <h3 style={{ fontFamily: 'var(--heading)', fontSize: 22, fontWeight: 600, color: '#1c1917', letterSpacing: '-0.015em', marginBottom: 20 }}>
                  Как с вами связаться?
                </h3>
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                  {contactError && <p style={{ color: '#b91c1c', fontSize: 13 }}>{contactError}</p>}
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
            ) : (
              <>
                <h3 style={{ fontFamily: 'var(--heading)', fontSize: 22, fontWeight: 600, color: '#1c1917', letterSpacing: '-0.015em', marginBottom: 20 }}>
                  {current.title}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {current.options.map((opt) => {
                    const selected = data[current.field] === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(current.field, opt.value)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: `1px solid ${selected ? '#1c1917' : '#e7e3d8'}`,
                          background: selected ? '#1c1917' : '#ffffff',
                          color: selected ? '#f5f0e8' : '#1c1917',
                          fontSize: 15,
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          fontFamily: 'var(--sans)',
                          fontWeight: 500,
                        }}
                        onMouseEnter={(e) => {
                          if (!selected) (e.currentTarget as HTMLButtonElement).style.background = '#f5f0e8'
                        }}
                        onMouseLeave={(e) => {
                          if (!selected) (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'
                        }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
