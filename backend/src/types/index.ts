// Portal Types
export type Portal = 'casestatus' | 'courtorder' | 'causelist' | 'caveat' | 'home' | 'location';

export type CaseStage = 'PENDING' | 'DISPOSED' | 'BOTH';

export type CourtLevel = 'district' | 'highcourt' | 'supremecourt' | 'cat' | 'nclt' | 'consumer';

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: CaseResult[] | null;
}

// Extracted Context from User Query
export interface ExtractedContext {
  state?: string;
  district?: string;
  courtComplex?: string;
  courtName?: string;
  partyName?: string;
  cnr?: string;
  caseNumber?: string;
  filingNumber?: string;
  filingYear?: string;
  advocateName?: string;
  advocateNumber?: string;
  year?: string;
  stage?: CaseStage;
  portal?: Portal;
}

// Chatbot Response Types
export interface ChatbotResponse {
  action: 'ask' | 'search' | 'info';
  message: string;
  extracted?: ExtractedContext;
  portal?: Portal | null;
  portalURL?: string | null;
  searchParams?: any;
  results?: CaseResult[];
}

// Case Result from eCourts
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
  status?: 'Pending' | 'Disposed' | string;
  nextHearingDate?: string;
  lastHearingDate?: string;
  currentStage?: string;
  judgeName?: string;
  purposeOfHearing?: string;
  courtNumber?: string;
  underActs?: string;
  petitionerAdvocate?: string;
  respondentAdvocate?: string;
  caseHistory?: CaseHistoryItem[];
  orders?: CourtOrder[];
  [key: string]: any;
}

export interface CaseHistoryItem {
  date: string;
  judge?: string;
  purpose?: string;
  business?: string;
}

export interface CourtOrder {
  date: string;
  orderText?: string;
  orderLink?: string;
}

// Portal URLs
export interface PortalURLs {
  casestatus: string;
  courtorder: string;
  causelist: string;
  caveat: string;
  home: string;
  location: string;
}

// API Request Types
export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface SearchRequest {
  portal: Portal;
  params: ExtractedContext;
}

// State/District mapping
export interface StateInfo {
  id: string;
  name: string;
  code: string;
  keywords: string[];
}

export interface DistrictInfo {
  id: string;
  name: string;
  stateId: string;
}

export interface CourtComplexInfo {
  id: string;
  name: string;
  districtId: string;
}

// Kleopatra API Types
export interface KleopatraSearchParams {
  cnr?: string;
  name?: string;
  filingNumber?: string;
  filingYear?: string;
  advocateName?: string;
  state?: string;
  district?: string;
  stage?: CaseStage;
  year?: string;
}
