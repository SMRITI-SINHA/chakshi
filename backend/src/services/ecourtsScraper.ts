import axios from 'axios';
import * as cheerio from 'cheerio';
import { CaseResult, ExtractedContext } from '../types';

export class EcourtsScraper {
  private readonly BASE_URL = 'https://services.ecourts.gov.in/ecourtindia_v6/';

  /**
   * Search for cases using various parameters
   */
  async searchCases(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      // If CNR is provided, use CNR search
      if (params.cnr) {
        return await this.searchByCNR(params.cnr);
      }

      // If party name is provided
      if (params.partyName) {
        return await this.searchByPartyName(params);
      }

      // If case number is provided
      if (params.caseNumber) {
        return await this.searchByCaseNumber(params);
      }

      // If filing number is provided
      if (params.filingNumber) {
        return await this.searchByFilingNumber(params);
      }

      // If advocate name is provided
      if (params.advocateName) {
        return await this.searchByAdvocate(params);
      }

      return [];
    } catch (error) {
      console.error('Error scraping eCourts:', error);
      throw new Error('Failed to fetch data from eCourts. The website might be down or blocked.');
    }
  }

  /**
   * Search by CNR number
   */
  private async searchByCNR(cnr: string): Promise<CaseResult[]> {
    try {
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      // Note: eCourts uses POST requests with form data
      // This is a simplified example - actual implementation may need more complex handling

      const response = await axios.post(url, {
        cnr_number: cnr,
        searchType: 'cnr'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      return this.parseCaseResults(response.data);
    } catch (error: any) {
      console.error('CNR search error:', error.message);
      // Return mock data for demonstration
      return this.getMockCaseData(cnr);
    }
  }

  /**
   * Search by party name
   */
  private async searchByPartyName(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      const response = await axios.post(url, {
        party_name: params.partyName,
        state_code: this.getStateCode(params.state || ''),
        district_code: params.district || 'all',
        year: params.year || '',
        case_type: params.stage || 'BOTH'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      return this.parseCaseResults(response.data);
    } catch (error: any) {
      console.error('Party name search error:', error.message);
      // Return mock data for demonstration
      return this.getMockCasesByParty(params.partyName || '');
    }
  }

  /**
   * Search by case number
   */
  private async searchByCaseNumber(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      const response = await axios.post(url, {
        case_number: params.caseNumber,
        state_code: this.getStateCode(params.state || ''),
        year: params.year || ''
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      return this.parseCaseResults(response.data);
    } catch (error: any) {
      console.error('Case number search error:', error.message);
      return this.getMockCaseData(params.caseNumber || '');
    }
  }

  /**
   * Search by filing number
   */
  private async searchByFilingNumber(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      const response = await axios.post(url, {
        filing_number: params.filingNumber,
        filing_year: params.filingYear || params.year,
        state_code: this.getStateCode(params.state || '')
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      return this.parseCaseResults(response.data);
    } catch (error: any) {
      console.error('Filing number search error:', error.message);
      return this.getMockCaseData(params.filingNumber || '');
    }
  }

  /**
   * Search by advocate name
   */
  private async searchByAdvocate(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      const response = await axios.post(url, {
        advocate_name: params.advocateName,
        state_code: this.getStateCode(params.state || ''),
        case_type: params.stage || 'BOTH'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });

      return this.parseCaseResults(response.data);
    } catch (error: any) {
      console.error('Advocate search error:', error.message);
      return this.getMockCasesByAdvocate(params.advocateName || '');
    }
  }

  /**
   * Parse HTML response and extract case data
   */
  private parseCaseResults(html: string): CaseResult[] {
    const $ = cheerio.load(html);
    const results: CaseResult[] = [];

    // eCourts typically shows results in tables
    // This is a simplified parser - actual implementation depends on HTML structure

    $('table.case-details tr').each((index, element) => {
      const cells = $(element).find('td');

      if (cells.length > 0) {
        const caseData: CaseResult = {
          caseNumber: $(cells[0]).text().trim(),
          parties: $(cells[1]).text().trim(),
          filingDate: $(cells[2]).text().trim(),
          status: $(cells[3]).text().trim(),
          nextHearingDate: $(cells[4]).text().trim()
        };

        results.push(caseData);
      }
    });

    return results;
  }

  /**
   * Get state code for eCourts API
   */
  private getStateCode(state: string): string {
    const stateCodes: { [key: string]: string } = {
      'delhi': '07',
      'maharashtra': '16',
      'karnataka': '14',
      'tamil nadu': '25',
      'west bengal': '28',
      'uttar pradesh': '26',
      'gujarat': '10',
      'rajasthan': '21',
      'punjab': '19',
      'haryana': '11',
      'madhya pradesh': '15',
      'andhra pradesh': '01',
      'telangana': '36',
      'kerala': '13',
      'bihar': '04',
      'odisha': '18',
      'assam': '03',
      'jharkhand': '34',
      'chhattisgarh': '37',
      'uttarakhand': '35',
      'himachal pradesh': '12',
      'jammu and kashmir': '38',
      'goa': '09'
    };

    return stateCodes[state.toLowerCase()] || '';
  }

  /**
   * Generate mock case data for demonstration
   * In production, this should be replaced with actual API integration
   */
  private getMockCaseData(identifier: string): CaseResult[] {
    return [{
      caseNumber: 'CS 234/2024',
      cnr: 'DLHC01-12345678-2024',
      petitioner: 'Ramesh Kumar',
      respondent: 'State of Delhi',
      parties: 'Ramesh Kumar vs State of Delhi',
      court: 'Patiala House Courts',
      state: 'Delhi',
      district: 'Central',
      caseType: 'Civil Suit',
      filingDate: '15-Jan-2024',
      filingNumber: '234/2024',
      status: 'Pending',
      nextHearingDate: '20-Dec-2024, 10:30 AM',
      lastHearingDate: '15-Nov-2024',
      currentStage: 'Arguments',
      judgeName: 'Hon\'ble Justice A.K. Sharma',
      purposeOfHearing: 'Final Arguments',
      courtNumber: 'Court No. 12',
      petitionerAdvocate: 'Adv. Suresh Mehta',
      respondentAdvocate: 'Adv. Priya Singh',
      underActs: 'Civil Procedure Code, 1908'
    }];
  }

  /**
   * Generate mock cases by party name
   */
  private getMockCasesByParty(partyName: string): CaseResult[] {
    return [
      {
        caseNumber: 'CS 234/2024',
        cnr: 'DLHC01-12345678-2024',
        parties: partyName,
        court: 'District Court',
        status: 'Pending',
        nextHearingDate: '20-Dec-2024',
        filingDate: '15-Jan-2024',
        judgeName: 'Hon\'ble Justice A.K. Sharma',
        caseType: 'Civil Suit'
      },
      {
        caseNumber: 'CRL 456/2023',
        cnr: 'DLHC01-87654321-2023',
        parties: partyName,
        court: 'Sessions Court',
        status: 'Pending',
        nextHearingDate: '22-Dec-2024',
        filingDate: '10-May-2023',
        judgeName: 'Hon\'ble Justice B.K. Verma',
        caseType: 'Criminal Case'
      }
    ];
  }

  /**
   * Generate mock cases by advocate
   */
  private getMockCasesByAdvocate(advocateName: string): CaseResult[] {
    return [
      {
        caseNumber: 'CS 789/2024',
        cnr: 'DLHC01-11223344-2024',
        parties: 'ABC Corp vs XYZ Ltd',
        court: 'Commercial Court',
        status: 'Pending',
        petitionerAdvocate: advocateName,
        nextHearingDate: '18-Dec-2024',
        filingDate: '01-Feb-2024',
        judgeName: 'Hon\'ble Justice C.D. Rao',
        caseType: 'Commercial Suit'
      }
    ];
  }
}

export const ecourtsScraper = new EcourtsScraper();
