'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';
import { Calendar, Clock, AlertCircle, CheckCircle, Play, Pause } from 'lucide-react';

interface GanttTask {
  id: string;
  assignment_id: number;
  name: string;
  start: string;
  end: string;
  progress: number;
  status: string;
  priority: string;
  is_critical_path: boolean;
  dependencies: string[];
  operations: any[];
}

interface GanttData {
  schedule: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
  };
  tasks: GanttTask[];
  resources: any[];
  statistics: {
    total_tasks: number;
    completed_tasks: number;
    in_progress_tasks: number;
    pending_tasks: number;
    critical_path_tasks: number;
    avg_progress: number;
  };
}

export default function SchedulerPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [ganttData, setGanttData] = useState<GanttData | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('gantt');

  // Fetch schedules
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/operations/schedules');
      const data = await response.json();
      setSchedules(data.schedules || []);
      if (data.schedules?.length > 0 && !selectedScheduleId) {
        setSelectedScheduleId(data.schedules[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  // Fetch Gantt data for selected schedule
  useEffect(() => {
    if (selectedScheduleId) {
      fetchGanttData(selectedScheduleId);
    }
  }, [selectedScheduleId]);

  const fetchGanttData = async (scheduleId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/operations/schedules/${scheduleId}/gantt`);
      const data = await response.json();
      setGanttData(data);
    } catch (error) {
      console.error('Error fetching Gantt data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'normal': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Production Scheduler</h1>
          <p className="text-muted-foreground mt-1">
            Gantt chart view with capacity-aware scheduling
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedScheduleId} onValueChange={setSelectedScheduleId}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((schedule) => (
                <SelectItem key={schedule.id} value={schedule.id.toString()}>
                  {schedule.schedule_name} ({schedule.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => fetchGanttData(selectedScheduleId)}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {ganttData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Tasks</CardDescription>
              <CardTitle className="text-3xl">{ganttData.statistics.total_tasks}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {ganttData.statistics.completed_tasks}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {ganttData.statistics.in_progress_tasks}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Progress</CardDescription>
              <CardTitle className="text-3xl">{ganttData.statistics.avg_progress}%</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {ganttData?.schedule.name || 'Schedule Timeline'}
              </CardTitle>
              <CardDescription>
                {ganttData && (
                  <>
                    {new Date(ganttData.schedule.start_date).toLocaleDateString()} - 
                    {new Date(ganttData.schedule.end_date).toLocaleDateString()}
                  </>
                )}
              </CardDescription>
            </div>
            <Tabs value={viewMode} onValueChange={(v: string) => setViewMode(v as 'list' | 'gantt')}>
              <TabsList>
                <TabsTrigger value="gantt">Gantt View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : ganttData ? (
            <div>
              {viewMode === 'gantt' ? (
                <div className="space-y-4">
                  {/* Timeline Header */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground border-b pb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Simplified Gantt Chart (Visual representation)</span>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-2">
                    {ganttData.tasks.map((task) => {
                      const start = new Date(task.start);
                      const end = new Date(task.end);
                      const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

                      return (
                        <div key={task.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                              <span className="font-medium">{task.name}</span>
                              <Badge variant={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              {task.is_critical_path && (
                                <Badge variant="destructive">Critical Path</Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {duration} days
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full ${getStatusColor(task.status)}`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              <Clock className="h-3 w-3 inline mr-1" />
                              {start.toLocaleDateString()} - {end.toLocaleDateString()}
                            </span>
                            <span>{task.progress}% complete</span>
                          </div>

                          {/* Operations */}
                          {task.operations.length > 0 && (
                            <div className="mt-2 pt-2 border-t">
                              <span className="text-xs font-medium text-muted-foreground">
                                Operations: {task.operations.length}
                              </span>
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {task.operations.map((op, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {op.workstation?.code || 'N/A'}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // List View
                <div className="space-y-2">
                  {ganttData.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`} />
                        <div>
                          <div className="font-medium">{task.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {task.operations.length} operations
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Resources Section */}
              {ganttData.resources.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Resource Utilization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ganttData.resources.map((resource) => (
                      <Card key={resource.id}>
                        <CardHeader className="pb-2">
                          <CardDescription>{resource.code}</CardDescription>
                          <CardTitle className="text-lg">{resource.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground">
                            {resource.operations_count} operations
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(resource.total_duration_minutes / 60)} hours
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Select a schedule to view the Gantt chart
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Critical Path</Badge>
              <span>Must complete on time</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
