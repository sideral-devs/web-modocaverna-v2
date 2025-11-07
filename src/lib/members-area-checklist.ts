import {
  CHALLENGE_CHECKLIST_ID,
  MEMBERS_AREA_CHECKLIST_KEY,
  WATCH_COURSE_CHECKLIST_ID,
} from '@/constants/storageKeys'

export type ChecklistProgress = Record<string, boolean>

export const MEMBERS_AREA_CHECKLIST_EVENT = 'members-area-checklist-updated'

export const CHECKLIST_IDS = {
  watchCourse: WATCH_COURSE_CHECKLIST_ID,
  challenge: CHALLENGE_CHECKLIST_ID,
  indicate: 'indicate',
} as const

const emptyProgress: ChecklistProgress = {}

export function readMembersChecklist(): ChecklistProgress {
  if (typeof window === 'undefined') return emptyProgress

  const stored = window.localStorage.getItem(MEMBERS_AREA_CHECKLIST_KEY)
  if (!stored) return {}

  try {
    return JSON.parse(stored) as ChecklistProgress
  } catch (error) {
    window.localStorage.removeItem(MEMBERS_AREA_CHECKLIST_KEY)
    return {}
  }
}

export function writeMembersChecklist(progress: ChecklistProgress) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    MEMBERS_AREA_CHECKLIST_KEY,
    JSON.stringify(progress),
  )

  window.dispatchEvent(new Event(MEMBERS_AREA_CHECKLIST_EVENT))
}

export function markChecklistItem(
  id: string,
  value = true,
): ChecklistProgress | null {
  if (typeof window === 'undefined') return null

  const current = readMembersChecklist()
  if (current[id] === value) {
    return current
  }

  const updated = { ...current, [id]: value }
  writeMembersChecklist(updated)
  return updated
}
