import { useState } from 'react'
import { useParams } from 'react-router-dom'
import projects from '../data/projects'
import Navbar from '../components/Navbar/Navbar'
import Quiz from '../components/Quiz/Quiz'
import SimilarModal from '../components/SimilarModal/SimilarModal'

/* ─── Sub-components ─────────────────────────────────────── */

function SectionLabel({ children }: { children: string }) {
  return (
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
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--heading)',
        fontSize: 'clamp(24px, 3.5vw, 32px)',
        fontWeight: 600,
        color: '#1c1917',
        letterSpacing: '-0.02em',
        marginBottom: 20,
        lineHeight: 1.15,
      }}
    >
      {children}
    </h2>
  )
}

function BodyText({ children }: { children: string }) {
  return (
    <p
      style={{
        fontSize: 16,
        color: '#78716c',
        lineHeight: 1.75,
        maxWidth: 680,
      }}
    >
      {children}
    </p>
  )
}

function ScreenshotPlaceholder({ index }: { index: number }) {
  const gradients = [
    'linear-gradient(135deg, rgb(251, 146, 60), rgb(253, 186, 116))',
    'linear-gradient(135deg, rgb(202, 205, 120), rgb(204, 204, 37))',
    'linear-gradient(135deg, rgb(179, 186, 232), rgb(159, 166, 255))',
  ]
  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid #e7e3d8',
        background: gradients[index % gradients.length],
        aspectRatio: '16/10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#1c1917" strokeWidth="1.2" strokeOpacity="0.3" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="#1c1917" fillOpacity="0.3" />
        <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#1c1917" strokeWidth="1.2" strokeOpacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/* ─── Not found ──────────────────────────────────────────── */

function NotFound({ onQuizOpen }: { onQuizOpen: () => void }) {
  return (
    <>
      <Navbar onQuizOpen={onQuizOpen} />
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          paddingTop: 60,
          background: '#ffffff',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--display)',
            fontSize: 72,
            fontWeight: 400,
            color: '#e7e3d8',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          404
        </p>
        <p style={{ fontSize: 16, color: '#78716c' }}>Проект не найден</p>
        <a
          href="/#projects"
          style={{
            marginTop: 8,
            padding: '12px 24px',
            borderRadius: 1440,
            border: 'none',
            background: '#1c1917',
            color: '#f5f0e8',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
            fontFamily: 'var(--sans)',
          }}
        >
          ← Все проекты
        </a>
      </div>
    </>
  )
}

/* ─── Main page ──────────────────────────────────────────── */

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const [quizOpen, setQuizOpen]       = useState(false)
  const [similarOpen, setSimilarOpen] = useState(false)

  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <>
        <NotFound onQuizOpen={() => setQuizOpen(true)} />
        <Quiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      </>
    )
  }

  return (
    <>
      <Navbar onQuizOpen={() => setQuizOpen(true)} />

      <main style={{ paddingTop: 60 }}>
        {/* ── Hero header ─────────────────────────────────── */}
        <section style={{ background: '#ffffff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 0' }}>
            {/* Breadcrumb */}
            <a
              href="/#projects"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14,
                fontWeight: 500,
                color: '#78716c',
                textDecoration: 'none',
                marginBottom: 32,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#1c1917')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#78716c')}
            >
              ← Все проекты
            </a>

            <div style={{ maxWidth: 760 }}>
              {/* Category badge */}
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 8,
                  background: '#f5f0e8',
                  border: '1px solid #e7e3d8',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1c1917',
                  marginBottom: 20,
                }}
              >
                {project.category === 'website' ? 'Сайт' : 'Telegram-бот'}
              </span>

              {/* Title — Playfair Display */}
              <h1
                style={{
                  fontFamily: 'var(--display)',
                  fontWeight: 400,
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  color: '#1c1917',
                  letterSpacing: '-0.03em',
                  lineHeight: 0.95,
                  marginBottom: 24,
                }}
              >
                {project.title}
              </h1>

              <p
                style={{
                  fontSize: 18,
                  color: '#78716c',
                  lineHeight: 1.65,
                  marginBottom: 28,
                  maxWidth: 600,
                }}
              >
                {project.description}
              </p>

              {/* Stack tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 1440,
                      border: '1px solid #e7e3d8',
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#1c1917',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Screenshot hero — Sky Violet gradient band */}
          <div
            style={{
              maxWidth: 1100,
              margin: '48px auto 0',
              padding: '0 24px',
            }}
          >
            <div
              style={{
                borderRadius: 8,
                border: '1px solid #e7e3d8',
                background: 'linear-gradient(160deg, rgb(159, 166, 255) 0%, rgb(202, 205, 120) 100%)',
                height: 'clamp(220px, 35vw, 420px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {project.screenshots?.[0] ? (
                <img
                  src={project.screenshots[0]}
                  alt={`${project.title} — скриншот`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  {/* Decorative placeholder UI mockup */}
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(2px)',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.4)',
                      width: '60%',
                      maxWidth: 420,
                      padding: '20px 24px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(23,21,14,0.2)' }} />
                      ))}
                    </div>
                    {[100,80,90,60].map((w, i) => (
                      <div
                        key={i}
                        style={{
                          height: i === 0 ? 14 : 10,
                          width: `${w}%`,
                          borderRadius: 4,
                          background: 'rgba(23,21,14,0.15)',
                          marginBottom: 10,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Task ────────────────────────────────────────── */}
        <section style={{ background: '#ffffff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
            <div style={{ maxWidth: 720 }}>
              <SectionLabel>Задача</SectionLabel>
              <SectionHeading>Постановка задачи</SectionHeading>
              <BodyText>{project.task}</BodyText>
            </div>
          </div>
        </section>

        {/* ── Solution ────────────────────────────────────── */}
        <section
          style={{
            background: '#f5f0e8',
            borderTop: '1px solid #e7e3d8',
            borderBottom: '1px solid #e7e3d8',
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: '80px 24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 64,
              alignItems: 'start',
            }}
          >
            <div>
              <SectionLabel>Решение</SectionLabel>
              <SectionHeading>Подход к задаче</SectionHeading>
              <BodyText>{project.solution}</BodyText>
            </div>

            {/* Stack detail card */}
            <div
              style={{
                borderRadius: 8,
                border: '1px solid #e7e3d8',
                background: '#ffffff',
                padding: 24,
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Стек проекта
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {project.stack.map((tech) => (
                  <div
                    key={tech}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid #e7e3d8',
                      background: '#f5f0e8',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#1c1917',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#1c1917' }}>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Result ──────────────────────────────────────── */}
        <section style={{ background: '#ffffff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
            <SectionLabel>Результат</SectionLabel>
            <SectionHeading>Итог</SectionHeading>
            <BodyText>{project.result}</BodyText>

            {/* Metrics */}
            {project.metrics && (
              <div
                style={{
                  display: 'flex',
                  gap: 48,
                  flexWrap: 'wrap',
                  marginTop: 48,
                  marginBottom: 56,
                }}
              >
                {project.metrics.map((m) => (
                  <div key={m.label} style={{ borderTop: '2px solid #1c1917', paddingTop: 12 }}>
                    <div
                      style={{
                        fontFamily: 'var(--display)',
                        fontSize: 40,
                        fontWeight: 400,
                        color: '#1c1917',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {m.value}
                    </div>
                    <div style={{ fontSize: 13, color: '#78716c', fontWeight: 500, maxWidth: 140 }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Screenshot grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {project.screenshots && project.screenshots.length > 0
                ? project.screenshots.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: 8,
                        border: '1px solid #e7e3d8',
                        overflow: 'hidden',
                        aspectRatio: '16/10',
                      }}
                    >
                      <img
                        src={src}
                        alt={`${project.title} — скриншот ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                  ))
                : [0, 1, 2].map((i) => <ScreenshotPlaceholder key={i} index={i} />)}
            </div>
          </div>
        </section>

        {/* ── CTA — dark ──────────────────────────────────── */}
        <section
          style={{
            background: '#1c1917',
            padding: '96px 24px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(240, 247, 246, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            Следующий шаг
          </p>
          <h2
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 400,
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: '#f5f0e8',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Нужен похожий проект?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(240, 247, 246, 0.6)',
              marginBottom: 40,
              lineHeight: 1.65,
            }}
          >
            Опишите задачу. Свяжусь в течение нескольких часов.
          </p>
          <button
            onClick={() => setSimilarOpen(true)}
            style={{
              padding: '16px 40px',
              borderRadius: 1440,
              border: 'none',
              background: 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
              color: '#1c1917',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
          >
            Хочу похожее →
          </button>
        </section>
      </main>

      <footer
        style={{
          borderTop: '1px solid #e7e3d8',
          padding: '24px',
          textAlign: 'center',
          fontSize: 13,
          color: '#78716c',
          background: '#ffffff',
          fontWeight: 500,
        }}
      >
        © {new Date().getFullYear()} Алексей, FullStack разработчик
      </footer>

      <Quiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      <SimilarModal
        isOpen={similarOpen}
        onClose={() => setSimilarOpen(false)}
        projectTitle={project.title}
      />
    </>
  )
}
