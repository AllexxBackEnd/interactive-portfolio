import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTyping } from '../../hooks/useTyping'
import { useIsMobile } from '../../hooks/useIsMobile'
import projects from '../../data/projects'
interface HeroProps {
  onQuizOpen: () => void
  onSimilarOpen: (projectTitle: string) => void
}

const ROLES = [
  'FullStack разработчик',
  'React + FastAPI',
  'Telegram-боты',
  'Веб-приложения',
]

const CARD_GRADIENTS = [
  'linear-gradient(135deg, rgb(159, 166, 255), rgb(202, 205, 120))',
  'linear-gradient(135deg, rgb(179, 186, 232), rgb(159, 200, 255))',
  'linear-gradient(135deg, rgb(202, 205, 120), rgb(159, 166, 255))',
]

const CATEGORY_LABEL: Record<string, string> = {
  'website': 'Сайт',
  'telegram-bot': 'Telegram-бот',
}

function ProjectCarousel({
  onSimilarOpen,
}: {
  onSimilarOpen: (projectTitle: string) => void
}) {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [animating, setAnimating] = useState(false)
  const total = projects.length

  useEffect(() => {
    const id = setInterval(() => {
      setPrev(active)
      setAnimating(true)
      setActive((i) => (i + 1) % total)
    }, 4000)
    return () => clearInterval(id)
  }, [active, total])

  useEffect(() => {
    if (!animating) return
    const t = setTimeout(() => { setAnimating(false); setPrev(null) }, 500)
    return () => clearTimeout(t)
  }, [animating])

  const project = projects[active]
  const prevProject = prev !== null ? projects[prev] : null

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e7e3d8',
          borderRadius: 8,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Outgoing card */}
        {animating && prevProject && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              opacity: 0,
              transform: 'translateX(-24px)',
              transition: 'opacity 0.45s ease, transform 0.45s ease',
            }}
          >
            <CardContent project={prevProject} onSimilarOpen={onSimilarOpen} />
          </div>
        )}

        {/* Incoming card */}
        <div
          key={active}
          style={{
            position: 'relative',
            zIndex: 2,
            opacity: animating ? undefined : 1,
            transform: animating ? undefined : 'none',
            animation: animating ? 'heroCardIn 0.45s ease forwards' : 'none',
          }}
        >
          <CardContent project={project} onSimilarOpen={onSimilarOpen} />
        </div>
      </div>

      {/* Progress dots — passive indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 14 }}>
        {projects.map((_, i) => (
          <div
            key={i}
            style={{
              width: active === i ? 20 : 6,
              height: 6,
              borderRadius: 1440,
              background: active === i ? '#1c1917' : '#e7e3d8',
              transition: 'width 0.4s, background 0.4s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function CardContent({
  project,
  onSimilarOpen,
}: {
  project: (typeof projects)[number]
  onSimilarOpen: (projectTitle: string) => void
}) {
  const idx = projects.indexOf(project)

  return (
    <>
      {/* Image */}
      <div
        style={{
          aspectRatio: '16/9',
          background: CARD_GRADIENTS[idx % CARD_GRADIENTS.length],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {project.screenshots?.[0] ? (
          <img src={project.screenshots[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity={0.4}>
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="#1c1917" strokeWidth="1.2" />
            <path d="M8 21h8M12 17v4" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M2 7h20" stroke="#1c1917" strokeWidth="1.2" />
          </svg>
        )}
        <span
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontSize: 11,
            fontWeight: 600,
            color: '#1c1917',
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(240,247,246,0.92)',
            border: '1px solid rgba(226,226,226,0.7)',
          }}
        >
          {CATEGORY_LABEL[project.category]}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        <h3
          style={{
            fontFamily: 'var(--heading)',
            fontSize: 16,
            fontWeight: 600,
            color: '#1c1917',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            marginBottom: 8,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: 13,
            color: '#78716c',
            lineHeight: 1.6,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description}
        </p>

        {project.metrics?.[0] && (
          <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
            {project.metrics.slice(0, 2).map((m) => (
              <div key={m.label}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1c1917', letterSpacing: '-0.02em', lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: '#78716c', marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Link
            to={`/projects/${project.slug}`}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 1440,
              border: '1px solid #e7e3d8',
              background: '#ffffff',
              color: '#1c1917',
              fontSize: 13,
              fontWeight: 500,
              textAlign: 'center',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#1c1917')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#e7e3d8')}
          >
            Подробнее
          </Link>
          <button
            onClick={() => onSimilarOpen(project.title)}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 1440,
              border: 'none',
              background: 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
              color: '#1c1917',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
          >
            Хочу похожее
          </button>
        </div>
      </div>
    </>
  )
}

export default function Hero({ onQuizOpen, onSimilarOpen }: HeroProps) {
  const typed = useTyping(ROLES)
  const isMobile = useIsMobile()

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '100px 16px 72px' : '120px 40px 96px',
        background: '#ffffff',
        position: 'relative',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          width: '40%',
          height: '40%',
          background: 'linear-gradient(rgb(251, 146, 60), rgb(253, 186, 116))',
          borderRadius: 24,
          opacity: 0.15,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: 1100,
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 48 : 80,
          alignItems: 'center',
        }}
      >
        {/* Left: text */}
        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 8,
              background: '#f5f0e8',
              border: '1px solid #e7e3d8',
              marginBottom: 28,
              opacity: 0,
              animation: 'fadeIn 0.5s ease 0.05s forwards',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1c1917' }}>Открыт к новым проектам</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 400,
              fontSize: isMobile ? 'clamp(40px, 12vw, 64px)' : 'clamp(40px, 5vw, 72px)',
              color: '#1c1917',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              marginBottom: 24,
              opacity: 0,
              animation: 'fadeUp 0.6s ease 0.12s forwards',
            }}
          >
            Здравствуйте,<br />я Алексей
          </h1>

          <div
            style={{
              fontSize: isMobile ? 18 : 20,
              fontWeight: 400,
              color: '#78716c',
              marginBottom: 16,
              minHeight: '1.5em',
              fontFamily: 'var(--sans)',
              letterSpacing: '-0.01em',
              opacity: 0,
              animation: 'fadeUp 0.6s ease 0.22s forwards',
            }}
          >
            <span>{typed}</span>
            <span className="typing-cursor" aria-hidden="true" />
          </div>

          <p
            style={{
              fontSize: isMobile ? 16 : 17,
              color: '#78716c',
              lineHeight: 1.65,
              maxWidth: isMobile ? '100%' : 400,
              margin: isMobile ? '0 auto 40px' : '0 0 40px',
              fontWeight: 400,
              opacity: 0,
              animation: 'fadeUp 0.6s ease 0.32s forwards',
            }}
          >
            Создаю сайты, Telegram-боты и веб-приложения. Берусь за проект целиком: от вёрстки до деплоя.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 12,
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'flex-start',
              opacity: 0,
              animation: 'fadeUp 0.6s ease 0.42s forwards',
            }}
          >
            <button
              onClick={onQuizOpen}
              style={{
                padding: '14px 32px',
                borderRadius: 1440,
                border: 'none',
                background: 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
                color: '#1c1917',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                transition: 'opacity 0.15s',
                letterSpacing: '-0.01em',
                width: isMobile ? '100%' : 'auto',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
            >
              Есть задача? →
            </button>

            <a
              href="/#projects"
              style={{
                padding: '14px 32px',
                borderRadius: 1440,
                border: '1px solid #e7e3d8',
                background: '#ffffff',
                color: '#1c1917',
                fontSize: 16,
                fontWeight: 500,
                fontFamily: 'var(--sans)',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
                letterSpacing: '-0.01em',
                display: 'inline-block',
                width: isMobile ? '100%' : 'auto',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = '#1c1917')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = '#e7e3d8')}
            >
              Проекты ↓
            </a>
          </div>
        </div>

        {/* Right: carousel */}
        <div style={{
          display: 'flex',
          justifyContent: isMobile ? 'center' : 'flex-end',
          opacity: 0,
          animation: 'slideInRight 0.7s ease 0.18s forwards',
        }}>
          <ProjectCarousel onSimilarOpen={onSimilarOpen} />
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1,
          height: 48,
          background: 'linear-gradient(to bottom, transparent, #e7e3d8)',
        }}
      />
    </section>
  )
}
