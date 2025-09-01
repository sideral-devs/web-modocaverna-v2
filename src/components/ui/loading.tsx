"use client"

import { LoaderCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface DefaultLoadingProps {
  visible: boolean
}

export default function DefaultLoading({ visible }: DefaultLoadingProps) {
  const [shouldRender, setShouldRender] = useState(visible)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (visible) {
      setShouldRender(true)
    } else {
      timer = setTimeout(() => {
        setShouldRender(false)
      }, 1000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [visible])

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          key="loading"
          className="flex fixed inset-0 justify-center items-center z-50 bg-black/70 backdrop-blur min-w-full min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoaderCircle className="text-primary size-12 animate-spin" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
