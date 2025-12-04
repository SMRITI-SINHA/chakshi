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
      console.log(`[eCourts] Searching for CNR: ${cnr}`);
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      // eCourts uses form-urlencoded POST requests
      const formData = new URLSearchParams();
      formData.append('cino', cnr);
      formData.append('search_by', 'cino');

      const response = await axios.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'Referer': this.BASE_URL
        },
        timeout: 20000,
        maxRedirects: 5
      });

      const results = this.parseCaseResults(response.data, cnr);

      if (results.length === 0) {
        console.log('[eCourts] No results found from eCourts scraping');
        throw new Error('No cases found on eCourts website');
      }

      console.log(`[eCourts] Found ${results.length} case(s)`);
      return results;
    } catch (error: any) {
      console.error('[eCourts] CNR search error:', error.message);
      throw error; // Throw error so Kleopatra API can be tried
    }
  }

  /**
   * Search by party name
   */
  private async searchByPartyName(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      console.log(`[eCourts] Searching for party: ${params.partyName}`);
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      const formData = new URLSearchParams();
      formData.append('party_name', params.partyName || '');
      formData.append('search_by', 'party');
      if (params.year) formData.append('year', params.year);

      const response = await axios.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': this.BASE_URL
        },
        timeout: 20000
      });

      const results = this.parseCaseResults(response.data);

      if (results.length === 0) {
        throw new Error('No cases found on eCourts website');
      }

      console.log(`[eCourts] Found ${results.length} case(s)`);
      return results;
    } catch (error: any) {
      console.error('[eCourts] Party name search error:', error.message);
      throw error;
    }
  }

  /**
   * Search by case number
   */
  private async searchByCaseNumber(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      console.log(`[eCourts] Searching for case number: ${params.caseNumber}`);
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      const formData = new URLSearchParams();
      formData.append('case_no', params.caseNumber || '');
      formData.append('search_by', 'case_no');
      if (params.year) formData.append('year', params.year);

      const response = await axios.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': this.BASE_URL
        },
        timeout: 20000
      });

      const results = this.parseCaseResults(response.data);

      if (results.length === 0) {
        throw new Error('No cases found on eCourts website');
      }

      return results;
    } catch (error: any) {
      console.error('[eCourts] Case number search error:', error.message);
      throw error;
    }
  }

  /**
   * Search by filing number
   */
  private async searchByFilingNumber(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      console.log(`[eCourts] Searching for filing number: ${params.filingNumber}`);
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      const formData = new URLSearchParams();
      formData.append('filing_no', params.filingNumber || '');
      formData.append('filing_year', params.filingYear || params.year || '');
      formData.append('search_by', 'filing');

      const response = await axios.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': this.BASE_URL
        },
        timeout: 20000
      });

      const results = this.parseCaseResults(response.data);

      if (results.length === 0) {
        throw new Error('No cases found on eCourts website');
      }

      return results;
    } catch (error: any) {
      console.error('[eCourts] Filing number search error:', error.message);
      throw error;
    }
  }

  /**
   * Search by advocate name
   */
  private async searchByAdvocate(params: ExtractedContext): Promise<CaseResult[]> {
    try {
      console.log(`[eCourts] Searching for advocate: ${params.advocateName}`);
      const url = `${this.BASE_URL}?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902`;

      const formData = new URLSearchParams();
      formData.append('advocate_name', params.advocateName || '');
      formData.append('search_by', 'advocate');

      const response = await axios.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': this.BASE_URL
        },
        timeout: 20000
      });

      const results = this.parseCaseResults(response.data);

      if (results.length === 0) {
        throw new Error('No cases found on eCourts website');
      }

      return results;
    } catch (error: any) {
      console.error('[eCourts] Advocate search error:', error.message);
      throw error;
    }
  }

  /**
   * Parse HTML response and extract case data
   */
  private parseCaseResults(html: string, cnr?: string): CaseResult[] {
    const $ = cheerio.load(html);
    const results: CaseResult[] = [];

    try {
      // eCourts shows case details in various table formats
      // Try multiple selectors to find case data

      // Method 1: Look for case details table
      $('table tr').each((index, element) => {
        const $row = $(element);
        const cells = $row.find('td');

        if (cells.length >= 2) {
          const label = $(cells[0]).text().trim().toLowerCase();
          const value = $(cells[1]).text().trim();

          // Build case object from row data
          if (label.includes('case') && label.includes('number')) {
            const caseData: CaseResult = {
              caseNumber: value,
              cnr: cnr
            };

            // Continue parsing related fields
            $row.parent().find('tr').each((_, r) => {
              const c = $(r).find('td');
              if (c.length >= 2) {
                const l = $(c[0]).text().trim().toLowerCase();
                const v = $(c[1]).text().trim();

                if (l.includes('petitioner') || l.includes('plaintiff')) {
                  caseData.petitioner = v;
                } else if (l.includes('respondent') || l.includes('defendant')) {
                  caseData.respondent = v;
                } else if (l.includes('filing') && l.includes('date')) {
                  caseData.filingDate = v;
                } else if (l.includes('next') && l.includes('hearing')) {
                  caseData.nextHearingDate = v;
                } else if (l.includes('court')) {
                  caseData.court = v;
                } else if (l.includes('status')) {
                  caseData.status = v;
                } else if (l.includes('judge')) {
                  caseData.judgeName = v;
                } else if (l.includes('stage')) {
                  caseData.currentStage = v;
                } else if (l.includes('case') && l.includes('type')) {
                  caseData.caseType = v;
                }
              }
            });

            if (caseData.caseNumber) {
              caseData.parties = `${caseData.petitioner || ''} vs ${caseData.respondent || ''}`.trim();
              results.push(caseData);
            }
          }
        }
      });

      // Method 2: Look for specific case info divs
      if (results.length === 0) {
        const caseInfo: CaseResult = { cnr };

        $('.case-info, .caseinfo, #caseinfo').find('div, p, span').each((_, el) => {
          const text = $(el).text().trim();
          const lower = text.toLowerCase();

          if (lower.includes('case number:')) {
            caseInfo.caseNumber = text.split(':')[1]?.trim();
          } else if (lower.includes('petitioner:')) {
            caseInfo.petitioner = text.split(':')[1]?.trim();
          } else if (lower.includes('respondent:')) {
            caseInfo.respondent = text.split(':')[1]?.trim();
          }
        });

        if (caseInfo.caseNumber) {
          results.push(caseInfo);
        }
      }

      console.log(`[eCourts Parser] Extracted ${results.length} cases from HTML`);
    } catch (parseError) {
      console.error('[eCourts Parser] Error parsing HTML:', parseError);
    }

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

}

export const ecourtsScraper = new EcourtsScraper();
