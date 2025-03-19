'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentDiagram: number;
  totalDiagrams: number;
  onPageChange: (page: number) => void;
}

export default function DiagramPagination({ currentDiagram, totalDiagrams, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="outline"
        disabled={currentDiagram === 0}
        onClick={() => onPageChange(currentDiagram - 1)}
      >
        <ChevronLeft className="mr-2" /> السابق
      </Button>
      <span>
        الرسم التخطيطي {currentDiagram + 1} من {totalDiagrams}
      </span>
      <Button
        variant="outline"
        disabled={currentDiagram === totalDiagrams - 1}
        onClick={() => onPageChange(currentDiagram + 1)}
      >
        التالي <ChevronRight className="ml-2" />
      </Button>
    </div>
  );
}