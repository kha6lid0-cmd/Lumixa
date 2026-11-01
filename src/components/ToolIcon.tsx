import {
  AlignLeft,
  Binary,
  Braces,
  Clock,
  FileImage,
  Files,
  GitCompare,
  Languages,
  Maximize2,
  Minimize2,
  QrCode,
  RefreshCw,
  Scissors,
  ShieldCheck,
  Type,
} from 'lucide-react';
import { ToolDefinition } from '../types/tools';

interface ToolIconProps {
  name: ToolDefinition['iconName'];
  className?: string;
}

export function ToolIcon({ name, className = 'w-5 h-5' }: ToolIconProps) {
  switch (name) {
    case 'Minimize2':
      return <Minimize2 className={className} aria-hidden="true" />;
    case 'Maximize2':
      return <Maximize2 className={className} aria-hidden="true" />;
    case 'RefreshCw':
      return <RefreshCw className={className} aria-hidden="true" />;
    case 'FileImage':
      return <FileImage className={className} aria-hidden="true" />;
    case 'QrCode':
      return <QrCode className={className} aria-hidden="true" />;
    case 'Files':
      return <Files className={className} aria-hidden="true" />;
    case 'Scissors':
      return <Scissors className={className} aria-hidden="true" />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} aria-hidden="true" />;
    case 'AlignLeft':
      return <AlignLeft className={className} aria-hidden="true" />;
    case 'Type':
      return <Type className={className} aria-hidden="true" />;
    case 'Braces':
      return <Braces className={className} aria-hidden="true" />;
    case 'Binary':
      return <Binary className={className} aria-hidden="true" />;
    case 'GitCompare':
      return <GitCompare className={className} aria-hidden="true" />;
    case 'Languages':
      return <Languages className={className} aria-hidden="true" />;
    case 'Clock':
      return <Clock className={className} aria-hidden="true" />;
  }
}
