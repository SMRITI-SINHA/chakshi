export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: CaseResult[] | null;
}

export interface CaseResult {
  caseNumber?: string;
  cnr?: string;
  petitioner?: string;
  respondent?: string;
  parties?: string;
  court?: string;
  state?: string;
  district?: string;
  caseType?: string;
  filingDate?: string;
  filingNumber?: string;
  status?: string;
  nextHearingDate?: string;
  lastHearingDate?: string;
  currentStage?: string;
  judgeName?: string;
  purposeOfHearing?: string;
  courtNumber?: string;
  underActs?: string;
  petitionerAdvocate?: string;
  respondentAdvocate?: string;
  [key: string]: any;
}

export interface ChatbotResponse {
  action: 'ask' | 'search' | 'info';
  message: string;
  extracted?: any;
  portal?: string | null;
  portalURL?: string | null;
  searchParams?: any;
  results?: CaseResult[];
}
