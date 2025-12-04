import axios, { AxiosInstance } from 'axios';
import { CaseResult, ExtractedContext } from '../types';

/**
 * Kleopatra Court API Integration
 * This service provides an alternative/backup way to fetch court data
 */
export class KleopatraApiService {
  private api: AxiosInstance;
  private readonly BASE_URL = process.env.KLEOPATRA_API_URL || 'https://court-api.kleopatra.io/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Search district court cases
   */
  async searchDistrictCourt(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      // Search by CNR
      if (params.cnr) {
        const response = await this.api.post('/core/live/district-court/case', {
          cnr: params.cnr
        });
        return this.transformKleopatraResponse([response.data]);
      }

      // Search by party name
      if (params.partyName) {
        const response = await this.api.post('/core/live/district-court/search/party', {
          name: params.partyName,
          stage: params.stage || 'BOTH',
          year: params.year,
          districtId: params.district
        });
        return this.transformKleopatraResponse(response.data);
      }

      // Search by filing number
      if (params.filingNumber) {
        const response = await this.api.post('/core/live/district-court/search/filing', {
          filingNumber: params.filingNumber,
          filingYear: params.filingYear || params.year,
          districtId: params.district
        });
        return this.transformKleopatraResponse(response.data);
      }

      // Search by advocate name
      if (params.advocateName) {
        const response = await this.api.post('/core/live/district-court/search/advocate', {
          name: params.advocateName,
          stage: params.stage || 'BOTH',
          districtId: params.district
        });
        return this.transformKleopatraResponse(response.data);
      }

      return [];
    } catch (error: any) {
      console.error('Kleopatra API error:', error.message);
      throw new Error('Failed to fetch data from Kleopatra API');
    }
  }

  /**
   * Search High Court cases
   */
  async searchHighCourt(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      // Search by CNR
      if (params.cnr) {
        const response = await this.api.post('/core/live/high-court/case', {
          cnr: params.cnr
        });
        return this.transformKleopatraResponse([response.data]);
      }

      // Search by party name
      if (params.partyName) {
        const response = await this.api.post('/core/live/high-court/search/party', {
          name: params.partyName,
          year: params.year,
          stage: params.stage || 'BOTH',
          benchId: params.district // In high court context, this might be bench ID
        });
        return this.transformKleopatraResponse(response.data);
      }

      // Search by filing number
      if (params.filingNumber) {
        const response = await this.api.post('/core/live/high-court/search/filing', {
          filingNumber: params.filingNumber,
          filingYear: params.filingYear || params.year,
          benchId: params.district
        });
        return this.transformKleopatraResponse(response.data);
      }

      return [];
    } catch (error: any) {
      console.error('Kleopatra High Court API error:', error.message);
      throw new Error('Failed to fetch High Court data');
    }
  }

  /**
   * Search Supreme Court cases
   */
  async searchSupremeCourt(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      // Search by party name
      if (params.partyName) {
        const response = await this.api.post('/core/live/supreme-court/search/party', {
          name: params.partyName,
          type: 'ANY',
          year: params.year,
          stage: params.stage || 'PENDING'
        });
        return this.transformKleopatraResponse(response.data);
      }

      // Search by diary number
      if (params.caseNumber && params.year) {
        const response = await this.api.post('/core/live/supreme-court/case', {
          diaryNumber: params.caseNumber,
          year: params.year
        });
        return this.transformKleopatraResponse([response.data]);
      }

      return [];
    } catch (error: any) {
      console.error('Kleopatra Supreme Court API error:', error.message);
      throw new Error('Failed to fetch Supreme Court data');
    }
  }

  /**
   * Get all states for district courts
   */
  async getStates(): Promise<any[]> {
    try {
      const response = await this.api.get('/core/static/district-court/states');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching states:', error.message);
      return [];
    }
  }

  /**
   * Get districts for a state
   */
  async getDistricts(stateId: string): Promise<any[]> {
    try {
      const response = await this.api.post('/core/static/district-court/districts', {
        stateId
      });
      return response.data.districts || [];
    } catch (error: any) {
      console.error('Error fetching districts:', error.message);
      return [];
    }
  }

  /**
   * Get court complexes for a district
   */
  async getComplexes(districtId: string): Promise<any[]> {
    try {
      const response = await this.api.post('/core/static/district-court/complexes', {
        districtId
      });
      return response.data.complexes || [];
    } catch (error: any) {
      console.error('Error fetching complexes:', error.message);
      return [];
    }
  }

  /**
   * Transform Kleopatra API response to our CaseResult format
   */
  private transformKleopatraResponse(data: any[]): CaseResult[] {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return data.map((item: any) => ({
      caseNumber: item.caseNumber || item.case_number,
      cnr: item.cnr || item.cino,
      petitioner: item.petitioner,
      respondent: item.respondent,
      parties: item.parties || `${item.petitioner || ''} vs ${item.respondent || ''}`.trim(),
      court: item.court || item.courtName,
      state: item.state,
      district: item.district,
      caseType: item.caseType || item.case_type,
      filingDate: item.filingDate || item.filing_date,
      filingNumber: item.filingNumber || item.filing_number,
      status: item.status,
      nextHearingDate: item.nextHearingDate || item.next_hearing_date,
      lastHearingDate: item.lastHearingDate || item.last_hearing_date,
      currentStage: item.currentStage || item.stage,
      judgeName: item.judgeName || item.judge,
      purposeOfHearing: item.purposeOfHearing || item.purpose,
      courtNumber: item.courtNumber || item.court_number,
      petitionerAdvocate: item.petitionerAdvocate || item.petitioner_advocate,
      respondentAdvocate: item.respondentAdvocate || item.respondent_advocate,
      underActs: item.underActs || item.acts
    }));
  }
}

export const kleopatraApi = new KleopatraApiService();
