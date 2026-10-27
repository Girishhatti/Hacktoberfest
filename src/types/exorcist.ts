export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type BugCategory =
  | 'syntax'
  | 'logic'
  | 'runtime'
  | 'security'
  | 'performance'
  | 'edge_case';

export interface BugFinding {
  id: string;
  title: string;
  line: number;
  category: BugCategory;
  severity: Severity;
  explanation: string;
  suggested_fix: string;
  original_snippet: string;
  corrected_snippet: string;
  applied?: boolean;
}

export interface AnalysisResult {
  language: string;
  summary: string;
  findings: BugFinding[];
  corrected_code: string;
  applied_fixes: string[];
  unresolved_issues: string[];
  analyzedAt: string;
  original_code: string;
  fileName: string;
  userProblem?: string;
  problemResolution?: string;
}

export interface PdfAttachment {
  name: string;
  size: number;
  base64: string;
}

export type ThemeMode = 'halloween' | 'normal';

export interface LanguageOption {
  id: string;
  name: string;
  extension: string;
  mime: string;
}

export interface SampleCodeItem {
  id: string;
  title: string;
  language: string;
  fileName: string;
  description: string;
  code: string;
  knownHauntingsCount: number;
  demoAnalysis?: Omit<AnalysisResult, 'original_code' | 'fileName'>;
}
