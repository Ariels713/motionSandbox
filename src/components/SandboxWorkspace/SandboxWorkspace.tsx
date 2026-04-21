'use client'

import { useState, useRef, useEffect } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from '@codesandbox/sandpack-react'
import { PreviewToolbar } from '@/components/PreviewToolbar/PreviewToolbar'
import { StorageSyncer } from '@/components/StorageSyncer/StorageSyncer'
import { useSandboxStorage } from '@/hooks/useSandboxStorage'
import { useFormatCode } from '@/hooks/useFormatCode'
import { useFullscreen } from '@/hooks/useFullscreen'
import { clearInstanceFiles } from '@/lib/storage'
import { claudeCompletionExtension } from '@/extensions/claudeCompletion'
import type { SandboxWorkspaceProps } from '@/lib/types'
import styles from './SandboxWorkspace.module.css'

const CONSOLE_HEIGHT = 200
const MIN_SPLIT = 20
const MAX_SPLIT = 80

interface WorkspaceContentProps {
  instanceId: string
}

function WorkspaceContent({ instanceId }: WorkspaceContentProps) {
  const { sandpack } = useSandpack()
  const { format, isFormatting } = useFormatCode()
  const containerRef = useRef<HTMLDivElement>(null)
  const splitRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(containerRef)

  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [showConsole, setShowConsole] = useState(false)
  const [split, setSplit] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey || !e.shiftKey) return
      if (e.key !== ']' && e.key !== '[') return
      e.preventDefault()
      const files = sandpack.visibleFiles
      const current = files.indexOf(sandpack.activeFile)
      if (current === -1) return
      const next = e.key === ']'
        ? (current + 1) % files.length
        : (current - 1 + files.length) % files.length
      sandpack.setActiveFile(files[next])
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sandpack])

  const handleReset = () => {
    sandpack.resetAllFiles()
    clearInstanceFiles(instanceId)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)

    const startX = e.clientX
    const startSplit = split
    const containerWidth = splitRef.current?.offsetWidth ?? 0

    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - startX
      const next = startSplit + (delta / containerWidth) * 100
      setSplit(Math.max(MIN_SPLIT, Math.min(MAX_SPLIT, next)))
    }

    const onUp = () => {
      setIsDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const layoutHeight = isFullscreen
    ? `calc(100vh - var(--toolbar-height) - ${showConsole ? CONSOLE_HEIGHT : 0}px)`
    : `calc(100vh - var(--tabs-height) - var(--instance-tabs-height) - var(--toolbar-height) - ${showConsole ? CONSOLE_HEIGHT : 0}px)`

  return (
    <div
      ref={containerRef}
      className={`${styles.inner} ${isFullscreen ? styles.fullscreen : ''}`}
      style={{ '--split': `${split}%` } as React.CSSProperties}
    >
      <div className={styles.headerBar}>
        <div className={styles.editorSpacer} />
        <div className={styles.previewHeader}>
          <PreviewToolbar
            onReset={handleReset}
            showLineNumbers={showLineNumbers}
            onToggleLineNumbers={() => setShowLineNumbers((prev) => !prev)}
            onFormat={format}
            isFormatting={isFormatting}
            showConsole={showConsole}
            onToggleConsole={() => setShowConsole((prev) => !prev)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>

      <div
        ref={splitRef}
        className={`${styles.splitContainer} ${isDragging ? styles.dragging : ''}`}
      >
        <SandpackLayout
          style={{
            '--sp-layout-height': layoutHeight,
            border: 'none',
            borderRadius: 0,
          } as React.CSSProperties}
        >
          <SandpackCodeEditor
            showLineNumbers={showLineNumbers}
            showTabs
            closableTabs={false}
            extensions={claudeCompletionExtension}
          />
          <SandpackPreview showNavigator={false} showRefreshButton={false} />
        </SandpackLayout>

        <div className={styles.dragHandle} onMouseDown={handleDragStart} />
      </div>

      {showConsole && (
        <div className={styles.consolePanel} style={{ height: CONSOLE_HEIGHT }}>
          <SandpackConsole style={{ height: '100%' }} />
        </div>
      )}
    </div>
  )
}

export function SandboxWorkspace({ template, instanceId }: SandboxWorkspaceProps) {
  const initialFiles = useSandboxStorage(template.id, instanceId)

  return (
    <div
      id={`workspace-${instanceId}`}
      role="tabpanel"
      className={styles.workspace}
    >
      <SandpackProvider
        template="react"
        files={initialFiles}
        customSetup={{ dependencies: template.dependencies }}
        theme="dark"
        options={{
          recompileMode: 'delayed',
          recompileDelay: 500,
          visibleFiles: ['/App.js', '/styles.module.css'],
          activeFile: '/App.js',
        }}
      >
        <StorageSyncer instanceId={instanceId} />
        <WorkspaceContent instanceId={instanceId} />
      </SandpackProvider>
    </div>
  )
}
