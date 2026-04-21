'use client'

import {
  RotateCcw,
  Hash,
  WandSparkles,
  ExternalLink,
  Maximize,
  Minimize,
  Terminal,
} from 'lucide-react'
import { UnstyledOpenInCodeSandboxButton } from '@codesandbox/sandpack-react'
import type { PreviewToolbarProps } from '@/lib/types'
import styles from './PreviewToolbar.module.css'

export function PreviewToolbar({
  onReset,
  showLineNumbers,
  onToggleLineNumbers,
  onFormat,
  isFormatting,
  showConsole,
  onToggleConsole,
  isFullscreen,
  onToggleFullscreen,
}: PreviewToolbarProps) {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Preview controls">
      <button
        className={styles.iconButton}
        onClick={onReset}
        aria-label="Reset code to default"
        title="Reset code"
      >
        <RotateCcw size={15} />
      </button>

      <button
        className={`${styles.iconButton} ${showLineNumbers ? styles.iconButtonActive : ''}`}
        onClick={onToggleLineNumbers}
        aria-label="Toggle line numbers"
        aria-pressed={showLineNumbers}
        title="Toggle line numbers"
      >
        <Hash size={15} />
      </button>

      <button
        className={styles.iconButton}
        onClick={onFormat}
        disabled={isFormatting}
        aria-label="Format code with Prettier"
        aria-busy={isFormatting}
        title="Format code"
      >
        <WandSparkles size={15} />
      </button>

      <button
        className={`${styles.iconButton} ${showConsole ? styles.iconButtonActive : ''}`}
        onClick={onToggleConsole}
        aria-label="Toggle console"
        aria-pressed={showConsole}
        title="Toggle console"
      >
        <Terminal size={15} />
      </button>

      <div className={styles.divider} />

      <UnstyledOpenInCodeSandboxButton className={styles.iconButton} title="Open in CodeSandbox">
        <ExternalLink size={15} aria-label="Open in CodeSandbox" />
      </UnstyledOpenInCodeSandboxButton>

      <button
        className={`${styles.iconButton} ${isFullscreen ? styles.iconButtonActive : ''}`}
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        aria-pressed={isFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
      </button>
    </div>
  )
}
