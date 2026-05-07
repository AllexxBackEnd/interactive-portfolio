import { useState } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

interface NavbarProps {
  onQuizOpen: () => void
}

const NAV_LINKS = [
  { href: '/#about',      label: 'О себе'   },
  { href: '/#projects',   label: 'Проекты'  },
  { href: '/#calculator', label: 'Услуги'   },
  { href: '/#stack',      label: 'Стек'     },
  { href: '/#chat',       label: 'Контакты' },
]

export default function Navbar({ onQuizOpen }: NavbarProps) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid #e7e3d8',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
        }}
      >
        {/* Logo */}
        <a
          href="/#hero"
          style={{
            fontFamily: 'var(--heading)',
            fontWeight: 600,
            fontSize: 17,
            color: '#1c1917',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          Alexsey
        </a>

        {/* Desktop nav links */}
        {!isMobile && (
          <nav aria-label="Основная навигация" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 12px',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1c1917',
                  textDecoration: 'none',
                  borderRadius: 1440,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#f5f0e8' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Desktop CTA */}
        {!isMobile && (
          <button
            onClick={onQuizOpen}
            style={{
              flexShrink: 0,
              padding: '9px 20px',
              borderRadius: 1440,
              border: 'none',
              background: 'linear-gradient(rgb(249, 115, 22), rgb(251, 146, 60))',
              color: '#1c1917',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
          >
            Есть задача?
          </button>
        )}

        {/* Mobile: hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              flexShrink: 0,
            }}
          >
            <span style={{ display: 'block', width: 22, height: 2, background: '#1c1917', borderRadius: 2, transition: 'transform 0.2s, opacity 0.2s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#1c1917', borderRadius: 2, transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#1c1917', borderRadius: 2, transition: 'transform 0.2s, opacity 0.2s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div
          style={{
            overflow: 'hidden',
            maxHeight: menuOpen ? 400 : 0,
            transition: 'max-height 0.25s ease',
            borderTop: menuOpen ? '1px solid #e7e3d8' : 'none',
            background: '#ffffff',
          }}
        >
          <nav
            aria-label="Мобильная навигация"
            style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                style={{
                  padding: '12px 0',
                  fontSize: 16,
                  fontWeight: 500,
                  color: '#1c1917',
                  textDecoration: 'none',
                  borderBottom: '1px solid #f5f0e8',
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { closeMenu(); onQuizOpen() }}
              style={{
                marginTop: 12,
                padding: '13px',
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
              Есть задача?
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
