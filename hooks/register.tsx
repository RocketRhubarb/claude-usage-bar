import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Reading } from '../types'

const reading = atom({ plugin: 'usage-bar', key: 'reading' } as const, null)

const cells = 10

const bar = (percent: number) => {
  const filled = Math.max(0, Math.min(cells, Math.round((percent / 100) * cells)))
  return '█'.repeat(filled) + '░'.repeat(cells - filled)
}

const color = (percent: number) =>
  percent >= 90 ? 'red' : percent >= 70 ? 'yellow' : 'green'

export const register: Register = on => {
  on('session.measure', async ($, e, next) => {
    const five = e.rateLimits.find(r => r.kind === 'five_hour')
    const week = e.rateLimits.find(r => r.kind === 'seven_day')
    const next_: Reading = {
      context: e.context.percent,
      session: five?.percentUsed,
      week: week?.percentUsed,
      sessionResets: five?.resetsAt,
      weekResets: week?.resetsAt
    }
    await update($, reading, () => next_)

    return next(e)
  })

  on('ui.render', { component: 'SessionMode' }, async ($, e, next) => {
    // Subscribe to measurements so the footer redraws, but read live figures.
    await read($, reading)
    const usage = await $.session.usage()
    const five = usage.rateLimits.find(l => l.kind === 'five_hour')
    const week = usage.rateLimits.find(l => l.kind === 'seven_day')

    const { Box, Text } = $.ui.resolve(e)
    const items: [string, number | undefined][] = [
      ['ctx', usage.context.percent],
      ['5h', five?.percentUsed],
      ['week', week?.percentUsed]
    ]

    return (
      <Box>
        {e.props.modes.map(mode => (
          <Text key={mode} dimColor>{mode}  ·  </Text>
        ))}
        {items.map(([label, value], i) => (
          <Text key={label} dimColor={value === undefined}>
            {i > 0 ? '  ·  ' : ''}
            {label}{' '}
            {value === undefined ? '–' : (
              <Text color={color(value)}>{bar(value)} {Math.round(value)}%</Text>
            )}
          </Text>
        ))}
      </Box>
    )
  })
}
