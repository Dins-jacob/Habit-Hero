import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import './Charts.css'

interface BestDaysChartProps {
  data: Record<string, number>
}

export default function BestDaysChart({ data }: BestDaysChartProps) {
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  const chartData = dayOrder.map((day) => ({
    day: day.substring(0, 3),
    fullDay: day,
    count: data[day] || 0,
  }))

  const colors = [
    '#059669',
    '#10b981',
    '#34d399',
    '#6ee7b7',
    '#a7f3d0',
    '#d1fae5',
    '#ecfdf5',
  ]

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid #059669',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#059669', fontWeight: 600 }}
            formatter={(value: number) => [value, 'Check-ins']}
            labelFormatter={(label) => `Day: ${label}`}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

