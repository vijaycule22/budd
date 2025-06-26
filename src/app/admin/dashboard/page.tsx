"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastActive: string;
    documentsProcessed: number;
}

interface Analytics {
    totalUsers: number;
    activeUsers: number;
    totalDocuments: number;
    documentsToday: number;
    averageProcessingTime: number;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [analytics, setAnalytics] = useState<Analytics>({
        totalUsers: 0,
        activeUsers: 0,
        totalDocuments: 0,
        documentsToday: 0,
        averageProcessingTime: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'settings'>('overview');

    // Check authentication and admin role
    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/auth/signin");
        } else if (session.user && 'role' in session.user && session.user.role !== "admin") {
            router.push("/dashboard");
        }
    }, [session, status, router]);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setUsers([
                {
                    id: "1",
                    name: "Admin User",
                    email: "admin@studybuddy.com",
                    role: "admin",
                    status: "active",
                    lastActive: "2024-01-15T10:30:00Z",
                    documentsProcessed: 25,
                },
                {
                    id: "2",
                    name: "Regular User",
                    email: "user@studybuddy.com",
                    role: "user",
                    status: "active",
                    lastActive: "2024-01-15T09:15:00Z",
                    documentsProcessed: 12,
                },
                {
                    id: "3",
                    name: "John Doe",
                    email: "john@example.com",
                    role: "user",
                    status: "inactive",
                    lastActive: "2024-01-10T14:20:00Z",
                    documentsProcessed: 8,
                },
            ]);

            setAnalytics({
                totalUsers: 3,
                activeUsers: 2,
                totalDocuments: 45,
                documentsToday: 5,
                averageProcessingTime: 2.3,
            });

            setIsLoading(false);
        }, 1000);
    }, []);

    const handleUserAction = (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
        setUsers(prevUsers =>
            prevUsers.map(user => {
                if (user.id === userId) {
                    if (action === 'delete') {
                        return null;
                    }
                    return {
                        ...user,
                        status: action === 'activate' ? 'active' : 'inactive'
                    };
                }
                return user;
            }).filter(Boolean) as User[]
        );
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session || (session.user && 'role' in session.user && session.user.role !== "admin")) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">A</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Admin Dashboard
                                </h1>
                                <p className="text-sm text-gray-500">Welcome back, {session.user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span>Administrator</span>
                            </div>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                User View
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="container mx-auto px-6 py-4">
                <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm">
                    {[
                        { id: 'overview', label: 'Overview', icon: '📊' },
                        { id: 'users', label: 'Users', icon: '👥' },
                        { id: 'analytics', label: 'Analytics', icon: '📈' },
                        { id: 'settings', label: 'Settings', icon: '⚙️' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                                            <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">👥</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Active Users</p>
                                            <p className="text-3xl font-bold text-green-600">{analytics.activeUsers}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">✅</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Documents Today</p>
                                            <p className="text-3xl font-bold text-purple-600">{analytics.documentsToday}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">📄</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Avg. Processing</p>
                                            <p className="text-3xl font-bold text-orange-600">{analytics.averageProcessingTime}s</p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">⚡</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm">📄</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">New document processed</p>
                                            <p className="text-xs text-gray-500">user@studybuddy.com processed a PDF document</p>
                                        </div>
                                        <span className="text-xs text-gray-400">2 min ago</span>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm">✅</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">User activated</p>
                                            <p className="text-xs text-gray-500">john@example.com account activated</p>
                                        </div>
                                        <span className="text-xs text-gray-400">15 min ago</span>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm">🎙️</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">Voice synthesis used</p>
                                            <p className="text-xs text-gray-500">ElevenLabs AI voice generated for user</p>
                                        </div>
                                        <span className="text-xs text-gray-400">1 hour ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Documents
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Active
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.documentsProcessed}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.lastActive).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {user.status === 'active' ? (
                                                            <button
                                                                onClick={() => handleUserAction(user.id, 'deactivate')}
                                                                className="text-orange-600 hover:text-orange-900"
                                                            >
                                                                Deactivate
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUserAction(user.id, 'activate')}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Activate
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleUserAction(user.id, 'delete')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Total Documents Processed</span>
                                            <span className="text-lg font-semibold text-gray-900">{analytics.totalDocuments}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Average Processing Time</span>
                                            <span className="text-lg font-semibold text-gray-900">{analytics.averageProcessingTime}s</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Success Rate</span>
                                            <span className="text-lg font-semibold text-green-600">98.5%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">API Status</span>
                                            <span className="text-green-600 text-sm font-medium">✅ Operational</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Database</span>
                                            <span className="text-green-600 text-sm font-medium">✅ Connected</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">ElevenLabs API</span>
                                            <span className="text-green-600 text-sm font-medium">✅ Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Maximum File Size (MB)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="10"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Processing Timeout (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue="30"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Enable User Registration</label>
                                            <p className="text-xs text-gray-500">Allow new users to sign up</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                                            <p className="text-xs text-gray-500">Temporarily disable the application</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
} 