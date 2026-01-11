'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface UtilizationData {
  period: {
    start_date: string;
    end_date: string;
  };
  summary: {
    total_workstations: number;
    avg_utilization: number;
    bottlenecks_count: number;
    underutilized_count: number;
  };
  bottlenecks: Array<{
    workstation_id: string;
    workstation_name: string;
    workstation_code: string;
    avg_utilization: number;
    overloaded_days: number;
  }>;
  underutilized: Array<{
    workstation_id: string;
    workstation_name: string;
    workstation_code: string;
    avg_utilization: number;
    idle_days: number;
  }>;
  workstations: Array<{
    workstation_id: string;
    workstation_name: string;
    workstation_code: string;
    days_tracked: number;
    avg_utilization: number;
    max_utilization: number;
    min_utilization: number;
    total_available: number;
    total_allocated: number;
    overloaded_days: number;
    idle_days: number;
  }>;
}

export default function CapacityDashboardPage() {
  const [utilizationData, setUtilizationData] = useState<UtilizationData | null>(null);
  const [dateRange, setDateRange] = useState('30'); // days
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUtilizationData();
  }, [dateRange]);

  const fetchUtilizationData = async () => {
    setLoading(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - Number(dateRange) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const response = await fetch(
        `/api/operations/capacity/utilization?start_date=${startDate}&end_date=${endDate}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setUtilizationData(data);
      }
    } catch (error) {
      console.error('Error fetching utilization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 100) return 'text-red-600';
    if (utilization >= 85) return 'text-orange-600';
    if (utilization >= 60) return 'text-green-600';
    if (utilization >= 30) return 'text-blue-600';
    return 'text-gray-400';
  };

  const getUtilizationStatus = (utilization: number) => {
    if (utilization >= 100) return 'Overloaded';
    if (utilization >= 85) return 'High';
    if (utilization >= 60) return 'Optimal';
    if (utilization >= 30) return 'Low';
    return 'Idle';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Capacity Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor workstation utilization and identify bottlenecks
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="60">Last 60 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchUtilizationData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {utilizationData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Workstations</CardDescription>
              <CardTitle className="text-3xl">
                {utilizationData.summary.total_workstations}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Active resources
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Utilization</CardDescription>
              <CardTitle className={`text-3xl ${getUtilizationColor(utilizationData.summary.avg_utilization)}`}>
                {utilizationData.summary.avg_utilization}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {getUtilizationStatus(utilizationData.summary.avg_utilization)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Bottlenecks</CardDescription>
              <CardTitle className="text-3xl text-red-600">
                {utilizationData.summary.bottlenecks_count}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Overloaded resources
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Underutilized</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {utilizationData.summary.underutilized_count}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Available capacity
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottlenecks */}
      {utilizationData && utilizationData.bottlenecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Capacity Bottlenecks
            </CardTitle>
            <CardDescription>Workstations operating above optimal capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {utilizationData.bottlenecks.map((bottleneck) => (
                <div
                  key={bottleneck.workstation_id}
                  className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <div>
                      <div className="font-medium">{bottleneck.workstation_name}</div>
                      <div className="text-sm text-muted-foreground">
                        Code: {bottleneck.workstation_code}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {bottleneck.avg_utilization}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {bottleneck.overloaded_days} overloaded days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Underutilized Resources */}
      {utilizationData && utilizationData.underutilized.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Underutilized Resources
            </CardTitle>
            <CardDescription>Workstations with available capacity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {utilizationData.underutilized.map((resource) => (
                <div
                  key={resource.workstation_id}
                  className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div>
                      <div className="font-medium">{resource.workstation_name}</div>
                      <div className="text-sm text-muted-foreground">
                        Code: {resource.workstation_code}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {resource.avg_utilization}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {resource.idle_days} idle days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Workstations */}
      {utilizationData && (
        <Card>
          <CardHeader>
            <CardTitle>All Workstations</CardTitle>
            <CardDescription>Detailed utilization breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {utilizationData.workstations.map((ws) => (
                <div
                  key={ws.workstation_id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      ws.avg_utilization >= 85 ? 'bg-red-500' :
                      ws.avg_utilization >= 60 ? 'bg-green-500' :
                      ws.avg_utilization >= 30 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <div className="font-medium">{ws.workstation_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {ws.workstation_code} • {ws.days_tracked} days tracked
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="text-muted-foreground">Avg</div>
                      <div className={`font-bold ${getUtilizationColor(ws.avg_utilization)}`}>
                        {ws.avg_utilization}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">Max</div>
                      <div>{ws.max_utilization}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground">Min</div>
                      <div>{ws.min_utilization}%</div>
                    </div>
                    <Badge variant={
                      ws.avg_utilization >= 85 ? 'destructive' :
                      ws.avg_utilization >= 60 ? 'default' : 'secondary'
                    }>
                      {getUtilizationStatus(ws.avg_utilization)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
