import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface HourlyData {
  hour: string;
  footfall: number;
  completed: number;
  buffered: number;
}

interface ServiceDistribution {
  name: string;
  value: number;
}

interface AnalyticsChartProps {
  type: "hourly" | "distribution" | "buffer";
  data: HourlyData[] | ServiceDistribution[];
  title: string;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--stable))", "hsl(var(--buffered))", "hsl(var(--surge))"];

export const AnalyticsChart = ({ type, data, title }: AnalyticsChartProps) => {
  const renderChart = () => {
    switch (type) {
      case "hourly":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data as HourlyData[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="footfall"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="hsl(var(--stable))"
                fill="hsl(var(--stable) / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "distribution":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data as ServiceDistribution[]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {(data as ServiceDistribution[]).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case "buffer":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data as HourlyData[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="hour" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="buffered" fill="hsl(var(--buffered))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="font-medium text-foreground mb-4">{title}</h3>
      {renderChart()}
    </div>
  );
};

export default AnalyticsChart;
