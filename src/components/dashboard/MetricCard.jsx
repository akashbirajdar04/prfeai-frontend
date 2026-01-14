import { Card, CardContent } from '../ui/Card';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const MetricCard = ({ title, value, change, trend = 'neutral', icon: Icon = Activity, description }) => {
    const isPositive = trend === 'up';
    const isNegative = trend === 'down';

    return (
        <Card className="hover:border-slate-700 transition-colors">
            <CardContent>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    {change && (
                        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-slate-400'
                            }`}>
                            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                            {change}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                    <div className="text-2xl font-bold text-slate-100">{value}</div>
                    {description && <p className="text-slate-500 text-xs mt-2">{description}</p>}
                </div>
            </CardContent>
        </Card>
    );
};

export default MetricCard;
