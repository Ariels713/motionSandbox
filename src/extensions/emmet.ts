import { Annotation, type Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import {
  abbreviationTracker,
  expandAbbreviation,
  emmetConfig,
  EmmetKnownSyntax,
} from '@emmetio/codemirror6-plugin'

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function transformClassNames(text: string): string {
  return text.replace(/className="([^"]*)"/g, (_, classes: string) => {
    const parts = classes.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'className=""'
    if (parts.length === 1) return `className={styles.${toCamelCase(parts[0])}}`
    const joined = parts.map((c) => `\${styles.${toCamelCase(c)}}`).join(' ')
    return `className={\`${joined}\`}`
  })
}

const cssModuleTransform = Annotation.define<true>()

const cssModuleListener = EditorView.updateListener.of((update) => {
  if (!update.docChanged) return
  if (update.transactions.some((tr) => tr.annotation(cssModuleTransform))) return

  const specs: { from: number; to: number; insert: string }[] = []

  update.changes.iterChanges((_, _2, fromB, toB, inserted) => {
    const text = inserted.toString()
    if (!text.includes('className="')) return
    const transformed = transformClassNames(text)
    if (transformed !== text) specs.push({ from: fromB, to: toB, insert: transformed })
  })

  if (specs.length === 0) return

  update.view.dispatch({
    changes: specs,
    annotations: cssModuleTransform.of(true),
  })
})

export const emmetExtension: Extension[] = [
  emmetConfig.of({ syntax: EmmetKnownSyntax.jsx }),
  abbreviationTracker(),
  keymap.of([{ key: 'Tab', run: expandAbbreviation }]),
  cssModuleListener,
]
