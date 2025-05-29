import { Badge } from "@/components/ui/badge";

export function BusinessUnitLabel({ assignedBusinessUnits }: { assignedBusinessUnits: { id: number; name: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {assignedBusinessUnits.map((bu) => (
        <Badge key={bu.id} variant="secondary" className="rounded-full px-3 py-1 text-xs">
          {bu.name}
        </Badge>
      ))}
    </div>
  );
} 