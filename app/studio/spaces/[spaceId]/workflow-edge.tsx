"use client";

import { useEffect, useRef, useState } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type Edge, type EdgeProps } from "@xyflow/react";
import { ChevronDown, Scissors } from "lucide-react";

export type WorkflowEdgeData = {
  dataType?: string;
  sourcePort?: string;
  targetPort?: string;
  hovered?: boolean;
  onHoverStart?: (edgeId: string) => void;
  onHoverEnd?: () => void;
  onDisconnect?: (edgeId: string) => void;
};

export type WorkflowEdgeType = Edge<WorkflowEdgeData, "workflow">;

export default function WorkflowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data, selected }: EdgeProps<WorkflowEdgeType>) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const [path, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, curvature: .32 });
  const active = hovered || data?.hovered || selected || expanded;

  const cancelHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
    setHovered(true);
    data?.onHoverStart?.(id);
  };
  const scheduleHide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      setHovered(false);
      setExpanded(false);
      data?.onHoverEnd?.();
    }, 180);
  };
  useEffect(() => () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
  }, []);

  return <>
    <BaseEdge id={id} path={path} markerEnd={markerEnd} interactionWidth={0} style={{ stroke: active ? "#3978f6" : "#8f93a1", strokeWidth: active ? 2.8 : 1.65, filter: active ? "drop-shadow(0 0 4px rgba(57,120,246,.26))" : "none", transition: "stroke .14s, stroke-width .14s, filter .14s" }}/>
    <path className="workflow-edge-hit" d={path} fill="none" stroke="rgba(0,0,0,0.001)" strokeWidth={26} pointerEvents="stroke" onMouseEnter={cancelHide} onMouseLeave={scheduleHide}/>
    {active && <EdgeLabelRenderer>
      <div className="workflow-edge-toolbar nodrag nopan" style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }} onPointerEnter={cancelHide} onPointerLeave={scheduleHide} role="toolbar" aria-label="Connection actions">
        <button className="workflow-edge-disconnect" type="button" onPointerDown={event => { event.preventDefault(); event.stopPropagation(); data?.onDisconnect?.(id); }} aria-label="Disconnect" title="Disconnect"><Scissors/><span>Disconnect</span></button>
        <button className="workflow-edge-more" type="button" onClick={() => setExpanded(value => !value)} aria-label="More connection actions" aria-expanded={expanded}><ChevronDown/></button>
        {expanded && <div className="workflow-edge-menu" role="menu"><b>Connection</b><span>{data?.sourcePort || "output"} → {data?.targetPort || "input"}</span><small>{data?.dataType || "typed data"}</small></div>}
      </div>
    </EdgeLabelRenderer>}
  </>;
}
