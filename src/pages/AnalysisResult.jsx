import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import MetricCard from '../components/dashboard/MetricCard';
import ApiTable from '../components/analysis/ApiTable';
import RecommendationCard from '../components/analysis/RecommendationCard';
import { Button } from '../components/ui/Button';
import { Zap, Globe, Database, Brain, Download, Share2, Activity, Server } from 'lucide-react';
import analysisService from '../services/analysisService';

const AnalysisResult = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('performance');
    const [data, setData] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0); // 0: Start, 1: Lighthouse Done

    // Mock Data
    const mockData = {
        url: 'https://example.com',
        date: 'Oct 26, 2023',
        performance: {
            lcp: null,
            cls: null,
            inp: null,
            ttfb: null,
            fcp: null,
            si: null,
            tbt: null,
            score: null
        },
        seo: {
            score: 88,
            issues: [
                { title: 'Missing Meta Description', severity: 'medium', description: 'The page lacks a meta description tag.' },
                { title: 'Images missing Alt text', severity: 'low', description: '3 images have no alt attribute.' }
            ]
        },
        api: [
            { endpoint: '/api/v1/users', method: 'GET', avgLatency: 45, p95: 120, isSlow: false },
            { endpoint: '/api/v1/products', method: 'GET', avgLatency: 850, p95: 1200, isSlow: true },
            { endpoint: '/api/v1/cart', method: 'POST', avgLatency: 120, p95: 300, isSlow: false },
        ],
        ai: [
            { title: 'Optimize Product API', category: 'Backend', severity: 'high', description: 'The /products endpoint is significantly slower than average (850ms).', suggestedFix: 'Add pagination (limit=20) and index the "category" column in the database.' },
            { title: 'Lazy Load Hero Image', category: 'Frontend', severity: 'medium', description: 'LCP is slightly impacted by the hero image.', suggestedFix: 'Add fetchpriority="high" to the hero image and verify cache headers.' }
        ]
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await analysisService.getSessionDetails(id);

                // Always update data to show URL and basic info even if running
                const currentData = response.data;
                const backendMetrics = currentData.metrics || {};
                const mergedData = {
                    ...mockData,
                    ...currentData,
                    ...currentData.artifacts,
                    performance: { ...mockData.performance, ...backendMetrics.performance },
                    seo: { ...mockData.seo, ...backendMetrics.seo }
                };

                setData(mergedData);

                if (currentData.status === 'completed' || currentData.status === 'waiting_for_telemetry') {
                    setLoadingStage(1); // Lighthouse Done
                } else if (currentData.status === 'failed') {
                    setError('Analysis failed.');
                } else {
                    // Still running initial LH, poll again
                    setTimeout(fetchData, 3000);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load analysis.');
            }
        };

        fetchData();
    }, [id]);

    const handleGenerateAI = async () => {
        try {
            await analysisService.generateAI(id);
            // Reload page or force refresh status
            window.location.reload();
        } catch (e) {
            alert("Failed to start AI generation");
        }
    };

    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    // Loading / Summary View
    if (!showDashboard) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Ambient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-4xl w-full space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            {loadingStage === 1 ? 'Lighthouse Audit Complete' : 'Analyzing Your Page'}
                        </h1>
                        <p className="text-slate-400 text-lg">
                            {data?.targetUrl || 'Submitting URL...'}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                        {/* Circular Loader */}
                        <div className="relative">
                            <div className={`w-48 h-48 rounded-full border-4 flex items-center justify-center relative ${loadingStage === 1 ? 'border-green-500/20' : 'border-indigo-500/20'}`}>
                                {loadingStage === 0 && (
                                    <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full animate-spin" />
                                )}
                                {loadingStage === 1 && (
                                    <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20" />
                                )}

                                <div className="text-center">
                                    <h3 className={`text-4xl font-bold ${loadingStage === 1 ? 'text-green-400' : 'text-indigo-400'}`}>
                                        {loadingStage === 1 ? data?.performance?.score || 92 : '...'}
                                    </h3>
                                    <p className="text-xs uppercase tracking-wider text-slate-500 mt-1">
                                        Performance<br />Score
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                            {/* Core Web Vitals */}
                            <MetricPlaceholder label="LCP" value={data?.performance?.lcp} loading={loadingStage === 0} delay={0} />
                            <MetricPlaceholder label="CLS" value={data?.performance?.cls} loading={loadingStage === 0} delay={100} />
                            <MetricPlaceholder label="INP" value={data?.performance?.inp} loading={loadingStage === 0} delay={200} />
                            <MetricPlaceholder label="TTFB" value={data?.performance?.ttfb} loading={loadingStage === 0} delay={300} />

                            {/* Other Metrics */}
                            <MetricPlaceholder label="FCP" value={data?.performance?.fcp || '---'} loading={loadingStage === 0} delay={400} />
                            <MetricPlaceholder label="SI" value={data?.performance?.si || '---'} loading={loadingStage === 0} delay={500} />
                            <MetricPlaceholder label="TBT" value={data?.performance?.tbt || '---'} loading={loadingStage === 0} delay={600} />
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-center h-16">
                        {loadingStage === 1 ? (
                            <Button
                                onClick={() => setShowDashboard(true)}
                                size="lg"
                                className="animate-fade-in-up px-12 h-14 text-lg rounded-full shadow-xl shadow-indigo-500/20 hover:scale-105 transition-transform"
                            >
                                View Full Report <Activity className="ml-2 w-5 h-5" />
                            </Button>
                        ) : (
                            <div className="flex items-center gap-3 text-slate-500 animate-pulse">
                                <Activity className="w-5 h-5 animate-bounce" />
                                <span>Gathering Telemetry...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const isWaitingForTelemetry = data.status === 'waiting_for_telemetry';

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Analysis Report
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {data.targetUrl || data.url} • <span className="text-slate-500">{new Date(data.createdAt || data.date).toLocaleDateString()}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Share2 className="w-4 h-4" /> Share
                    </Button>
                    <Button variant="primary" className="gap-2">
                        <Download className="w-4 h-4" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* SDK Installation Banner - Only if waiting for telemetry */}
            {isWaitingForTelemetry && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 border-l-4 border-l-indigo-500">
                    <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        Complete Your Analysis
                    </h2>
                    <p className="text-slate-400 mb-4">
                        Lighthouse analysis is complete! To get <strong className="text-indigo-300">Backend Latency</strong> and <strong className="text-purple-300">AI Insights</strong>, please install our SDK.
                    </p>

                    <div className="bg-slate-950 p-4 rounded-lg font-mono text-sm border border-slate-800 overflow-x-auto mb-4">
                        <div className="flex justify-between text-slate-500 mb-2">
                            <span>// 1. Install SDK</span>
                            <span>// 2. Add to your app</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-indigo-300">npm install ai-perf-sdk</p>
                            <p className="text-slate-300 border-t border-slate-800 pt-2 mt-2">
                                <span className="text-purple-400">const</span> {'{'} initPerformanceSDK {'}'} = <span className="text-purple-400">require</span>(<span className="text-green-400">'ai-perf-sdk'</span>);<br />
                                initPerformanceSDK({'{'} collectorEndpoint: <span className="text-green-400">'{import.meta.env.VITE_API_URL?.replace('/api', '/api/telemetry') || 'http://localhost:5000/api/telemetry'}'</span>, headers: {'{'} <span className="text-green-400">'x-session-id'</span>: <span className="text-green-400">'{id}'</span> {'}'} {'}'});
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleGenerateAI} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            <Brain className="w-4 h-4 mr-2" />
                            ByPass & Generate AI (Demo)
                        </Button>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
                {['performance', 'seo', 'backend', 'ai'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium text-sm transition-all relative ${activeTab === tab
                            ? 'text-indigo-400'
                            : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        <span className="capitalize">{tab === 'ai' ? 'AI Insights' : tab}</span>
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="animate-fade-in">
                {activeTab === 'performance' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MetricCard title="Performance Score" value={data.performance.score} trend="neutral" icon={Zap} />
                            <MetricCard title="LCP" value={data.performance.lcp} trend={parseFloat(data.performance.lcp) > 2.5 ? 'down' : 'up'} icon={Activity} />
                            <MetricCard title="CLS" value={data.performance.cls} trend={parseFloat(data.performance.cls) > 0.1 ? 'down' : 'up'} icon={Activity} />
                            <MetricCard title="TTFB" value={data.performance.ttfb} description="Time to First Byte" icon={Server} />
                        </div>
                        <Card>
                            <CardHeader><CardTitle>Core Web Vitals</CardTitle></CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                                    Chart Placeholder (Integrate Recharts/Chart.js here)
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MetricCard title="SEO Score" value={data.seo.score} icon={Globe} trend="up" />
                            <Card className="h-full">
                                <CardHeader><CardTitle>Issues Found</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {data.seo.issues.map((issue, idx) => (
                                        <RecommendationCard
                                            key={idx}
                                            title={issue.title}
                                            description={issue.description}
                                            severity={issue.severity}
                                            category="SEO"
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'backend' && (
                    <div className="space-y-6">
                        <ApiTable data={data.api} />
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full">
                            <div className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/20">
                                <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
                                    <Brain className="w-6 h-6 text-purple-400" />
                                    AI Executive Summary
                                </h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Based on the analysis, your application performs well on the frontend but suffers from significant backend latency in the product catalog service.
                                    Optimizing the <span className="font-mono text-indigo-300 bg-indigo-900/30 px-1 rounded">/products</span> endpoint could improve overall conversion rates by estimated 15%.
                                </p>
                            </div>
                        </div>
                        {data.ai.map((insight, idx) => (
                            <RecommendationCard
                                key={idx}
                                {...insight}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const MetricPlaceholder = ({ label, value, loading, delay }) => (
    <div
        className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center min-w-[100px] transition-all duration-500"
        style={{ animationDelay: `${delay}ms` }}
    >
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</span>
        {loading ? (
            <div className="h-6 w-16 bg-slate-800 rounded animate-pulse" />
        ) : (
            <span className="text-xl font-mono font-bold text-slate-200 animate-fade-in">{value || '--'}</span>
        )}
    </div>
);

export default AnalysisResult;
