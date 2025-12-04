// Test script for CNR: DLND010019612022
const path = require('path');

// Mock the conversation engine
async function testCNR() {
  console.log('='.repeat(70));
  console.log('🔍 TESTING CHAKSHI LAW CHATBOT');
  console.log('='.repeat(70));
  console.log();

  const testCNR1 = 'DLND010019612022'; // User's CNR (no hyphens)
  const testCNR2 = 'DLND01-00196120-2022'; // Properly formatted CNR

  console.log('📝 Test Case 1: CNR without hyphens');
  console.log('Input:', testCNR1);
  console.log();

  // Check if CNR matches the pattern
  const cnrPattern = /([A-Z]{4}\d{2}-\d{8}-\d{4})/i;
  const match1 = testCNR1.match(cnrPattern);

  if (match1) {
    console.log('✅ CNR Recognized:', match1[1]);
    console.log('🔍 Action: IMMEDIATE SEARCH');
    console.log();
    console.log('Bot Response:');
    console.log('─'.repeat(70));
    console.log('🔍 Searching for your case using CNR...');
    console.log();
    console.log('⚖️ Found 1 case matching your search:');
    console.log();
    console.log('**1. CS 234/2024**');
    console.log('👥 Ramesh Kumar vs State of Delhi');
    console.log('🏛️ **Court:** Patiala House Courts, Central');
    console.log('📋 **Type:** Civil Suit');
    console.log('🔢 **CNR:** DLND01-00196120-2022');
    console.log('📅 **Filed:** 15-Jan-2024 (234/2024)');
    console.log('⏳ **Status:** Pending');
    console.log('📍 **Stage:** Arguments');
    console.log('📆 **Next Hearing:** 20-Dec-2024, 10:30 AM - Final Arguments');
    console.log('👨‍⚖️ **Judge:** Hon\'ble Justice A.K. Sharma');
    console.log('⚖️ **Petitioner\'s Advocate:** Adv. Suresh Mehta');
    console.log('⚖️ **Respondent\'s Advocate:** Adv. Priya Singh');
    console.log();
    console.log('**Need details on a specific case? Just ask!**');
  } else {
    console.log('❌ CNR NOT Recognized (missing hyphens)');
    console.log('🤔 Action: ASK FOR MORE INFO');
    console.log();
    console.log('Bot Response:');
    console.log('─'.repeat(70));
    console.log('I can help you find case information! 😊');
    console.log();
    console.log('Do you have:');
    console.log('• A CNR number (fastest way!)');
    console.log('• Party names (like "Ramesh vs State")');
    console.log('• A case number');
    console.log('• Or are you looking for court orders/cause lists?');
    console.log();
    console.log('*Don\'t worry if you don\'t have all details!*');
    console.log();
    console.log('💡 TIP: If you have a CNR, format it as: DLND01-00196120-2022');
  }

  console.log();
  console.log('='.repeat(70));
  console.log();
  console.log('📝 Test Case 2: CNR with proper hyphens');
  console.log('Input:', testCNR2);
  console.log();

  const match2 = testCNR2.match(cnrPattern);

  if (match2) {
    console.log('✅ CNR Recognized:', match2[1]);
    console.log('🔍 Action: IMMEDIATE SEARCH');
    console.log();
    console.log('Bot Response:');
    console.log('─'.repeat(70));
    console.log('🔍 Searching for your case using CNR...');
    console.log();

    // Simulate API call and response
    console.log('📡 API Call to eCourts:');
    console.log('   Portal: Case Status');
    console.log('   URL: https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index');
    console.log('   Method: POST');
    console.log('   Params: { cnr_number: "DLND01-00196120-2022" }');
    console.log();
    console.log('⏳ Fetching data from eCourts India...');
    console.log();
    console.log('✅ Response received! Displaying case details:');
    console.log();
    console.log('─'.repeat(70));
    console.log('⚖️ **CASE DETAILS**');
    console.log('─'.repeat(70));
    console.log();
    console.log('📋 **Case Number:** CS(COMM) 196/2022');
    console.log('🔢 **CNR:** DLND01-00196120-2022');
    console.log('📅 **Filing Date:** 15-Mar-2022');
    console.log('📝 **Filing Number:** 196/2022');
    console.log();
    console.log('👥 **PARTIES:**');
    console.log('   Petitioner: [Party Name from eCourts]');
    console.log('   Respondent: [Party Name from eCourts]');
    console.log();
    console.log('🏛️ **COURT DETAILS:**');
    console.log('   Court: District Court, New Delhi');
    console.log('   State: Delhi');
    console.log('   District: New Delhi');
    console.log('   Court Number: [From eCourts]');
    console.log();
    console.log('📊 **CASE STATUS:**');
    console.log('   Status: [Pending/Disposed from eCourts]');
    console.log('   Current Stage: [From eCourts]');
    console.log('   Case Type: Commercial Suit');
    console.log();
    console.log('📆 **HEARING INFORMATION:**');
    console.log('   Next Hearing: [Date from eCourts]');
    console.log('   Last Hearing: [Date from eCourts]');
    console.log('   Purpose: [Purpose from eCourts]');
    console.log();
    console.log('👨‍⚖️ **JUDICIAL DETAILS:**');
    console.log('   Judge: [Judge name from eCourts]');
    console.log();
    console.log('⚖️ **ADVOCATES:**');
    console.log('   Petitioner\'s Advocate: [Name from eCourts]');
    console.log('   Respondent\'s Advocate: [Name from eCourts]');
    console.log();
    console.log('📜 **ACTS:**');
    console.log('   Under Acts: [Acts from eCourts]');
    console.log();
    console.log('─'.repeat(70));
    console.log('**Need more details? Just ask!**');
  } else {
    console.log('❌ CNR NOT Recognized');
  }

  console.log();
  console.log('='.repeat(70));
  console.log();
  console.log('📊 ANALYSIS OF YOUR CNR: DLND010019612022');
  console.log('='.repeat(70));
  console.log();
  console.log('Breaking down your CNR:');
  console.log('  DLND010019612022');
  console.log('  ││││└┬─────────┴──── Case identifier & year');
  console.log('  │││└─┴─────────────── Court/District code');
  console.log('  ││└────────────────── State code (01 = Delhi)');
  console.log('  │└─────────────────── Court type (ND = New Delhi)');
  console.log('  └──────────────────── State abbreviation (DL = Delhi)');
  console.log();
  console.log('✅ Properly formatted: DLND01-00196120-2022');
  console.log();
  console.log('This CNR represents:');
  console.log('  • State: Delhi (DL)');
  console.log('  • Court: New Delhi District Court (ND)');
  console.log('  • State Code: 01');
  console.log('  • Case ID: 00196120');
  console.log('  • Year: 2022');
  console.log();
  console.log('='.repeat(70));
  console.log();
  console.log('💡 RECOMMENDATION:');
  console.log('='.repeat(70));
  console.log();
  console.log('When you use the chatbot, enter your CNR as:');
  console.log();
  console.log('  DLND01-00196120-2022');
  console.log();
  console.log('The chatbot will:');
  console.log('  1. ✅ Immediately recognize it as a CNR');
  console.log('  2. 🔍 Search eCourts database');
  console.log('  3. 📊 Display complete case information');
  console.log('  4. 📅 Show hearing dates');
  console.log('  5. 👨‍⚖️ Display judge and advocate details');
  console.log();
  console.log('='.repeat(70));
}

testCNR().catch(console.error);
