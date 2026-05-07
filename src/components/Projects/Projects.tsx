import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useInView } from '../../hooks/useInView'
import projects, { type Project } from '../../data/projects'

interface ProjectsProps {
  onSimilarOpen: (projectTitle: string) => void
}

type Filter = 'all' | 'website' | 'telegram-bot'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',          label: 'Все'           },
  { id: 'website',      label: 'Сайты'         },
  { id: 'telegram-bot', label: 'Telegram-боты' },
]

function ProjectCard({
  project,
  onSimilarOpen,
  animDelay = 0,
}: {
  project: Project
  onSimilarOpen: (projectTitle: string) => void
  animDelay?: number
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 8,
        border: '1px solid #e7e3d8',
        background: '#ffffff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(28,25,23,0.10)' : '0 0 0 rgba(0,0,0,0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        opacity: 0,
        animation: `fadeUp 0.55s ease ${animDelay}s forwards`,
      }}
    >
      {/* Image / placeholder */}
      <div
        style={{
          aspectRatio: '16/9',
          background: 'linear-gradient(rgb(251, 146, 60), rgb(253, 186, 116))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {project.screenshots?.[0] ? (
          <img
            src={project.screenshots[0]}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#1c1917" strokeWidth="1.2" strokeOpacity="0.4" />
            <path d="M3 9h18M9 21V9" stroke="#1c1917" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
          </svg>
        )}

        {/* Category badge */}
        <span
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            padding: '4px 10px',
            borderRadius: 8,
            background: '#f5f0e8',
            color: '#1c1917',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {project.category === 'website' ? 'Сайт' : 'Telegram-бот'}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1, gap: 12 }}>
        <h3
          style={{
            fontFamily: 'var(--heading)',
            fontSize: 18,
            fontWeight: 600,
            color: '#1c1917',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </h3>

        <p style={{ fontSize: 14, color: '#78716c', lineHeight: 1.6, flex: 1 }}>
          {project.description}
        </p>

        {/* Stack tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              style={{
                padding: '3px 10px',
                borderRadius: 8,
                border: '1px solid #e7e3d8',
                fontSize: 12,
                color: '#78716c',
                fontWeight: 500,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <Link
            to={`/projects/${project.slug}`}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 1440,
              border: '1px solid #e7e3d8',
              background: '#ffffff',
              color: '#1c1917',
              fontSize: 13,
              fontWeight: 500,
              textAlign: 'center',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = '#1c1917')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = '#e7e3d8')}
          >
            Подробнее
          </Link>
          <button
            onClick={() => onSimilarOpen(project.title)}
            style={{
              flex: 1,
              padding: '10px 0',
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
    </article>
  )
}

export default function Projects({ onSimilarOpen }: ProjectsProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const isMobile = useIsMobile()
  const { ref, inView } = useInView()
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" style={{ background: '#ffffff' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '64px 16px' : '96px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
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
            Портфолио
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--heading)',
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 600,
                color: '#1c1917',
                letterSpacing: '-0.02em',
              }}
            >
              Проекты
            </h2>

            {/* Filter — pill buttons */}
            <div style={{ display: 'flex', gap: 6 }}>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 1440,
                    border: filter === f.id ? '1px solid #1c1917' : '1px solid #e7e3d8',
                    background: filter === f.id ? '#1c1917' : '#ffffff',
                    color: filter === f.id ? '#f5f0e8' : '#1c1917',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--sans)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onSimilarOpen={onSimilarOpen}
              animDelay={inView ? i * 0.1 : 99}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#78716c', padding: '48px 0' }}>
            Нет проектов в этой категории
          </p>
        )}
      </div>
    </section>
  )
}
