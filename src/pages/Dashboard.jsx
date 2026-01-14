import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/dashboard/MetricCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Globe, Database, Search, ArrowRight, Zap } from 'lucide-react';
import analysisService from '../services/analysisService';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentSessions, setRecentSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch for better performance
                // MOCK DATA FOR NOW if backend fails
                // const [statsRes, historyRes] = await Promise.all([
                //   analysisService.getDashboardStats(),
                //   analysisService.getRecentSessions()
                // ]);
                // setStats(statsRes.data);
                // setRecentSessions(historyRes.data);

                // Simulating API response for development since backend might be incomplete
                await new Promise(r => setTimeout(r, 800));
                setStats({
                    totalAnalyses: 12,
                    avgPerformance: 85,
                    avgSeo: 92,
                    avgLatency: '120ms'
                });
                setRecentSessions([
                    { id: 1, url: 'https://google.com', date: '2023-10-25', status: 'completed', score: 90 },
                    { id: 2, url: 'https://example.com', date: '2023-10-24', status: 'completed', score: 78 },
                    { id: 3, url: 'https://test-site.io', date: '2023-10-23', status: 'failed', score: 0 },
                ]);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 mb-1">Welcome back, {user?.name || 'Developer'}</h1>
                    <p className="text-slate-400">Here's what's happening with your projects.</p>
                </div>
                <Button onClick={() => navigate('/analysis/new')} className="gap-2">
                    <Zap className="w-4 h-4" />
                    New Analysis
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Analyses"
                    value={stats?.totalAnalyses || 0}
                    change="+2 this week"
                    trend="up"
                    icon={Search}
                />
                <MetricCard
                    title="Avg Performance"
                    value={stats?.avgPerformance || 0}
                    change="+5%"
                    trend="up"
                    icon={Activity}
                />
                <MetricCard
                    title="Avg SEO Score"
                    value={stats?.avgSeo || 0}
                    change="-2%"
                    trend="down"
                    icon={Globe}
                />
                <MetricCard
                    title="Avg API Latency"
                    value={stats?.avgLatency || '0ms'}
                    description="Global average across all endpoints"
                    icon={Database}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Activity</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-indigo-400">
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-800">
                            {recentSessions.map((session) => (
                                <div key={session.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${session.status === 'completed' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div>
                                            <p className="font-medium text-slate-200">{session.url}</p>
                                            <p className="text-xs text-slate-500">{session.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className="text-xs text-slate-500 uppercase tracking-wider block">Score</span>
                                            <span className={`font-bold ${session.score >= 90 ? 'text-green-400' : session.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                                                {session.score}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/analysis/${session.id}`)}>
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {recentSessions.length === 0 && (
                                <div className="p-8 text-center text-slate-500">
                                    No recent analyses found. Start one now!
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/20">
                    <CardHeader>
                        <CardTitle>Quick Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                <h4 className="font-medium text-indigo-300 text-sm mb-1">Optimize Images</h4>
                                <p className="text-xs text-slate-400">Use WebP format to reduce load times by up to 30%.</p>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                <h4 className="font-medium text-indigo-300 text-sm mb-1">Cache API Responses</h4>
                                <p className="text-xs text-slate-400">Implement Redis caching for static endpoints.</p>
                            </div>
                            <Button className="w-full mt-2" variant="outline">
                                Read Docs
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
