import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  progress?: number; // 0-100
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  'data-testid'?: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  progress,
  trend,
  description,
  'data-testid': testId
}: MetricCardProps) {
  return (
    <div 
      className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 group overflow-hidden relative"
      data-testid={testId}
    >
      {/* Accent gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{value}</h3>
            {description && (
              <p className="text-xs text-slate-600 mt-2">{description}</p>
            )}
          </div>
          <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg ml-3 flex-shrink-0 group-hover:from-primary/15 group-hover:to-primary/10 transition-colors duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {progress !== undefined && (
          <div className="mt-6">
            <div className="relative w-28 h-28 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-slate-200"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeDasharray={`${(progress / 100) * 282.7} 282.7`}
                  className="text-primary transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {trend && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-600">
                    {Math.abs(trend.value)}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">
                    {Math.abs(trend.value)}%
                  </span>
                </>
              )}
              <span className="text-xs text-slate-600 ml-1">from last month</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
