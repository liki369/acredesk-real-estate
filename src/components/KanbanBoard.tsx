"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Types ---
export type Lead = {
  id: string;
  name: string;
  property: string;
  value: string;
  stage: string;
};

type BoardProps = {
  initialLeads: Lead[];
  onStageChange: (leadId: string, newStage: string) => void;
};

const STAGES = [
  { id: "new", title: "New" },
  { id: "contacted", title: "Contacted" },
  { id: "site_visit", title: "Site Visit" },
  { id: "negotiating", title: "Negotiating" },
  { id: "closed", title: "Closed" },
];

// --- Sortable Item Component ---
function SortableLeadCard({ lead }: { lead: Lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id, data: { ...lead } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-4 bg-card border border-border rounded-lg shadow-sm cursor-grab 
        ${isDragging ? "opacity-50 ring-2 ring-primary" : "hover:border-primary/50"}
      `}
    >
      <h4 className="font-medium text-white mb-1">{lead.name}</h4>
      <p className="text-xs text-muted-foreground truncate">{lead.property}</p>
      <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
        <span className="text-xs font-semibold text-primary">{lead.value}</span>
      </div>
    </div>
  );
}

// --- Droppable Column Component ---
function DroppableColumn({ id, title, count, children }: { id: string, title: string, count: number, children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { type: "Column", stage: id }
  });

  return (
    <div 
      className={`flex-shrink-0 w-80 bg-slate-900/50 rounded-xl p-4 flex flex-col h-[calc(100vh-280px)] min-h-[450px] transition-colors ${isOver ? "bg-slate-900/80 ring-1 ring-primary/50" : ""}`}
    >
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-200">{title}</h3>
        <span className="bg-background px-2.5 py-0.5 rounded-full text-xs text-muted-foreground font-medium border border-border">
          {count}
        </span>
      </div>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-[120px]">
        {children}
      </div>
    </div>
  );
}

// --- Main Board Component ---
export default function KanbanBoard({ initialLeads, onStageChange }: BoardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize internal state when props update
  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find((l) => l.id === active.id);
    if (lead) setActiveLead(lead);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveLead = active.data.current?.id !== undefined;
    const isOverLead = over.data.current?.id !== undefined;
    
    // If dropping over a column area
    if (isActiveLead && !isOverLead) {
      setLeads((prev) => {
        const activeIndex = prev.findIndex((l) => l.id === activeId);
        if (activeIndex === -1) return prev;
        const newLeads = [...prev];
        newLeads[activeIndex].stage = overId as string;
        return newLeads;
      });
    }

    // If dropping over another lead in a potentially different column
    if (isActiveLead && isOverLead) {
      setLeads((prev) => {
        const activeIndex = prev.findIndex((l) => l.id === activeId);
        const overIndex = prev.findIndex((l) => l.id === overId);
        if (activeIndex === -1 || overIndex === -1) return prev;
        
        if (prev[activeIndex].stage !== prev[overIndex].stage) {
          const newLeads = [...prev];
          newLeads[activeIndex].stage = prev[overIndex].stage;
          return arrayMove(newLeads, activeIndex, overIndex);
        }
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    
    if (!over) return;

    const lead = leads.find((l) => l.id === active.id);
    if (lead && lead.stage !== active.data.current?.stage) {
      onStageChange(lead.id, lead.stage);
    }
  };

  // Prevent SSR accessibility ID mismatch on initial hydration
  if (!mounted) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = initialLeads.filter((l) => l.stage === stage.id);
          return (
            <div 
              key={stage.id}
              className="flex-shrink-0 w-80 bg-slate-900/50 rounded-xl p-4 flex flex-col h-[calc(100vh-280px)] min-h-[450px]"
            >
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-200">{stage.title}</h3>
                <span className="bg-background px-2.5 py-0.5 rounded-full text-xs text-muted-foreground font-medium border border-border">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 bg-card border border-border rounded-lg shadow-sm"
                  >
                    <h4 className="font-medium text-white mb-1">{lead.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{lead.property}</p>
                    <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                      <span className="text-xs font-semibold text-primary">{lead.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      <DndContext
        id="crm-kanban-dnd-context"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          const leadIds = stageLeads.map((l) => l.id);

          return (
            <DroppableColumn key={stage.id} id={stage.id} title={stage.title} count={stageLeads.length}>
              <SortableContext 
                id={stage.id}
                items={leadIds} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {stageLeads.map((lead) => (
                    <SortableLeadCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </SortableContext>
            </DroppableColumn>
          );
        })}

        <DragOverlay>
          {activeLead ? (
            <div className="p-4 bg-card border border-primary rounded-lg shadow-xl opacity-95 scale-105">
              <h4 className="font-medium text-white mb-1">{activeLead.name}</h4>
              <p className="text-xs text-muted-foreground">{activeLead.property}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
