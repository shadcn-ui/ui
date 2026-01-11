'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs'
import { Progress } from '@/registry/new-york-v4/ui/progress'
import { 
  Trophy,
  Target,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  ShoppingCart,
  PhoneCall,
  Mail,
  Calendar,
  Star,
  Zap
} from 'lucide-react'

interface PerformanceData {
  user_id: number
  user_name: string
  email: string
  leads_created: number | string
  opportunities_created: number | string
  orders_created: number | string
  revenue: number | string
  conversion_rate: number | string
  win_rate: number | string
}

interface Goal {
  id: number
  user_id: number
  user_name: string
  goal_type: string
  period_type: string
  period_start: string
  period_end: string
  target_value: number | string
  current_value: number | string
  achievement_percentage: number | string
  status: string
  performance_status: string
  description: string
}

interface LeaderboardEntry {
  user_id: number
  user_name: string
  email: string
  total_revenue: number | string
  orders_created: number | string
  conversion_rate: number | string
  win_rate: number | string
  revenue_rank: number | string
  orders_rank: number | string
  conversion_rank: number | string
}

interface Achievement {
  id: number
  user_id: number
  achievement_type: string
  title: string
  description: string
  badge_icon: string
  achievement_value: number | string
  achieved_at: string
}

const STATUS_COLORS: Record<string, string> = {
  'Achieved': 'bg-green-100 text-green-800',
  'On Track': 'bg-blue-100 text-blue-800',
  'Behind': 'bg-yellow-100 text-yellow-800',
  'At Risk': 'bg-red-100 text-red-800',
}

export default function PerformancePage() {
  const [currentPerformance, setCurrentPerformance] = useState<PerformanceData[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    try {
      // Fetch current month performance
      const currentRes = await fetch('/api/performance?type=current')
      if (currentRes.ok) {
        const data = await currentRes.json()
        setCurrentPerformance(data.data || [])
      }

      // Fetch goals
      const goalsRes = await fetch('/api/performance?type=goals')
      if (goalsRes.ok) {
        const data = await goalsRes.json()
        setGoals(data.data || [])
      }

      // Fetch leaderboard
      const leaderboardRes = await fetch('/api/performance?type=leaderboard')
      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json()
        setLeaderboard(data.data || [])
      }

      // Fetch achievements
      const achievementsRes = await fetch('/api/performance?type=achievements')
      if (achievementsRes.ok) {
        const data = await achievementsRes.json()
        setAchievements(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching performance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount?: number | string) => {
    if (!amount) return 'Rp0'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return 'Rp0'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num)
  }

  const formatPercent = (value?: number | string) => {
    if (!value) return '0%'
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '0%'
    return `${num.toFixed(1)}%`
  }

  const toNumber = (value?: number | string): number => {
    if (!value) return 0
    const num = typeof value === 'string' ? parseFloat(value) : value
    return isNaN(num) ? 0 : num
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading performance metrics...</div>
        </div>
      </div>
    )
  }

  const myPerformance = currentPerformance[0] // Assume first user for now
  const myGoals = goals.filter(g => g.user_id === myPerformance?.user_id)
  const myAchievements = achievements.filter(a => a.user_id === myPerformance?.user_id)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance Metrics</h1>
        <p className="text-muted-foreground">Track your sales performance and achievements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue This Month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(myPerformance?.revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {toNumber(myPerformance?.orders_created)} orders closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversion Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(myPerformance?.conversion_rate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {toNumber(myPerformance?.leads_created)} leads created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Win Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(myPerformance?.win_rate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {toNumber(myPerformance?.opportunities_created)} opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myAchievements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Badges earned
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">
            <Target className="mr-2 h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-2 h-4 w-4" />
            Team Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Goals</CardTitle>
              <CardDescription>Track progress towards your targets</CardDescription>
            </CardHeader>
            <CardContent>
              {myGoals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active goals. Set goals to track your progress!
                </p>
              ) : (
                <div className="space-y-4">
                  {myGoals.map((goal) => {
                    const percentage = toNumber(goal.achievement_percentage)
                    return (
                      <div key={goal.id} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{goal.goal_type} Goal</h4>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          <Badge className={STATUS_COLORS[goal.performance_status] || ''}>
                            {goal.performance_status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{formatCurrency(goal.current_value)}</span>
                            <span className="text-muted-foreground">
                              Target: {formatCurrency(goal.target_value)}
                            </span>
                          </div>
                          <Progress value={Math.min(100, percentage)} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{percentage.toFixed(1)}% complete</span>
                            <span>{formatDate(goal.period_start)} - {formatDate(goal.period_end)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Goals */}
          <Card>
            <CardHeader>
              <CardTitle>All Active Goals</CardTitle>
              <CardDescription>Company-wide goal tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {goals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No active goals</p>
                ) : (
                  goals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted">
                      <div className="flex-1">
                        <div className="font-medium">{goal.user_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {goal.goal_type}: {formatCurrency(goal.current_value)} / {formatCurrency(goal.target_value)}
                        </div>
                      </div>
                      <Badge className={STATUS_COLORS[goal.performance_status] || ''}>
                        {toNumber(goal.achievement_percentage).toFixed(0)}%
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>This month's sales leaders</CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No performance data available</p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, idx) => {
                    const rank = toNumber(entry.revenue_rank)
                    const isTop3 = rank <= 3
                    return (
                      <div key={entry.user_id} className={`flex items-center gap-4 p-4 rounded-lg border ${isTop3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'hover:bg-muted'}`}>
                        <div className="flex-shrink-0">
                          {rank === 1 && <Trophy className="h-8 w-8 text-yellow-500" />}
                          {rank === 2 && <Trophy className="h-8 w-8 text-gray-400" />}
                          {rank === 3 && <Trophy className="h-8 w-8 text-orange-600" />}
                          {rank > 3 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold">
                              {rank}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{entry.user_name}</div>
                          <div className="text-sm text-muted-foreground">{entry.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatCurrency(entry.total_revenue)}</div>
                          <div className="text-sm text-muted-foreground">
                            {toNumber(entry.orders_created)} orders • {formatPercent(entry.conversion_rate)} conv
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.length === 0 ? (
              <Card className="col-span-2">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No achievements yet. Keep working to earn badges!
                </CardContent>
              </Card>
            ) : (
              achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{achievement.badge_icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{achievement.achievement_type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(achievement.achieved_at)}
                          </span>
                        </div>
                        {achievement.achievement_value && (
                          <div className="mt-2 text-sm font-medium text-primary">
                            {formatCurrency(achievement.achievement_value)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentPerformance.map((perf) => (
              <Card key={perf.user_id}>
                <CardHeader>
                  <CardTitle className="text-base">{perf.user_name}</CardTitle>
                  <CardDescription className="text-xs">{perf.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-semibold">{formatCurrency(perf.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Orders</span>
                    <span className="font-semibold">{toNumber(perf.orders_created)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversion</span>
                    <span className="font-semibold">{formatPercent(perf.conversion_rate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-semibold">{formatPercent(perf.win_rate)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
