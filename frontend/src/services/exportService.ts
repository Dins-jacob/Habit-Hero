import { getApiBaseUrl } from '../utils/apiConfig'

const API_BASE_URL = getApiBaseUrl('export')

export interface ExportData {
  generated_at: string
  overall_stats: {
    total_habits: number
    total_checkins: number
    week_checkins: number
  }
  gamification: {
    total_xp: number
    level: number
    badges: Array<{
      id: string
      name: string
      description: string
      xp: number
    }>
  }
  habits: Array<{
    id: number
    name: string
    category: string
    frequency: string
    start_date: string
    streak: number
    success_rate: number
    recent_checkins: number
  }>
}

class ExportService {
  async getReportData(): Promise<ExportData> {
    const response = await fetch(`${API_BASE_URL}/pdf`)
    if (!response.ok) {
      throw new Error('Failed to fetch report data')
    }
    return response.json()
  }

  async exportToPDF(): Promise<void> {
    try {
      const data = await this.getReportData()
      
      // Dynamic import of jsPDF
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      // Title
      doc.setFontSize(20)
      doc.setTextColor(5, 150, 105)
      doc.text('Habit Hero - Progress Report', 20, 20)

      // Generated date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      const generatedDate = new Date(data.generated_at).toLocaleDateString()
      doc.text(`Generated: ${generatedDate}`, 20, 30)

      let yPos = 45

      // Overall Stats
      doc.setFontSize(16)
      doc.setTextColor(5, 150, 105)
      doc.text('Overall Statistics', 20, yPos)
      yPos += 10

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`Total Habits: ${data.overall_stats.total_habits}`, 20, yPos)
      yPos += 7
      doc.text(`Total Check-ins: ${data.overall_stats.total_checkins}`, 20, yPos)
      yPos += 7
      doc.text(`This Week: ${data.overall_stats.week_checkins}`, 20, yPos)
      yPos += 15

      // Gamification
      doc.setFontSize(16)
      doc.setTextColor(5, 150, 105)
      doc.text('Gamification', 20, yPos)
      yPos += 10

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`Level: ${data.gamification.level}`, 20, yPos)
      yPos += 7
      doc.text(`Total XP: ${data.gamification.total_xp}`, 20, yPos)
      yPos += 7
      doc.text(`Badges Earned: ${data.gamification.badges.length}`, 20, yPos)
      yPos += 15

      // Habits
      doc.setFontSize(16)
      doc.setTextColor(5, 150, 105)
      doc.text('Habits Summary', 20, yPos)
      yPos += 10

      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
      
      for (const habit of data.habits) {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFontSize(12)
        doc.setTextColor(5, 150, 105)
        doc.text(habit.name, 20, yPos)
        yPos += 7
        
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)
        doc.text(`Category: ${habit.category.replace('_', ' ')} | Frequency: ${habit.frequency}`, 20, yPos)
        yPos += 6
        doc.text(`Streak: ${habit.streak} days | Success Rate: ${habit.success_rate.toFixed(1)}%`, 20, yPos)
        yPos += 10
      }

      // Save PDF
      doc.save(`habit-hero-report-${generatedDate.replace(/\//g, '-')}.pdf`)
    } catch (err) {
      if (err instanceof Error && err.message.includes('jspdf')) {
        throw new Error('PDF library not installed. Please run: npm install jspdf')
      }
      throw err
    }
  }
}

export const exportService = new ExportService()

