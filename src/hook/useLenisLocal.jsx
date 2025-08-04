// hooks/useLenisLocal.js
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

export default function useLenisLocal(selector = '.lenis-local') {
  const localLenis = useRef(null)

  useEffect(() => {
    const elements = document.querySelectorAll(selector)

    elements.forEach((el) => {
      // Init Lenis riêng
      const lenisInstance = new Lenis({
        wrapper: el,
        content: el.children[0],
        duration: 0.6,
        smooth: true,
        gestureOrientation: 'vertical',
        lerp: 0.1,
      })

      localLenis.current = lenisInstance

      const animate = (time) => {
        lenisInstance.raf(time)
        requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)

      // Pause Lenis toàn cục
      const pauseGlobal = () => window.__lenis?.stop()
      const resumeGlobal = () => window.__lenis?.start()

      el.addEventListener('mouseenter', pauseGlobal)
      el.addEventListener('mouseleave', resumeGlobal)

      el.setAttribute('data-lenis-prevent', 'true') // Ngăn Lenis toàn cục

      // Cleanup
      return () => {
        el.removeEventListener('mouseenter', pauseGlobal)
        el.removeEventListener('mouseleave', resumeGlobal)
        lenisInstance.destroy()
      }
    })
  }, [selector])
}
