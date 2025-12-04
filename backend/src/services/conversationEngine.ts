import { ChatMessage, ExtractedContext, ChatbotResponse, CaseStage } from '../types';
import { inferStateFromText, findStateByName, inferPortalFromQuery } from './stateMapping';

const PORTAL_URLS = {
  casestatus: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902',
  courtorder: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=courtorder/index&app_token=29fc79f8611835ba11890376f568411ea3cc2382cb4c9a97d2d0faa4ade7a4cb',
  causelist: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=cause_list/index&app_token=f712f64fe75c9dffa6679565ea58ed1a765f453988caeb2278ea344d89618c26',
  caveat: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=caveat_search/index&app_token=f811d37a5e7da5be162b1aabbb00362e46b5f05a492660d023500110a40c12be',
  home: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=home/index&app_token=338bb4f4da01b48f528ded9e49fe63c61b518d8f5fc0ac6e7ffa8af103ca9813',
  location: 'https://services.ecourts.gov.in/ecourtindia_v6/?p=location/index&app_token=b2a0f285e9a37bbcf13ad9623887e9721a7612db3185feca01192fdb85452068'
};

export class ConversationEngine {

  /**
   * Process user message and determine next action
   */
  processMessage(
    message: string,
    conversationHistory: ChatMessage[]
  ): ChatbotResponse {

    // Extract context from current message
    const extracted = this.extractContext(message, conversationHistory);

    // Check if we have CNR - immediate search
    if (extracted.cnr) {
      return {
        action: 'search',
        message: '🔍 Searching for your case using CNR...',
        extracted,
        portal: 'casestatus',
        portalURL: PORTAL_URLS.casestatus,
        searchParams: { cnr: extracted.cnr }
      };
    }

    // Check if we have enough info to search
    if (this.canSearch(extracted)) {
      const portal = extracted.portal || 'casestatus';
      return {
        action: 'search',
        message: `🔍 Searching for cases in ${extracted.state || 'eCourts'}...`,
        extracted,
        portal: portal as any,
        portalURL: PORTAL_URLS[portal as keyof typeof PORTAL_URLS],
        searchParams: extracted
      };
    }

    // Need more information - ask intelligent questions
    return this.askNextQuestion(extracted, message);
  }

  /**
   * Extract context from user message
   */
  private extractContext(
    message: string,
    history: ChatMessage[]
  ): ExtractedContext {

    const context: ExtractedContext = {};
    const lowerMessage = message.toLowerCase();

    // Get context from previous messages
    const previousContext = this.getPreviousContext(history);
    Object.assign(context, previousContext);

    // Extract CNR (format: XXXX01-12345678-2024)
    const cnrMatch = message.match(/([A-Z]{4}\d{2}-\d{8}-\d{4})/i);
    if (cnrMatch) {
      context.cnr = cnrMatch[1].toUpperCase();
    }

    // Extract state from text
    const inferredState = inferStateFromText(message);
    if (inferredState) {
      context.state = inferredState.name.toLowerCase();
    }

    // Extract party names (look for "vs", "versus", "v.")
    const partyMatch = message.match(/([A-Za-z\s]+)\s+(?:vs|versus|v\.)\s+([A-Za-z\s]+)/i);
    if (partyMatch) {
      context.partyName = partyMatch[0].trim();
    }

    // Extract case number
    const caseNumberMatch = message.match(/case\s+(?:no\.?|number)?\s*:?\s*([A-Z0-9\/\-]+)/i);
    if (caseNumberMatch) {
      context.caseNumber = caseNumberMatch[1];
    }

    // Extract filing number
    const filingMatch = message.match(/filing\s+(?:no\.?|number)?\s*:?\s*(\d+)/i);
    if (filingMatch) {
      context.filingNumber = filingMatch[1];
    }

    // Extract year
    const yearMatch = message.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      context.year = yearMatch[0];
    }

    // Extract advocate name
    const advocateMatch = message.match(/advocate\s+([A-Za-z\s]+)/i);
    if (advocateMatch) {
      context.advocateName = advocateMatch[1].trim();
    }

    // Extract stage (pending/disposed)
    if (lowerMessage.includes('pending')) {
      context.stage = 'PENDING';
    } else if (lowerMessage.includes('disposed')) {
      context.stage = 'DISPOSED';
    }

    // Infer portal
    const portal = inferPortalFromQuery(message);
    if (portal) {
      context.portal = portal as any;
    }

    // Extract district if mentioned
    const districtMatch = message.match(/(?:district|court)\s+([A-Za-z\s]+)/i);
    if (districtMatch && !context.state) {
      context.district = districtMatch[1].trim();
    }

    // Handle "all" or "search all"
    if (lowerMessage.includes('all') || lowerMessage.includes('search all')) {
      context.district = 'all';
    }

    return context;
  }

  /**
   * Get context from conversation history
   */
  private getPreviousContext(history: ChatMessage[]): ExtractedContext {
    const context: ExtractedContext = {};

    // Look through previous messages for context
    for (let i = history.length - 1; i >= 0 && i >= history.length - 5; i--) {
      const msg = history[i];
      if (msg.role === 'user') {
        const extracted = this.extractContext(msg.content, []);

        // Merge context (don't override newer info)
        if (!context.state && extracted.state) context.state = extracted.state;
        if (!context.district && extracted.district) context.district = extracted.district;
        if (!context.partyName && extracted.partyName) context.partyName = extracted.partyName;
        if (!context.portal && extracted.portal) context.portal = extracted.portal;
        if (!context.year && extracted.year) context.year = extracted.year;
      }
    }

    return context;
  }

  /**
   * Check if we have enough information to perform a search
   */
  private canSearch(context: ExtractedContext): boolean {
    // CNR is always sufficient
    if (context.cnr) return true;

    // For party name search, we need at least state
    if (context.partyName && context.state) return true;

    // For case number search, we need state
    if (context.caseNumber && context.state) return true;

    // For filing number, we need state and year
    if (context.filingNumber && context.state && context.year) return true;

    // For advocate search, we need state
    if (context.advocateName && context.state) return true;

    // For court orders, need state
    if (context.portal === 'courtorder' && context.state) return true;

    // For cause list, need state and potentially date
    if (context.portal === 'causelist' && context.state) return true;

    return false;
  }

  /**
   * Ask next intelligent question
   */
  private askNextQuestion(context: ExtractedContext, message: string): ChatbotResponse {

    // First check: Do we know what they want to do?
    if (!context.partyName && !context.caseNumber && !context.cnr &&
        !context.advocateName && !context.portal) {
      return {
        action: 'ask',
        message: "I can help you find case information! 😊\n\nDo you have:\n• A CNR number (fastest way!)\n• Party names (like \"Ramesh vs State\")\n• A case number\n• Or are you looking for court orders/cause lists?\n\n*Don't worry if you don't have all details!*",
        extracted: context
      };
    }

    // We know what they want, but need state/location
    if (!context.state) {
      if (context.partyName) {
        return {
          action: 'ask',
          message: `Got it! I'll search for cases with **${context.partyName}**.\n\nWhich state should I search in? (e.g., Delhi, Maharashtra, Karnataka)`,
          extracted: context
        };
      }

      return {
        action: 'ask',
        message: "Which state or court should I search in?\n\n*Examples: Delhi, Bombay High Court, Bangalore, etc.*",
        extracted: context
      };
    }

    // We have state, but might need district
    if (context.state && !context.district && context.partyName) {
      return {
        action: 'ask',
        message: `Perfect! Searching in **${context.state}**.\n\nDo you know the district or court? Or should I search all ${context.state} courts?\n\n*Just say \"all\" or \"search all\" to check everywhere!*`,
        extracted: context
      };
    }

    // Need more specific info
    if (context.filingNumber && !context.year) {
      return {
        action: 'ask',
        message: "What year was the case filed? This helps narrow down the search.",
        extracted: context
      };
    }

    // Default: we have some info, confirm search
    return {
      action: 'search',
      message: `🔍 Searching with the information you provided...`,
      extracted: context,
      portal: context.portal || 'casestatus',
      portalURL: PORTAL_URLS[context.portal as keyof typeof PORTAL_URLS || 'casestatus'],
      searchParams: context
    };
  }

  /**
   * Format search results for display
   */
  formatResults(results: any[], portal: string): string {

    const count = results.length;

    // No results
    if (count === 0) {
      return `I couldn't find any cases matching your search. This could be because:

• The case is in a different court or state
• Party names might be spelled differently
• The case is very recent or very old
• eCourts website is currently updating (happens often)

Would you like to:
• Try searching in a different state or court?
• Search using a case number or CNR?`;
    }

    // 1-5 cases - show full details
    if (count <= 5) {
      let response = `⚖️ Found **${count}** case${count > 1 ? 's' : ''} matching your search:\n\n`;

      results.forEach((caseData, index) => {
        response += this.formatSingleCase(caseData, index + 1);
        response += '\n---\n\n';
      });

      response += '**Need details on a specific case? Just ask!**';
      return response;
    }

    // 6-10 cases - slightly condensed
    if (count <= 10) {
      let response = `⚖️ Found **${count}** cases matching your search:\n\n`;

      results.forEach((caseData, index) => {
        response += this.formatCondensedCase(caseData, index + 1);
      });

      response += '\n\n**Need details on a specific case? Just ask!**';
      return response;
    }

    // More than 10 - show summary
    let response = `⚖️ Found **${count}** cases! Here are the first 10:\n\n`;

    results.slice(0, 10).forEach((caseData, index) => {
      response += this.formatCondensedCase(caseData, index + 1);
    });

    response += `\n\n**Showing 10 of ${count} cases. Provide more details to narrow down the search.**`;

    return response;
  }

  /**
   * Format single case with full details
   */
  private formatSingleCase(caseData: any, index: number): string {
    let formatted = `**${index}. ${caseData.caseNumber || 'Case'}**\n`;

    if (caseData.parties || (caseData.petitioner && caseData.respondent)) {
      formatted += `👥 ${caseData.parties || `${caseData.petitioner} vs ${caseData.respondent}`}\n`;
    }

    if (caseData.court) {
      formatted += `🏛️ **Court:** ${caseData.court}`;
      if (caseData.district) formatted += `, ${caseData.district}`;
      formatted += '\n';
    }

    if (caseData.caseType) {
      formatted += `📋 **Type:** ${caseData.caseType}\n`;
    }

    if (caseData.cnr) {
      formatted += `🔢 **CNR:** ${caseData.cnr}\n`;
    }

    if (caseData.filingDate) {
      formatted += `📅 **Filed:** ${caseData.filingDate}`;
      if (caseData.filingNumber) formatted += ` (${caseData.filingNumber})`;
      formatted += '\n';
    }

    if (caseData.status) {
      const statusEmoji = caseData.status.toLowerCase().includes('pending') ? '⏳' : '✅';
      formatted += `${statusEmoji} **Status:** ${caseData.status}\n`;
    }

    if (caseData.currentStage) {
      formatted += `📍 **Stage:** ${caseData.currentStage}\n`;
    }

    if (caseData.nextHearingDate) {
      formatted += `📆 **Next Hearing:** ${caseData.nextHearingDate}`;
      if (caseData.purposeOfHearing) formatted += ` - ${caseData.purposeOfHearing}`;
      formatted += '\n';
    }

    if (caseData.judgeName) {
      formatted += `👨‍⚖️ **Judge:** ${caseData.judgeName}\n`;
    }

    if (caseData.petitionerAdvocate) {
      formatted += `⚖️ **Petitioner's Advocate:** ${caseData.petitionerAdvocate}\n`;
    }

    if (caseData.respondentAdvocate) {
      formatted += `⚖️ **Respondent's Advocate:** ${caseData.respondentAdvocate}\n`;
    }

    return formatted;
  }

  /**
   * Format condensed case info
   */
  private formatCondensedCase(caseData: any, index: number): string {
    let formatted = `**${index}. ${caseData.caseNumber || 'Case'}**`;

    if (caseData.parties) {
      formatted += ` - ${caseData.parties}`;
    }
    formatted += '\n';

    formatted += `   🏛️ ${caseData.court || 'Court'}`;
    if (caseData.district) formatted += `, ${caseData.district}`;
    formatted += ` | Status: ${caseData.status || 'Unknown'}\n`;

    if (caseData.nextHearingDate) {
      formatted += `   📅 Next: ${caseData.nextHearingDate}`;
      if (caseData.judgeName) formatted += ` | Judge: ${caseData.judgeName}`;
      formatted += '\n';
    }

    formatted += '\n';
    return formatted;
  }
}

export const conversationEngine = new ConversationEngine();
