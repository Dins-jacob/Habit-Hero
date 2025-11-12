import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import './Charts.css'

interface CheckinsOverTimeChartProps {
  data: Record<string, number>
  days?: number
}

export default function CheckinsOverTimeChart({ data, days = 30 }: CheckinsOverTimeChartProps) {
  // Convert the data object to an array and sort by date
  const chartData = Object.entries(data)
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date,
      count,
    }))
    .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
    .slice(-days) // Get last N days

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: '#cbd5e1' }}
            angle={-45}
            textAnchor="end"
            height={60}
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
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#059669"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCount)"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#059669', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

