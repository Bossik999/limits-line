import type { Register, SessionRateLimit } from 'claude-code'

// Pins a short line under the prompt: Лимит / Недельный, a bar and a percentage.
// The line is plain text, so the color comes from the dot in front of each bar.

const LABELS: Record<string, string> = { five_hour: 'Лимит', seven_day: 'Неделя' }
const WIDTH = 8

// green: half or more left, orange: less than half, red: 20% or less
function dot(left: number): string {
  if (left <= 20) return '🔴'
  if (left < 50) return '🟠'
  return '🟢'
}

function line(rateLimits: SessionRateLimit[], now: number): string | undefined {
  const parts: string[] = []
  for (const r of rateLimits) {
    const label = LABELS[r.kind]
    if (!label) continue
    // a saved window that has already reset is back to full
    const isOver = r.resetsAt !== undefined && Date.parse(r.resetsAt) <= now
    const used = isOver ? 0 : r.percentUsed
    // the bar fills as the limit is spent: 0% fresh, 100% used up
    const spent = Math.max(0, Math.min(100, Math.round(used)))
    const filled = Math.round((spent / 100) * WIDTH)
    parts.push(`${label} ${dot(100 - spent)}${'▰'.repeat(filled)}${'▱'.repeat(WIDTH - filled)} ${spent}%`)
  }
  return parts.length ? parts.join('   ') : undefined
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const u = await $.session.usage()
    // before the first response there is no reading yet: show the last saved one
    let limits = u.rateLimits
    if (limits.length === 0) {
      const saved = await $.store.get('lastLimits')
      if (Array.isArray(saved)) limits = saved as SessionRateLimit[]
    }
    $.ui.status(line(limits, await $.clock.now()))
    return result
  })

  on('session.measure', async ($, e, next) => {
    if (e.rateLimits.length > 0) await $.store.set('lastLimits', e.rateLimits)
    $.ui.status(line(e.rateLimits, await $.clock.now()))
    return next(e)
  })
}
