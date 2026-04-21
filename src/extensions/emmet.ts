import { type Extension } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import {
  abbreviationTracker,
  expandAbbreviation,
  emmetConfig,
  EmmetKnownSyntax,
} from '@emmetio/codemirror6-plugin'

export const emmetExtension: Extension[] = [
  emmetConfig.of({ syntax: EmmetKnownSyntax.jsx }),
  abbreviationTracker(),
  keymap.of([{ key: 'Tab', run: expandAbbreviation }]),
]
