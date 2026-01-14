import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Calendar, Globe, ArrowRight, Search } from 'lucide-react';

const History = () => {
    const [sessions, setSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Mock data fetching
        const mockHistory = [
            { id: 1, url: 'https://google.com', date: '2023-10-25', status: 'completed', score: 90 },
            { id: 2, url: 'https://example.com', date: '2023-10-24', status: 'completed', score: 78 },
            { id: 3, url: 'https://test-site.io', date: '2023-10-23', status: 'failed', score: 0 },
            { id: 4, url: 'https://myshop.com', date: '2023-10-22', status: 'completed', score: 45 },
            { id: 5, url: 'https://blog.dev', date: '2023-10-21', status: 'completed', score: 98 },
        ];
        setSessions(mockHistory);
    }, []);

    const filteredSessions = sessions.filter(session =>
        session.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        Analysis History
                    </h1>
                    <p className="text-slate-400 mt-1">
                        View details from your past performance audits.
                    </p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search URL..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/50 text-slate-200 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">URL</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Score</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredSessions.map((session) => (
                                <tr key={session.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-slate-500" />
                                        {session.url}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            {session.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={session.status === 'completed' ? 'success' : 'danger'}>
                                            {session.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {session.score > 0 ? (
                                            <span className={`font-bold ${session.score >= 90 ? 'text-green-400' :
                                                    session.score >= 50 ? 'text-amber-400' : 'text-red-400'
                                                }`}>
                                                {session.score}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button size="sm" variant="ghost" onClick={() => navigate(`/analysis/${session.id}`)}>
                                            Details <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSessions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No history found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default History;
