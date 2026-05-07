import { useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useInView } from '../../hooks/useInView'

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons'

interface Tech { name: string; icon: string; tip: string; animDelay?: number }

const FRONTEND: Tech[] = [
  { name: 'React',        icon: `${DEVICON_BASE}/react/react-original.svg`,             tip: 'UI-компоненты и управление состоянием',       animDelay: 0.00 },
  { name: 'TypeScript',   icon: `${DEVICON_BASE}/typescript/typescript-original.svg`,   tip: 'Строгая типизация JavaScript',                animDelay: 0.05 },
  { name: 'Vite',         icon: `${DEVICON_BASE}/vitejs/vitejs-original.svg`,            tip: 'Мгновенная сборка и hot-reload',              animDelay: 0.10 },
  { name: 'Tailwind CSS', icon: `${DEVICON_BASE}/tailwindcss/tailwindcss-original.svg`, tip: 'Утилитарный CSS без написания стилей вручную',animDelay: 0.15 },
  { name: 'HTML5',        icon: `${DEVICON_BASE}/html5/html5-original.svg`,              tip: 'Семантическая разметка и доступность',        animDelay: 0.20 },
  { name: 'CSS3',         icon: `${DEVICON_BASE}/css3/css3-original.svg`,                tip: 'Анимации, сетки и адаптивный дизайн',         animDelay: 0.25 },
  { name: 'Next.js',      icon: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,           tip: 'SSR, SSG и роутинг на основе файлов',         animDelay: 0.30 },
  { name: 'Redux',        icon: `${DEVICON_BASE}/redux/redux-original.svg`,             tip: 'Глобальное состояние для сложных приложений', animDelay: 0.35 },
  { name: 'Jest',         icon: `${DEVICON_BASE}/jest/jest-plain.svg`,                  tip: 'Unit и интеграционное тестирование',          animDelay: 0.40 },
  { name: 'Figma',        icon: `${DEVICON_BASE}/figma/figma-original.svg`,             tip: 'Прототипирование и работа с макетами',        animDelay: 0.45 },
]

const BACKEND: Tech[] = [
  { name: 'Python',       icon: `${DEVICON_BASE}/python/python-original.svg`,           tip: 'Основной язык бэкенда и автоматизации',       animDelay: 0.05 },
  { name: 'FastAPI',      icon: `${DEVICON_BASE}/fastapi/fastapi-original.svg`,         tip: 'Быстрый async REST API с автодокументацией',  animDelay: 0.10 },
  { name: 'PostgreSQL',   icon: `${DEVICON_BASE}/postgresql/postgresql-original.svg`,   tip: 'Реляционная БД для надёжного хранения данных',animDelay: 0.15 },
  { name: 'Docker',       icon: `${DEVICON_BASE}/docker/docker-original.svg`,           tip: 'Контейнеризация и воспроизводимое окружение', animDelay: 0.20 },
  { name: 'Git',          icon: `${DEVICON_BASE}/git/git-original.svg`,                 tip: 'Контроль версий и совместная разработка',     animDelay: 0.25 },
  { name: 'Linux',        icon: `${DEVICON_BASE}/linux/linux-original.svg`,             tip: 'Сервера, CLI и администрирование',            animDelay: 0.30 },
  { name: 'Redis',        icon: `${DEVICON_BASE}/redis/redis-original.svg`,             tip: 'Кеширование и очереди задач в памяти',        animDelay: 0.35 },
  { name: 'SQLAlchemy',   icon: `${DEVICON_BASE}/sqlalchemy/sqlalchemy-original.svg`,   tip: 'ORM для работы с БД через Python-объекты',    animDelay: 0.40 },
  { name: 'Nginx',        icon: `${DEVICON_BASE}/nginx/nginx-original.svg`,             tip: 'Reverse proxy, балансировка и раздача статики',animDelay: 0.45 },
  { name: 'Kubernetes',   icon: `${DEVICON_BASE}/kubernetes/kubernetes-original.svg`,   tip: 'Оркестрация контейнеров в продакшене',        animDelay: 0.50 },
]

function TechCard({ tech, inView }: { tech: Tech; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '16px 12px',
        borderRadius: 8,
        border: `1px solid ${hovered ? '#1c1917' : '#e7e3d8'}`,
        background: '#ffffff',
        transition: 'border-color 0.15s, transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(28,25,23,0.08)' : '0 0 0 rgba(0,0,0,0)',
        opacity: 0,
        animation: inView ? `fadeUp 0.45s ease ${tech.animDelay ?? 0}s forwards` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={tech.icon} alt={tech.name} width={32} height={32} loading="lazy" />
      <span style={{ fontSize: 12, color: '#78716c', textAlign: 'center', lineHeight: 1.3, fontWeight: 500 }}>
        {tech.name}
      </span>

      {/* Overlay tooltip — desktop only */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            background: 'rgba(120, 113, 108, 0.93)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 10px',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.18s',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 11, color: '#ffffff', textAlign: 'center', lineHeight: 1.45, fontWeight: 500 }}>
            {tech.tip}
          </span>
        </div>
      )}
    </div>
  )
}

function TechGroup({ title, techs, inView }: { title: string; techs: Tech[]; inView: boolean }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: 'var(--heading)',
          fontSize: 18,
          fontWeight: 600,
          color: '#1c1917',
          marginBottom: 20,
          paddingBottom: 12,
          borderBottom: '1px solid #e7e3d8',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 8 }}>
        {techs.map((tech) => <TechCard key={tech.name} tech={tech} inView={inView} />)}
      </div>
    </div>
  )
}

export default function Stack() {
  const isMobile = useIsMobile()
  const { ref, inView } = useInView()

  return (
    <section id="stack" style={{ background: '#ffffff' }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '64px 16px' : '96px 24px' }}>
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
          Технологии
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
          Стек
        </h2>
        <p style={{ color: '#78716c', marginBottom: 56, fontSize: 16 }}>
          Инструменты, с которыми работаю ежедневно
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: isMobile ? 32 : 48 }}>
          <TechGroup title="Frontend" techs={FRONTEND} inView={inView} />
          <TechGroup title="Backend"  techs={BACKEND}  inView={inView} />
        </div>
      </div>
    </section>
  )
}
