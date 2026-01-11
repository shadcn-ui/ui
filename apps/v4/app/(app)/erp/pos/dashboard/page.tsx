"use client";

import { useState, useEffect } from "react";
import { Card } from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Button } from "@/registry/new-york-v4/ui/button";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  today_sales: number;
  today_transactions: number;
  today_customers: number;
  avg_transaction_value: number;
  open_sessions: number;
  active_terminals: number;
}

export default function POSDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    today_sales: 0,
    today_transactions: 0,
    today_customers: 0,
    avg_transaction_value: 0,
    open_sessions: 0,
    active_terminals: 0,
  });
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load active sessions
      const sessionsResponse = await fetch("/api/pos/sessions?status=open");
      const sessionsData = await sessionsResponse.json();
      if (sessionsData.success) {
        setActiveSessions(sessionsData.data);
      }

      // Load today's transactions
      const today = new Date().toISOString().split('T')[0];
      const transactionsResponse = await fetch(`/api/pos/transactions?start_date=${today}&limit=10`);
      const transactionsData = await transactionsResponse.json();
      if (transactionsData.success) {
        setRecentTransactions(transactionsData.data);
        
        // Calculate stats
        const transactions = transactionsData.data;
        const totalSales = transactions.reduce((sum: number, t: any) => sum + parseFloat(t.total_amount), 0);
        const totalCustomers = new Set(transactions.map((t: any) => t.customer_id).filter(Boolean)).size;
        
        setStats({
          today_sales: totalSales,
          today_transactions: transactions.length,
          today_customers: totalCustomers,
          avg_transaction_value: transactions.length > 0 ? totalSales / transactions.length : 0,
          open_sessions: sessionsData.data?.length || 0,
          active_terminals: sessionsData.data?.length || 0,
        });
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">POS Dashboard</h1>
          <p className="text-gray-600">Real-time point of sale analytics</p>
        </div>
        <div className="flex gap-2">
          <Link href="/erp/pos/sessions">
            <Button variant="outline">Manage Sessions</Button>
          </Link>
          <Link href="/erp/pos/checkout">
            <Button>Start Checkout</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <h2 className="text-2xl font-bold mt-2">{formatCurrency(stats.today_sales)}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            Live updates
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <h2 className="text-2xl font-bold mt-2">{stats.today_transactions}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Avg: {formatCurrency(stats.avg_transaction_value)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customers Served</p>
              <h2 className="text-2xl font-bold mt-2">{stats.today_customers}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Today's unique customers
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Sessions</p>
              <h2 className="text-2xl font-bold mt-2">{stats.open_sessions}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            {stats.active_terminals} terminals active
          </p>
        </Card>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{session.terminal_name}</p>
                    <p className="text-sm text-gray-600">
                      {session.cashier_name} • Opened {formatTime(session.opened_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(session.total_sales)}</p>
                  <p className="text-sm text-gray-600">{session.total_transactions} transactions</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No transactions yet today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{transaction.transaction_number}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.customer_name || "Walk-in"} • {transaction.terminal_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(transaction.total_amount)}</p>
                  <p className="text-sm text-gray-600">{formatTime(transaction.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/erp/pos/checkout">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Start Checkout</h3>
              <p className="text-sm text-gray-600">Process a new sale</p>
            </div>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/erp/pos/sessions">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Manage Sessions</h3>
              <p className="text-sm text-gray-600">Open or close sessions</p>
            </div>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">Customer Lookup</h3>
            <p className="text-sm text-gray-600">Find customer info</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
