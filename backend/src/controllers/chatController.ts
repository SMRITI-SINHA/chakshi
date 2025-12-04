import { Request, Response } from 'express';
import { conversationEngine } from '../services/conversationEngine';
import { ecourtsScraper } from '../services/ecourtsScraper';
import { kleopatraApi } from '../services/kleopatraApi';
import { ChatRequest, ChatMessage } from '../types';

export class ChatController {

  /**
   * Handle chat message from user
   */
  async handleMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, conversationHistory = [] } = req.body as ChatRequest;

      if (!message || message.trim().length === 0) {
        res.status(400).json({
          error: 'Message is required'
        });
        return;
      }

      // Process message through conversation engine
      const response = conversationEngine.processMessage(message, conversationHistory);

      // If action is 'search', fetch the data
      if (response.action === 'search') {
        let results: any[] = [];
        const errors: string[] = [];

        // Strategy: Try Kleopatra API first (more reliable), then eCourts scraping
        console.log('\n=== STARTING CASE SEARCH ===');
        console.log('Search parameters:', JSON.stringify(response.extracted, null, 2));

        // Method 1: Try Kleopatra API (Primary - Most Reliable)
        try {
          console.log('[Primary] Trying Kleopatra API...');
          results = await kleopatraApi.searchDistrictCourt(response.extracted!);

          if (results.length > 0) {
            console.log(`[Primary] ✅ Kleopatra API SUCCESS: Found ${results.length} case(s)`);
          } else {
            console.log('[Primary] ⚠️  Kleopatra API returned 0 results');
            errors.push('Kleopatra API: No cases found');
          }
        } catch (kleoError: any) {
          console.error('[Primary] ❌ Kleopatra API FAILED:', kleoError.message);
          errors.push(`Kleopatra API: ${kleoError.message}`);
        }

        // Method 2: Try eCourts scraping (Backup)
        if (results.length === 0) {
          try {
            console.log('[Backup] Trying eCourts website scraping...');
            results = await ecourtsScraper.searchCases(response.extracted!);

            if (results.length > 0) {
              console.log(`[Backup] ✅ eCourts SCRAPING SUCCESS: Found ${results.length} case(s)`);
            } else {
              console.log('[Backup] ⚠️  eCourts scraping returned 0 results');
              errors.push('eCourts: No cases found');
            }
          } catch (ecourtError: any) {
            console.error('[Backup] ❌ eCourts SCRAPING FAILED:', ecourtError.message);
            errors.push(`eCourts: ${ecourtError.message}`);
          }
        }

        console.log('=== SEARCH COMPLETE ===\n');

        // Format results or show error
        if (results.length > 0) {
          response.results = results;
          response.message = conversationEngine.formatResults(results, response.portal || 'casestatus');
        } else {
          response.results = [];
          response.message = `❌ **No cases found**\n\nI searched using:\n${errors.map(e => `• ${e}`).join('\n')}\n\n**This could mean:**\n• The CNR/case details might be incorrect\n• The case is in a different court or state\n• The case data is not yet available online\n• Both eCourts and Kleopatra API are experiencing issues\n\n**What you can do:**\n• Double-check the CNR format (e.g., DLHC01-12345678-2024)\n• Try searching with party names instead\n• Visit eCourts website directly: https://ecourts.gov.in\n• Try again in a few minutes`;
        }
      }

      res.json(response);
    } catch (error: any) {
      console.error('Chat controller error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong processing your request. Please try again.'
      });
    }
  }

  /**
   * Search cases directly (alternative endpoint)
   */
  async searchCases(req: Request, res: Response): Promise<void> {
    try {
      const { params } = req.body;

      if (!params) {
        res.status(400).json({
          error: 'Search parameters are required'
        });
        return;
      }

      let results: any[] = [];
      let source = '';

      // Try Kleopatra API first (more reliable)
      try {
        console.log('[API] Trying Kleopatra API...');
        results = await kleopatraApi.searchDistrictCourt(params);
        source = 'Kleopatra API';
        console.log(`[API] Kleopatra found ${results.length} cases`);
      } catch (kleoError: any) {
        console.error('[API] Kleopatra failed:', kleoError.message);
      }

      // If no results, try eCourts scraping
      if (results.length === 0) {
        try {
          console.log('[API] Trying eCourts scraping...');
          results = await ecourtsScraper.searchCases(params);
          source = 'eCourts India';
          console.log(`[API] eCourts found ${results.length} cases`);
        } catch (ecourtError: any) {
          console.error('[API] eCourts failed:', ecourtError.message);
        }
      }

      res.json({
        results,
        count: results.length,
        source: source || 'None',
        success: results.length > 0
      });
    } catch (error: any) {
      console.error('[API] Search error:', error);
      res.status(500).json({
        error: 'Search failed',
        message: error.message
      });
    }
  }

  /**
   * Get states list
   */
  async getStates(req: Request, res: Response): Promise<void> {
    try {
      const states = await kleopatraApi.getStates();
      res.json({ states });
    } catch (error: any) {
      console.error('Error fetching states:', error);
      res.status(500).json({
        error: 'Failed to fetch states',
        message: error.message
      });
    }
  }

  /**
   * Get districts for a state
   */
  async getDistricts(req: Request, res: Response): Promise<void> {
    try {
      const { stateId } = req.body;

      if (!stateId) {
        res.status(400).json({
          error: 'State ID is required'
        });
        return;
      }

      const districts = await kleopatraApi.getDistricts(stateId);
      res.json({ districts });
    } catch (error: any) {
      console.error('Error fetching districts:', error);
      res.status(500).json({
        error: 'Failed to fetch districts',
        message: error.message
      });
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'ok',
      message: 'Chakshi Law Chatbot API is running',
      timestamp: new Date().toISOString()
    });
  }
}

export const chatController = new ChatController();
