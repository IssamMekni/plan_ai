'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import PlantUmlEncoder from "plantuml-encoder";

interface Diagram {
  id: string;
  name: string;
  code: string;
}

interface Props {
  diagram: Diagram;
  onCodeChange: (code: string) => void;
  onSave: (code: string) => Promise<void>;
}

export default function DiagramEditor({ diagram, onCodeChange, onSave }: Props) {
  const [code, setCode] = useState(diagram.code);
  const diagramUrl = `http://www.plantuml.com/plantuml/png/${PlantUmlEncoder.encode(code)}`;

  useEffect(() => {
    setCode(diagram.code);
  }, [diagram]);

  const handleChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleSaveClick = () => onSave(code);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="border rounded-lg p-2">
        <h3 className="text-lg font-semibold mb-2">{diagram.name} - الكود</h3>
        <Editor
          height="400px"
          defaultLanguage="plaintext"
          value={code}
          onChange={handleChange}
          options={{ minimap: { enabled: false }, wordWrap: 'on' }}
        />
        <Button onClick={handleSaveClick} className="mt-2">
          حفظ
        </Button>
      </div>
      <div className="border rounded-lg p-2">
        <h3 className="text-lg font-semibold mb-2">{diagram.name} - المعاينة</h3>
        <img
          src={diagramUrl}
          alt="Diagram"
          className="max-w-full h-auto"
          onError={(e) => (e.currentTarget.src = '/placeholder.png')}
        />
      </div>
    </div>
  );
}