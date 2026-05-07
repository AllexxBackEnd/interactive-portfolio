import { useIsMobile } from '../../hooks/useIsMobile'
import { useInView } from '../../hooks/useInView'

const STATS = [
  { value: '3+',   label: 'года опыта'     },
  { value: '20+',  label: 'проектов'       },
  { value: '100%', label: 'сдача в срок'   },
]

export default function About() {
  const isMobile = useIsMobile()
  const { ref, inView } = useInView()

  return (
    <section
      id="about"
      style={{ background: '#f5f0e8', borderTop: '1px solid #e7e3d8', borderBottom: '1px solid #e7e3d8' }}
    >
      <div
        ref={ref}
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
        {/* Avatar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          opacity: 0,
          animation: inView ? 'slideInLeft 0.65s ease 0s forwards' : 'none',
        }}>
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: 8,
              background: 'linear-gradient(rgb(251, 146, 60), rgb(253, 186, 116))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#1c1917" strokeWidth="1.2" />
              <path
                d="M4 20c0-4 3.58-7 8-7s8 3 8 7"
                stroke="#1c1917"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div style={{
          opacity: 0,
          animation: inView ? 'slideInRight 0.65s ease 0.1s forwards' : 'none',
        }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#78716c',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            О себе
          </p>
          <h2
            style={{
              fontFamily: 'var(--heading)',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 600,
              color: '#1c1917',
              letterSpacing: '-0.02em',
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            Middle FullStack разработчик
          </h2>
          <p
            style={{
              color: '#78716c',
              lineHeight: 1.65,
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            Три года пишу коммерческий код: React на фронте, Python + FastAPI на бэке. Один разработчик ведёт проект от задачи до деплоя.
          </p>
          <p
            style={{
              color: '#78716c',
              lineHeight: 1.65,
              fontSize: 16,
              marginBottom: 40,
            }}
          >
            Работаю с малым бизнесом и стартапами. Задачи согласовываю письменно, держу дедлайны, сдаю код с документацией.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {STATS.map((stat, i) => (
              <div key={stat.label} style={{
                borderTop: '2px solid #1c1917',
                paddingTop: 12,
                opacity: 0,
                animation: inView ? `fadeUp 0.5s ease ${0.3 + i * 0.1}s forwards` : 'none',
              }}>
                <div
                  style={{
                    fontFamily: 'var(--heading)',
                    fontSize: 32,
                    fontWeight: 600,
                    color: '#1c1917',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: '#78716c', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
