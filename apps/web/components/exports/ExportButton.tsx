'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  onClick: () => Promise<void>;
  label: string;
}

export function ExportButton({ onClick, label }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = async () => {
    setIsExporting(true);
    try {
      await onClick();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isExporting}
      className={`
        w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium
        ${
          isExporting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary text-white hover:opacity-90'
        }
        transition-opacity
      `}
    >
      <Download className="w-5 h-5" />
      {isExporting ? 'Exporting...' : label}
    </button>
  );
}
