"use client";

import { useState, useEffect } from "react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Card } from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/registry/new-york-v4/ui/dialog";
import { Label } from "@/registry/new-york-v4/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select";
import { Clock, DollarSign, Users, TrendingUp, LogIn, LogOut, AlertCircle } from "lucide-react";

interface Session {
  id: number;
  session_number: string;
  terminal_name: string;
  cashier_name: string;
  opened_at: string;
  closed_at?: string;
  opening_cash: number;
  closing_cash?: number;
  expected_cash?: number;
  cash_variance?: number;
  total_transactions: number;
  total_sales: number;
  session_status: string;
}

export default function POSSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [openingCash, setOpeningCash] = useState("0");
  const [closingCash, setClosingCash] = useState("0");
  const [terminalId, setTerminalId] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/pos/sessions?terminal_id=1&limit=20");
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const openSession = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pos/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          terminal_id: terminalId,
          warehouse_id: 1, // Mock warehouse ID
          cashier_id: 1, // Mock cashier ID
          opening_cash: parseFloat(openingCash),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Session opened successfully!");
        setShowOpenDialog(false);
        setOpeningCash("0");
        loadSessions();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error opening session:", error);
      alert("Failed to open session");
    } finally {
      setLoading(false);
    }
  };

  const closeSession = async () => {
    if (!selectedSession) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/pos/sessions/${selectedSession.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          closing_cash: parseFloat(closingCash),
          notes: "",
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Session closed successfully!");
        setShowCloseDialog(false);
        setSelectedSession(null);
        setClosingCash("0");
        loadSessions();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error closing session:", error);
      alert("Failed to close session");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const openSessions = sessions.filter(s => s.session_status === 'open');
  const closedSessions = sessions.filter(s => s.session_status === 'closed');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">POS Sessions</h1>
          <p className="text-gray-600">Manage cash drawer sessions and reconciliation</p>
        </div>
        <Button onClick={() => setShowOpenDialog(true)} size="lg">
          <LogIn className="h-5 w-5 mr-2" />
          Open Session
        </Button>
      </div>

      {/* Open Sessions */}
      {openSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {openSessions.map((session) => (
              <Card key={session.id} className="p-6 border-green-200 bg-green-50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{session.terminal_name}</h3>
                    <p className="text-sm text-gray-600">{session.session_number}</p>
                  </div>
                  <Badge className="bg-green-600">Open</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{session.cashier_name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Opened: {formatDateTime(session.opened_at)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Opening: {formatCurrency(session.opening_cash)}</span>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Transactions</span>
                      <span className="font-semibold">{session.total_transactions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Sales</span>
                      <span className="font-semibold">{formatCurrency(session.total_sales)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => {
                    setSelectedSession(session);
                    setShowCloseDialog(true);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Close Session
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Closed Sessions History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Session History</h2>
        <div className="space-y-3">
          {closedSessions.map((session) => (
            <Card key={session.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold">{session.terminal_name}</h3>
                      <p className="text-sm text-gray-600">{session.session_number}</p>
                    </div>
                    <Badge variant="outline">Closed</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Cashier</p>
                      <p className="font-semibold">{session.cashier_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold">
                        {session.closed_at
                          ? `${Math.round((new Date(session.closed_at).getTime() - new Date(session.opened_at).getTime()) / (1000 * 60 * 60))} hours`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Transactions</p>
                      <p className="font-semibold">{session.total_transactions}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Sales</p>
                      <p className="font-semibold">{formatCurrency(session.total_sales)}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Opening Cash</p>
                      <p className="font-semibold">{formatCurrency(session.opening_cash)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expected Cash</p>
                      <p className="font-semibold">{formatCurrency(session.expected_cash || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Closing Cash</p>
                      <p className="font-semibold">{formatCurrency(session.closing_cash || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Variance</p>
                      <p className={`font-semibold ${(session.cash_variance || 0) !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(session.cash_variance || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Open Session Dialog */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open New Session</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Terminal</Label>
              <Select defaultValue="1" onValueChange={(value) => setTerminalId(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Terminal 1</SelectItem>
                  <SelectItem value="2">Terminal 2</SelectItem>
                  <SelectItem value="3">Terminal 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Opening Cash Amount</Label>
              <Input
                type="number"
                placeholder="Enter opening cash amount"
                value={openingCash}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpeningCash(e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-1">
                Count physical cash in drawer before starting
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-900">Important</p>
                <p className="text-yellow-700">
                  Make sure to count all cash carefully. This amount will be used for end-of-day reconciliation.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={openSession} disabled={loading}>
              {loading ? "Opening..." : "Open Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Session Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Session</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-4 py-4">
              <Card className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Terminal</p>
                    <p className="font-semibold">{selectedSession.terminal_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Session</p>
                    <p className="font-semibold">{selectedSession.session_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Opening Cash</p>
                    <p className="font-semibold">{formatCurrency(selectedSession.opening_cash)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Sales</p>
                    <p className="font-semibold">{formatCurrency(selectedSession.total_sales)}</p>
                  </div>
                </div>
              </Card>

              <div>
                <Label>Closing Cash Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter actual cash counted in drawer"
                  value={closingCash}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClosingCash(e.target.value)}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Count all physical cash currently in the drawer
                </p>
              </div>

              {closingCash && parseFloat(closingCash) > 0 && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Expected Cash:</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedSession.opening_cash + selectedSession.total_sales)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actual Cash:</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(closingCash))}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-300">
                      <span className="font-semibold">Variance:</span>
                      <span className={`font-bold ${
                        parseFloat(closingCash) - (selectedSession.opening_cash + selectedSession.total_sales) !== 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}>
                        {formatCurrency(
                          parseFloat(closingCash) - (selectedSession.opening_cash + selectedSession.total_sales)
                        )}
                      </span>
                    </div>
                  </div>
                </Card>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-900">Verify Before Closing</p>
                  <p className="text-yellow-700">
                    Double-check your cash count. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={closeSession} disabled={loading}>
              {loading ? "Closing..." : "Close Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
