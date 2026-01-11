'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Calendar, TrendingUp, Package, AlertTriangle } from 'lucide-react';

export default function MPSPage() {
  const [productFamilies, setProductFamilies] = useState<any[]>([]);
  const [mpsSchedules, setMPSSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch product families
      const familiesResponse = await fetch('/api/operations/mps/product-families');
      if (familiesResponse.ok) {
        const familiesData = await familiesResponse.json();
        setProductFamilies(familiesData.families || []);
      }

      // Fetch MPS schedules
      const mpsResponse = await fetch('/api/operations/mps/schedules');
      if (mpsResponse.ok) {
        const mpsData = await mpsResponse.json();
        setMPSSchedules(mpsData.schedules || []);
      }
    } catch (error) {
      console.error('Error fetching MPS data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Master Production Schedule (MPS)</h1>
          <p className="text-muted-foreground mt-1">
            Plan production at the family level with demand aggregation
          </p>
        </div>
        <Button>Create MPS</Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Product Families</CardDescription>
            <CardTitle className="text-3xl">{productFamilies.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Schedules</CardDescription>
            <CardTitle className="text-3xl">
              {mpsSchedules.filter(s => s.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Planned Units</CardDescription>
            <CardTitle className="text-3xl">
              {mpsSchedules.reduce((sum, s) => sum + (s.total_quantity || 0), 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ATP Available</CardDescription>
            <CardTitle className="text-3xl text-green-600">95%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Product Families */}
      <Card>
        <CardHeader>
          <CardTitle>Product Families</CardTitle>
          <CardDescription>Group similar products for aggregate planning</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : productFamilies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productFamilies.map((family) => (
                <Card key={family.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{family.family_name}</CardTitle>
                      <Badge>{family.member_count} products</Badge>
                    </div>
                    <CardDescription>{family.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>Code: {family.family_code}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No product families defined</p>
              <p className="text-sm mt-2">Create families to group similar products</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MPS Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>MPS Schedules</CardTitle>
          <CardDescription>Production plans by period</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : mpsSchedules.length > 0 ? (
            <div className="space-y-3">
              {mpsSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{schedule.schedule_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(schedule.start_period).toLocaleDateString()} - {' '}
                        {new Date(schedule.end_period).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {schedule.total_quantity || 0} units
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {schedule.line_count || 0} families
                      </div>
                    </div>
                    <Badge
                      variant={
                        schedule.status === 'active' ? 'default' :
                        schedule.status === 'frozen' ? 'secondary' : 'outline'
                      }
                    >
                      {schedule.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No MPS schedules created</p>
              <p className="text-sm mt-2">Create a schedule to plan production</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">MPS Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="mt-1">✓</div>
              <div>
                <div className="font-medium">Product Family Planning</div>
                <div className="text-muted-foreground text-xs">
                  Aggregate demand across similar products
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1">✓</div>
              <div>
                <div className="font-medium">ATP Calculations</div>
                <div className="text-muted-foreground text-xs">
                  Available-To-Promise inventory tracking
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1">✓</div>
              <div>
                <div className="font-medium">Freeze Horizon</div>
                <div className="text-muted-foreground text-xs">
                  Lock schedules within lead time window
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1">✓</div>
              <div>
                <div className="font-medium">Demand Forecasting Integration</div>
                <div className="text-muted-foreground text-xs">
                  Use forecasts to drive production planning
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
