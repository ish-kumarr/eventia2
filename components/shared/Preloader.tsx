'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setTimeout(() => setLoading(false), 1000) // Delay to show 100% briefly
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          exit={{
            scale: 1.5,
            opacity: 0,
            transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
        >
          <motion.h1
            className="text-4xl font-bold mb-8 text-blue-300"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            Loading Experience
          </motion.h1>
          <div className="relative w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-400"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-300 opacity-50 blur-sm"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'linear',
              }}
            />
          </div>
          <motion.div
            className="mt-4 text-xl font-semibold text-blue-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.div>
          <motion.div
            className="absolute bottom-10 text-sm text-blue-200 opacity-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Prepare for an immersive journey...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}