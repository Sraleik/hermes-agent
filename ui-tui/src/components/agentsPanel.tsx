import { Box, Text } from '@hermes/ink'
import React from 'react'

import type { Theme } from '../theme.js'
import type { SubagentStatus } from '../types.js'

// ── Types internes pour le prototype ───────────────────────────────────

interface MockSubagent {
  id: string
  name: string
  model: string
  status: SubagentStatus
  durationSeconds: number
  toolCount: number
}

// ── Données fictives d'agents actifs pour le prototype ─────────────────

const MOCK_AGENTS: MockSubagent[] = [
  {
    id: 'sub-1',
    name: 'Researching Kokun Docker Optimization',
    model: 'gemini-3.5-flash',
    status: 'running',
    durationSeconds: 14,
    toolCount: 3
  },
  {
    id: 'sub-2',
    name: 'Analyzing Kalent Database Queries',
    model: 'gpt-4o-mini',
    status: 'completed',
    durationSeconds: 45,
    toolCount: 12
  },
  {
    id: 'sub-3',
    name: 'Refactoring Gmail Filter logic',
    model: 'failed',
    durationSeconds: 8,
    toolCount: 1
  },
  {
    id: 'sub-4',
    name: 'EmailSorter Systemd Service Health',
    model: 'claude-3-5-sonnet',
    status: 'queued',
    durationSeconds: 0,
    toolCount: 0
  }
]

// ── Formatage & Styles ────────────────────────────────────────────────

const STATUS_GLYPH: Record<SubagentStatus, { color: (t: Theme) => string; glyph: string; label: string }> = {
  running: { color: t => t.color.accent, glyph: '●', label: 'RUN' },
  queued: { color: t => t.color.muted, glyph: '○', label: 'QUE' },
  completed: { color: t => t.color.statusGood, glyph: '✓', label: 'OK ' },
  interrupted: { color: t => t.color.warn, glyph: '■', label: 'INT' },
  failed: { color: t => t.color.error, glyph: '✗', label: 'ERR' },
  timeout: { color: t => t.color.warn, glyph: '⌛', label: 'TO ' },
  error: { color: t => t.color.error, glyph: '⚠', label: 'ERR' }
}

const fmtDuration = (sec: number): string => {
  if (sec <= 0) return '-'
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

// ── Composant Principal ───────────────────────────────────────────────

export function AgentsPanel({ t }: { t: Theme }) {
  // Calcul dynamique des largeurs pour un rendu tabulaire soigné
  const colNameW = 40
  const colModelW = 20
  const colStatusW = 12
  const colTimeW = 10

  const truncate = (str: string, maxLen: number): string => {
    if (str.length <= maxLen) return str.padEnd(maxLen)
    return str.slice(0, maxLen - 3) + '...'
  }

  return (
    <Box flexDirection="column" paddingX={1} width={90}>
      {/* En-tête de boîte ASCII */}
      <Box flexDirection="row">
        <Text color={t.color.primary}>┌─┤ </Text>
        <Text bold color={t.color.primary}>
          HERMES SUB-AGENTS MONITOR
        </Text>
        <Text color={t.color.primary}>
          {'─'.repeat(Math.max(2, 90 - 29 - 6))}┐
        </Text>
      </Box>

      {/* Titres des colonnes */}
      <Box flexDirection="row" paddingX={1}>
        <Box width={colNameW}>
          <Text bold color={t.color.accent}>
            SUB-AGENT TASK
          </Text>
        </Box>
        <Box width={colModelW}>
          <Text bold color={t.color.accent}>
            MODEL
          </Text>
        </Box>
        <Box width={colStatusW}>
          <Text bold color={t.color.accent}>
            STATUS
          </Text>
        </Box>
        <Box width={colTimeW}>
          <Text bold color={t.color.accent}>
            TIME
          </Text>
        </Box>
      </Box>

      {/* Séparateur ASCII */}
      <Box flexDirection="row">
        <Text color={t.color.border}>
          ├{'─'.repeat(88)}┤
        </Text>
      </Box>

      {/* Liste des Agents */}
      {MOCK_AGENTS.map(agent => {
        const glyphInfo = STATUS_GLYPH[agent.status] || STATUS_GLYPH.error
        const statusColor = glyphInfo.color(t)

        return (
          <Box flexDirection="row" key={agent.id} paddingX={1}>
            {/* Colonne Nom */}
            <Box width={colNameW}>
              <Text color={t.color.text}>{truncate(agent.name, colNameW - 2)}</Text>
            </Box>

            {/* Colonne Modèle */}
            <Box width={colModelW}>
              <Text color={t.color.muted}>{truncate(agent.model, colModelW - 2)}</Text>
            </Box>

            {/* Colonne Statut */}
            <Box flexDirection="row" width={colStatusW}>
              <Text color={statusColor}>{glyphInfo.glyph} </Text>
              <Text color={statusColor}>{glyphInfo.label}</Text>
            </Box>

            {/* Colonne Temps */}
            <Box width={colTimeW}>
              <Text color={t.color.muted}>{fmtDuration(agent.durationSeconds)}</Text>
            </Box>
          </Box>
        )
      })}

      {/* Pied de boîte ASCII */}
      <Box flexDirection="row">
        <Text color={t.color.primary}>
          └{'─'.repeat(88)}┘
        </Text>
      </Box>
    </Box>
  )
}
