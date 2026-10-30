import { createContext, useContext } from 'react';

export interface WorkspaceA11yStatus {
  /** Screen-reader summary of selected file(s), e.g., "No file selected" or "File photo.png ready" */
  fileStatus: string;
  /** Screen-reader summary of current processing state */
  actionStatus?: string;
  /** True while asynchronous compression, conversion, or PDF generation is running */
  isBusy?: boolean;
}

interface WorkspaceA11yContextValue {
  reportStatus: (status: WorkspaceA11yStatus) => void;
}

const WorkspaceA11yContext = createContext<WorkspaceA11yContextValue>({
  reportStatus: () => {},
});

export const WorkspaceA11yProvider = WorkspaceA11yContext.Provider;

export function useWorkspaceA11y() {
  return useContext(WorkspaceA11yContext);
}
