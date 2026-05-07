import { useState, useEffect } from 'react'

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useTyping(
  words: string[],
  typeSpeed = 75,
  deleteSpeed = 40,
  pauseMs = 2200,
): string {
  const [text, setText] = useState(reducedMotion() ? (words[0] ?? '') : '')

  useEffect(() => {
    if (reducedMotion()) {
      setText(words[0] ?? '')
      return
    }

    let wordIdx = 0
    let charIdx = 0
    let deleting = false
    let timerId: ReturnType<typeof setTimeout>

    const tick = () => {
      const word = words[wordIdx] ?? ''

      if (!deleting && charIdx < word.length) {
        charIdx++
        setText(word.slice(0, charIdx))
        timerId = setTimeout(tick, typeSpeed)
      } else if (!deleting && charIdx === word.length) {
        timerId = setTimeout(() => {
          deleting = true
          tick()
        }, pauseMs)
      } else if (deleting && charIdx > 0) {
        charIdx--
        setText(word.slice(0, charIdx))
        timerId = setTimeout(tick, deleteSpeed)
      } else {
        deleting = false
        wordIdx = (wordIdx + 1) % words.length
        timerId = setTimeout(tick, typeSpeed * 2)
      }
    }

    timerId = setTimeout(tick, 800)
    return () => clearTimeout(timerId)
  }, [words, typeSpeed, deleteSpeed, pauseMs])

  return text
}
