
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const AreaChartComponent = ({ data, xKey, yKey, color }) => (
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id={`color${yKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
      <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
      <Tooltip 
        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', color: 'hsl(var(--foreground))', fontSize: '12px' }} 
        itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '12px', fontWeight: 500 }} 
        cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
      />
      <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color${yKey})`} />
    </AreaChart>
  </ResponsiveContainer>
);

export const BarChartComponent = ({ data, xKey, yKey, color }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
      <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
      <Tooltip 
        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} 
        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
      />
      <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const PieChartComponent = ({ data, colors }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={70}
        outerRadius={90}
        paddingAngle={3}
        dataKey="value"
        stroke="none"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip 
        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} 
        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
      />
    </PieChart>
  </ResponsiveContainer>
);
