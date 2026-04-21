import type { SandboxTemplate } from './types'

const reactAppCode = `// import { random, range } from 'lodash'
import styles from './styles.module.css'

export default function App() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Hello World</h1>
    </div>
  )
}
`

const reactStyles = `.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: sans-serif;
  background: #f9fafb;
}

.heading {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
`

const motionAppCode = `// import { random, range } from 'lodash'
import { motion } from 'motion/react'
import styles from './styles.module.css'

export default function App() {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.box}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      <p className={styles.label}>Motion is ready</p>
    </div>
  )
}
`

const motionStyles = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: sans-serif;
  background: #0f0f1a;
  gap: 24px;
}

.box {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 16px;
}

.label {
  font-size: 1rem;
  color: #a5b4fc;
  margin: 0;
  letter-spacing: 0.05em;
}
`

export const REACT_TEMPLATE: SandboxTemplate = {
  id: 'react',
  label: 'React',
  files: {
    '/App.js': reactAppCode,
    '/styles.module.css': reactStyles,
  },
  dependencies: {
    lodash: 'latest',
  },
}

export const MOTION_TEMPLATE: SandboxTemplate = {
  id: 'motion',
  label: 'Motion',
  files: {
    '/App.js': motionAppCode,
    '/styles.module.css': motionStyles,
  },
  dependencies: {
    motion: 'latest',
    lodash: 'latest',
  },
}

export const TEMPLATES: Record<string, SandboxTemplate> = {
  react: REACT_TEMPLATE,
  motion: MOTION_TEMPLATE,
}
