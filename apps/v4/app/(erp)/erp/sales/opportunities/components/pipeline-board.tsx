"use client"

import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Card, CardContent, CardHeader } from "@/registry/new-york-v4/ui/card"
import { Building2, Calendar, DollarSign, TrendingUp, User } from "lucide-react"
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area"

interface Opportunity {
  id: string
  name: string
  lead_id?: string
  lead_name?: string
  lead_company?: string
  lead_email?: string
  stage: string
  amount: number
  probability: number
  expected_close_date?: string
  assigned_to?: string
  description?: string
  notes?: string
  is_closed: boolean
  is_won: boolean
  closed_at?: string
  created_at: string
  updated_at: string
}

interface PipelineBoardProps {
  opportunities: Opportunity[]
  onStageChange: (opportunityId: string, newStage: string) => Promise<void>
}

const STAGES = [
  { id: "Discovery", name: "Discovery", color: "bg-blue-500" },
  { id: "Qualification", name: "Qualification", color: "bg-yellow-500" },
  { id: "Proposal", name: "Proposal", color: "bg-purple-500" },
  { id: "Negotiation", name: "Negotiation", color: "bg-orange-500" },
  { id: "Closed Won", name: "Closed Won", color: "bg-green-500" },
  { id: "Closed Lost", name: "Closed Lost", color: "bg-red-500" },
]

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="mb-3 cursor-move hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-3">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm leading-tight">{opportunity.name}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3" />
            <span className="truncate">{opportunity.lead_company || 'N/A'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 font-semibold text-sm">
            <DollarSign className="h-3.5 w-3.5" />
            {formatCurrency(Number(opportunity.amount))}
          </div>
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            {opportunity.probability}%
          </Badge>
        </div>
        
        {opportunity.assigned_to && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">{opportunity.assigned_to}</span>
          </div>
        )}
        
        {opportunity.expected_close_date && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(opportunity.expected_close_date)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PipelineColumn({
  stage,
  opportunities,
  isOver,
}: {
  stage: typeof STAGES[0]
  opportunities: Opportunity[]
  isOver: boolean
}) {
  const totalValue = opportunities.reduce((sum, opp) => sum + Number(opp.amount), 0)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(amount)
  }

  return (
    <div className={`flex flex-col h-full rounded-lg border bg-muted/20 ${isOver ? 'ring-2 ring-primary' : ''}`}>
      <div className="p-4 border-b bg-background">
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${stage.color}`} />
          <h3 className="font-semibold text-sm">{stage.name}</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            {opportunities.length}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatCurrency(totalValue)}
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {opportunities.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No opportunities
            </p>
          ) : (
            opportunities.map((opportunity) => (
              <div 
                key={opportunity.id} 
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('opportunityId', opportunity.id.toString())
                  e.dataTransfer.setData('currentStage', opportunity.stage)
                }}
              >
                <OpportunityCard opportunity={opportunity} />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export function PipelineBoard({ opportunities, onStageChange }: PipelineBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as number
    setActiveId(id)
  }

  const handleDragOver = (event: any) => {
    const overId = event.over?.id
    setOverId(overId || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      setOverId(null)
      return
    }

    const opportunityId = active.id as number
    const newStage = over.id as string

    // Find the opportunity being dragged
    const opportunity = opportunities.find(opp => opp.id === opportunityId)
    
    if (opportunity && opportunity.stage !== newStage) {
      try {
        await onStageChange(opportunityId, newStage)
      } catch (error) {
        console.error('Failed to update opportunity stage:', error)
      }
    }

    setActiveId(null)
    setOverId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setOverId(null)
  }

  const activeOpportunity = activeId ? opportunities.find(opp => opp.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 h-[calc(100vh-400px)]">
        {STAGES.map((stage) => {
          const stageOpportunities = opportunities.filter(opp => opp.stage === stage.id)
          const isOver = overId === stage.id
          
          return (
            <div
              key={stage.id}
              data-id={stage.id}
              onDragOver={(e) => {
                e.preventDefault()
                setOverId(stage.id)
              }}
              onDrop={(e) => {
                e.preventDefault()
                const id = e.dataTransfer.getData('opportunityId')
                if (id) {
                  const opportunityId = parseInt(id)
                  const opportunity = opportunities.find(opp => opp.id === opportunityId)
                  if (opportunity && opportunity.stage !== stage.id) {
                    onStageChange(opportunityId, stage.id)
                  }
                }
                setOverId(null)
              }}
            >
              <PipelineColumn
                stage={stage}
                opportunities={stageOpportunities}
                isOver={isOver}
              />
            </div>
          )
        })}
      </div>

      <DragOverlay>
        {activeOpportunity && (
          <div className="rotate-3 opacity-90">
            <OpportunityCard opportunity={activeOpportunity} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
