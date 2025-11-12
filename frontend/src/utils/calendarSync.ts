/**
 * Google Calendar sync utility
 * Creates a Google Calendar event URL with pre-filled data
 */

export interface CalendarEvent {
  title: string
  description?: string
  startDate: Date
  endDate?: Date
  location?: string
}

export function createGoogleCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const start = formatDate(event.startDate)
  const end = event.endDate ? formatDate(event.endDate) : formatDate(new Date(event.startDate.getTime() + 60 * 60 * 1000)) // Default 1 hour

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description || '',
    location: event.location || '',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function syncHabitToCalendar(habitName: string, frequency: string, startDate: string): void {
  const start = new Date(startDate)
  const event: CalendarEvent = {
    title: `Habit Check-in: ${habitName}`,
    description: `Time to check in on your ${frequency} habit: ${habitName}`,
    startDate: start,
    location: 'Habit Hero App',
  }

  const url = createGoogleCalendarUrl(event)
  window.open(url, '_blank')
}

