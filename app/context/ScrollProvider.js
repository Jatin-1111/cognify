'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import Lenis from '@studio-freight/lenis'

// Create context
const LenisContext = createContext({
    lenis: null,
})

export const useLenis = () => useContext(LenisContext)

export function LenisProvider({ children }) {
    const [lenis, setLenis] = useState(null)

    useEffect(() => {
        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        })

        // Set up RAF loop for Lenis
        function raf(time) {
            lenisInstance.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
        setLenis(lenisInstance)

        return () => {
            lenisInstance.destroy()
        }
    }, [])

    return (
        <LenisContext.Provider value={{ lenis }}>
            {children}
        </LenisContext.Provider>
    )
}