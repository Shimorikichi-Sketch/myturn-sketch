import { TrendingUp, AlertTriangle, Clock, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface PredictionData {
  hour: string;
  predicted: number;
  capacity: number;
  confidence: number;
}

interface DemandPredictionProps {
  predictions: PredictionData[];
  surgeThreshold: number;
}

export const DemandPrediction = ({ predictions, surgeThreshold }: DemandPredictionProps) => {
  const upcomingSurges = predictions.filter(p => p.predicted > surgeThreshold);
  const peakHour = predictions.reduce((max, p) => p.predicted > max.predicted ? p : max, predictions[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Demand Forecast</h2>
      </div>

      {/* Alert Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {upcomingSurges.length > 0 && (
          <div className="p-4 rounded-xl border border-buffered/50 bg-buffered/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-buffered flex-shrink-0" />
              <div>
                <h3 className="font-medium text-foreground mb-1">Surge Alert</h3>
                <p className="text-sm text-muted-foreground">
                  Expected high demand at {upcomingSurges.map(s => s.hour).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-medium text-foreground mb-1">Peak Hour</h3>
              <p className="text-sm text-muted-foreground">
                Highest demand expected at {peakHour?.hour} ({peakHour?.predicted} arrivals)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Chart */}
      <div className="bg-card rounded-xl border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Hourly Forecast</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              Predicted
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-surge" />
              Capacity
            </span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={predictions}>
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
              formatter={(value: number, name: string) => [
                value,
                name === "predicted" ? "Predicted Arrivals" : "Capacity"
              ]}
            />
            <ReferenceLine 
              y={surgeThreshold} 
              stroke="hsl(var(--buffered))" 
              strokeDasharray="5 5"
              label={{ value: "Surge threshold", fill: "hsl(var(--buffered))", fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.2)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="capacity"
              stroke="hsl(var(--surge))"
              fill="hsl(var(--surge) / 0.1)"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Indicator */}
      <div className="flex items-center justify-between text-sm bg-accent/30 rounded-xl p-4">
        <span className="text-muted-foreground">Forecast confidence</span>
        <span className="font-medium text-foreground">
          {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)}% 
          <span className="text-muted-foreground ml-1">(based on historical data)</span>
        </span>
      </div>
    </div>
  );
};

export default DemandPrediction;
