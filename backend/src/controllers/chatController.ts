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
        try {
          // Try eCourts first
          let results = await ecourtsScraper.searchCases(response.extracted!);

          // If no results and we have CNR/party name, try Kleopatra API as backup
          if (results.length === 0 && (response.extracted?.cnr || response.extracted?.partyName)) {
            console.log('Trying Kleopatra API as backup...');
            try {
              results = await kleopatraApi.searchDistrictCourt(response.extracted!);
            } catch (kleoError) {
              console.log('Kleopatra API also failed, using eCourts results');
            }
          }

          response.results = results;
          response.message = conversationEngine.formatResults(results, response.portal || 'casestatus');
        } catch (searchError: any) {
          console.error('Search error:', searchError);
          response.message = `❌ Sorry, I encountered an error while searching:\n\n${searchError.message}\n\nThe eCourts website might be temporarily down. Would you like to try again or search with different parameters?`;
          response.results = [];
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

      // Try eCourts first
      let results = await ecourtsScraper.searchCases(params);

      // If no results, try Kleopatra API
      if (results.length === 0) {
        try {
          results = await kleopatraApi.searchDistrictCourt(params);
        } catch (kleoError) {
          console.log('Kleopatra API failed');
        }
      }

      res.json({
        results,
        count: results.length
      });
    } catch (error: any) {
      console.error('Search error:', error);
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
