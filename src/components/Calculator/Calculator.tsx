import { useState, useMemo } from 'react'
import type { OrderConfig } from '../OrderModal/OrderModal'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useInView } from '../../hooks/useInView'

interface CalculatorProps {
  onOrderOpen: (config: OrderConfig) => void
}

const PROJECT_TYPES = [
  { id: 'landing', label: 'Лендинг',           basePrice: 5000  },
  { id: 'website', label: 'Сайт',               basePrice: 11800 },
  { id: 'shop',    label: 'Магазин',             basePrice: 17600 },
  { id: 'bot',     label: 'Telegram-бот',        basePrice: 7600  },
  { id: 'webapp',  label: 'Веб-приложение',      basePrice: 23500 },
]

const FEATURES = [
  { id: 'auth',       label: 'Личный кабинет',    price: 1100 },
  { id: 'payment',    label: 'Оплата онлайн',     price: 1600 },
  { id: 'admin',      label: 'Админ-панель',       price: 1700 },
  { id: 'api',        label: 'Интеграция с API',   price: 1000 },
  { id: 'animations', label: 'Анимации',           price: 700  },
  { id: 'multilang',  label: 'Мультиязычность',    price: 1000 },
  { id: 'seo',        label: 'SEO-оптимизация',    price: 700  },
]

const DEADLINES = [
  { id: 'urgent',     label: 'Срочно (1-2 нед.)', multiplier: 1.5  },
  { id: 'month',      label: '1 месяц',            multiplier: 1.0  },
  { id: 'twomonths',  label: '2-3 месяца',         multiplier: 0.9  },
  { id: 'flexible',   label: 'Не критично',        multiplier: 0.85 },
]

const fmt    = (n: number) => n.toLocaleString('ru-RU')
const USD_RATE = 90   // 1 USD ≈ 90 ₽
const BYN_RATE = 29   // 1 BYN ≈ 29 ₽
const toUsd = (rub: number) => Math.round(rub / USD_RATE).toLocaleString('en-US')
const toByn = (rub: number) => Math.round(rub / BYN_RATE).toLocaleString('ru-RU')

export default function Calculator({ onOrderOpen }: CalculatorProps) {
  const [projectType, setProjectType]         = useState('landing')
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set())
  const [deadline, setDeadline]               = useState('month')

  const toggleFeature = (id: string) =>
    setSelectedFeatures((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const total = useMemo(() => {
    const base        = PROJECT_TYPES.find((p) => p.id === projectType)?.basePrice ?? 0
    const featuresCost = FEATURES.filter((f) => selectedFeatures.has(f.id)).reduce((s, f) => s + f.price, 0)
    const multiplier  = DEADLINES.find((d) => d.id === deadline)?.multiplier ?? 1
    return Math.round((base + featuresCost) * multiplier)
  }, [projectType, selectedFeatures, deadline])

  const configSummary = useMemo(() => {
    const type     = PROJECT_TYPES.find((p) => p.id === projectType)?.label ?? ''
    const features = FEATURES.filter((f) => selectedFeatures.has(f.id)).map((f) => f.label).join(', ')
    const dl       = DEADLINES.find((d) => d.id === deadline)?.label ?? ''
    return `${type}${features ? `, ${features}` : ''}, срок: ${dl}, итого: ~${fmt(total)} ₽`
  }, [projectType, selectedFeatures, deadline, total])

  const selectedDeadline = DEADLINES.find((d) => d.id === deadline)!
  const isMobile = useIsMobile()
  const { ref, inView } = useInView()

  /* ─── Shared styles ──────────────────────────────────────── */
  const pillBtn = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px',
    borderRadius: 1440,
    border: `1px solid ${active ? '#1c1917' : '#e7e3d8'}`,
    background: active ? '#1c1917' : '#ffffff',
    color: active ? '#f5f0e8' : '#1c1917',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'var(--sans)',
  })

  return (
    <section
      id="calculator"
      style={{
        background: '#f5f0e8',
        borderTop: '1px solid #e7e3d8',
        borderBottom: '1px solid #e7e3d8',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '64px 16px' : '96px 24px' }}>
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
          Услуги
        </p>
        <h2
          style={{
            fontFamily: 'var(--heading)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 600,
            color: '#1c1917',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          Калькулятор стоимости
        </h2>
        <p style={{ color: '#78716c', marginBottom: 56, fontSize: 16 }}>
          Выберите тип проекта, функции и срок. Цена пересчитается.
        </p>

        <div
          ref={ref}
          style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: isMobile ? 32 : 40 }}
        >
          {/* Left: controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            opacity: 0,
            animation: inView ? 'slideInLeft 0.6s ease 0s forwards' : 'none',
          }}>
            {/* Type */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1c1917', marginBottom: 12 }}>
                Тип проекта
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {PROJECT_TYPES.map((pt) => (
                  <button key={pt.id} onClick={() => setProjectType(pt.id)} style={pillBtn(projectType === pt.id)}>
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1c1917', marginBottom: 12 }}>
                Дополнительно
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {FEATURES.map((f) => {
                  const on = selectedFeatures.has(f.id)
                  return (
                    <label
                      key={f.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: `1px solid ${on ? '#1c1917' : '#e7e3d8'}`,
                        background: on ? '#1c1917' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleFeature(f.id)}
                          style={{ accentColor: '#f97316', width: 15, height: 15, cursor: 'pointer' }}
                          aria-label={f.label}
                        />
                        <span style={{ fontSize: 14, color: on ? '#f5f0e8' : '#1c1917', fontWeight: 500 }}>
                          {f.label}
                        </span>
                      </div>
                      <span style={{ fontSize: 13, color: on ? '#f5f0e8' : '#78716c', fontWeight: 500 }}>
                        +{fmt(f.price)} ₽
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1c1917', marginBottom: 12 }}>
                Сроки
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DEADLINES.map((d) => (
                  <button key={d.id} onClick={() => setDeadline(d.id)} style={pillBtn(deadline === d.id)}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: price card */}
          <div style={{
            opacity: 0,
            animation: inView ? 'slideInRight 0.6s ease 0.15s forwards' : 'none',
          }}>
            <div
              style={{
                padding: 32,
                borderRadius: 8,
                border: '1px solid #e7e3d8',
                background: '#ffffff',
                position: isMobile ? 'static' : 'sticky',
                top: 80,
              }}
            >
              <p style={{ fontSize: 13, color: '#78716c', marginBottom: 4 }}>
                Ориентировочная стоимость
              </p>
              <div key={total} style={{ marginBottom: 28, animation: 'pricePop 0.35s ease' }}>
                <div
                  style={{
                    fontFamily: 'var(--display)',
                    fontSize: 'clamp(40px, 6vw, 64px)',
                    fontWeight: 400,
                    color: '#1c1917',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: 6,
                  }}
                >
                  ~{fmt(total)} ₽
                </div>
                <div style={{ fontSize: 13, color: '#78716c', fontWeight: 500 }}>
                  ~{toUsd(total)} $ &nbsp;·&nbsp; ~{toByn(total)} Br
                </div>
              </div>

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#78716c' }}>
                    {PROJECT_TYPES.find((p) => p.id === projectType)?.label}
                  </span>
                  <span style={{ color: '#1c1917', fontWeight: 500 }}>
                    {fmt(PROJECT_TYPES.find((p) => p.id === projectType)?.basePrice ?? 0)} ₽
                  </span>
                </div>
                {FEATURES.filter((f) => selectedFeatures.has(f.id)).map((f) => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: '#78716c' }}>{f.label}</span>
                    <span style={{ color: '#1c1917', fontWeight: 500 }}>+{fmt(f.price)} ₽</span>
                  </div>
                ))}
                {selectedDeadline.multiplier !== 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: '#78716c' }}>
                      {selectedDeadline.multiplier > 1 ? 'Срочность' : 'Скидка за срок'}
                    </span>
                    <span style={{ color: '#1c1917', fontWeight: 500 }}>
                      ×{selectedDeadline.multiplier}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: '#e7e3d8', marginBottom: 20 }} />

              <p style={{ fontSize: 13, color: '#78716c', lineHeight: 1.55, marginBottom: 20 }}>
                Точную стоимость называю после изучения ТЗ. Оплата в два этапа: 50% предоплата.
              </p>

              <button
                onClick={() => onOrderOpen({ configSummary, total })}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 1440,
                  border: 'none',
                  background: 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
                  color: '#1c1917',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--sans)',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
              >
                Заказать за ~{fmt(total)} ₽
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
