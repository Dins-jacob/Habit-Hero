import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import './Charts.css'

interface CategoryStat {
  total_logs: number
  habit_count: number
}

interface CategoryChartProps {
  data: Record<string, CategoryStat>
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const formatCategoryName = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const chartData = Object.entries(data).map(([category, stats]) => ({
    name: formatCategoryName(category),
    value: stats.total_logs,
    habits: stats.habit_count,
  }))

  const colors = [
    '#059669',
    '#10b981',
    '#34d399',
    '#6ee7b7',
    '#a7f3d0',
    '#d1fae5',
    '#ecfdf5',
    '#f0fdf4',
  ]

  const RADIAN = Math.PI / 180
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid #059669',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number, _name: string, props: any) => [
              `${value} check-ins (${props.payload.habits} habits)`,
              'Total',
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: '#64748b', fontWeight: 600 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

