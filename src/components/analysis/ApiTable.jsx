import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

const ApiTable = ({ data = [] }) => {
    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <CardTitle>Backend API Latency</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Endpoint</th>
                            <th className="px-6 py-4">Method</th>
                            <th className="px-6 py-4">Avg Latency</th>
                            <th className="px-6 py-4">P95</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.map((row, index) => (
                            <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">{row.endpoint}</td>
                                <td className="px-6 py-4">
                                    <Badge variant="outline" className="text-xs">{row.method}</Badge>
                                </td>
                                <td className="px-6 py-4">{row.avgLatency}ms</td>
                                <td className="px-6 py-4">{row.p95}ms</td>
                                <td className="px-6 py-4">
                                    <Badge variant={row.isSlow ? 'danger' : 'success'}>
                                        {row.isSlow ? 'Slow' : 'Optimal'}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No API telemetry data found for this session.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ApiTable;
