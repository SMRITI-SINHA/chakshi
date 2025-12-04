// Live test for CNR: DLND01-00196120-2022
const axios = require('axios');

const CNR = 'DLND01-00196120-2022';
const KLEOPATRA_API = 'https://court-api.kleopatra.io/api';

console.log('='.repeat(80));
console.log('🔍 LIVE SEARCH TEST FOR CHAKSHI LAW CHATBOT');
console.log('='.repeat(80));
console.log();
console.log(`📋 CNR: ${CNR}`);
console.log(`🌐 Testing with REAL APIs...`);
console.log();
console.log('='.repeat(80));
console.log();

async function testKleopatraAPI() {
    console.log('Method 1: Kleopatra Court API (Primary Source)');
    console.log('─'.repeat(80));

    try {
        console.log('[Kleopatra] Sending request...');
        console.log(`[Kleopatra] Endpoint: ${KLEOPATRA_API}/core/live/district-court/case`);
        console.log(`[Kleopatra] CNR: ${CNR}`);
        console.log();

        const response = await axios.post(
            `${KLEOPATRA_API}/core/live/district-court/case`,
            { cnr: CNR },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 15000
            }
        );

        console.log('[Kleopatra] ✅ SUCCESS! Response received:');
        console.log();
        console.log('─'.repeat(80));
        console.log('📊 CASE DATA FROM KLEOPATRA API:');
        console.log('─'.repeat(80));
        console.log(JSON.stringify(response.data, null, 2));
        console.log();

        return { success: true, data: response.data, source: 'Kleopatra API' };
    } catch (error) {
        console.log('[Kleopatra] ❌ FAILED');
        console.log(`[Kleopatra] Error: ${error.message}`);

        if (error.response) {
            console.log(`[Kleopatra] Status: ${error.response.status}`);
            console.log(`[Kleopatra] Response: ${JSON.stringify(error.response.data)}`);
        }

        return { success: false, error: error.message };
    }
}

async function testEcourtsWebsite() {
    console.log();
    console.log('='.repeat(80));
    console.log();
    console.log('Method 2: eCourts India Website (Backup Source)');
    console.log('─'.repeat(80));

    try {
        const ECOURTS_URL = 'https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index&app_token=fe40f02ff67de30672de0a29c0241afbad5114cf8e28497b7a048072902e2902';

        console.log('[eCourts] Sending request...');
        console.log(`[eCourts] URL: ${ECOURTS_URL}`);
        console.log(`[eCourts] CNR: ${CNR}`);
        console.log();

        const formData = new URLSearchParams();
        formData.append('cino', CNR);
        formData.append('search_by', 'cino');

        const response = await axios.post(ECOURTS_URL, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml',
                'Referer': 'https://services.ecourts.gov.in/ecourtindia_v6/'
            },
            timeout: 20000,
            maxRedirects: 5
        });

        console.log('[eCourts] ✅ SUCCESS! Response received');
        console.log('[eCourts] Response length:', response.data.length, 'bytes');
        console.log();

        // Try to parse some basic info from HTML
        if (response.data.includes('Case Number') || response.data.includes('CNR')) {
            console.log('[eCourts] 📄 HTML response contains case data');
            console.log('[eCourts] ℹ️  Full HTML parsing would be done by Cheerio in the actual app');
        } else {
            console.log('[eCourts] ⚠️  Response might not contain case data (could be CAPTCHA or error page)');
        }

        return { success: true, data: 'HTML response received', source: 'eCourts Website' };
    } catch (error) {
        console.log('[eCourts] ❌ FAILED');
        console.log(`[eCourts] Error: ${error.message}`);

        if (error.response) {
            console.log(`[eCourts] Status: ${error.response.status}`);
        }

        return { success: false, error: error.message };
    }
}

async function runTest() {
    console.log('🚀 Starting live search...');
    console.log();
    console.log('='.repeat(80));
    console.log();

    // Test Kleopatra API first
    const kleopatraResult = await testKleopatraAPI();

    // If Kleopatra fails, try eCourts
    if (!kleopatraResult.success) {
        const ecourtsResult = await testEcourtsWebsite();

        console.log();
        console.log('='.repeat(80));
        console.log();

        if (!ecourtsResult.success) {
            console.log('❌ FINAL RESULT: Both sources failed');
            console.log();
            console.log('Reasons:');
            console.log(`  • Kleopatra API: ${kleopatraResult.error}`);
            console.log(`  • eCourts Website: ${ecourtsResult.error}`);
            console.log();
            console.log('This could mean:');
            console.log('  • The CNR might not exist in the databases yet');
            console.log('  • Network/firewall restrictions');
            console.log('  • APIs are temporarily down');
        } else {
            console.log('✅ FINAL RESULT: Found data from eCourts Website');
        }
    } else {
        console.log();
        console.log('='.repeat(80));
        console.log();
        console.log('✅ FINAL RESULT: Found data from Kleopatra API');
        console.log();
        console.log('📋 FORMATTED CASE INFORMATION:');
        console.log('─'.repeat(80));

        const caseData = kleopatraResult.data;

        if (caseData) {
            console.log();
            console.log('⚖️  CASE DETAILS:');
            console.log(`    Case Number: ${caseData.caseNumber || caseData.case_number || 'N/A'}`);
            console.log(`    CNR: ${caseData.cnr || caseData.cino || CNR}`);
            console.log();
            console.log('👥 PARTIES:');
            console.log(`    Petitioner: ${caseData.petitioner || 'N/A'}`);
            console.log(`    Respondent: ${caseData.respondent || 'N/A'}`);
            console.log();
            console.log('🏛️  COURT DETAILS:');
            console.log(`    Court: ${caseData.court || caseData.courtName || 'N/A'}`);
            console.log(`    State: ${caseData.state || 'Delhi'}`);
            console.log(`    District: ${caseData.district || 'New Delhi'}`);
            console.log();
            console.log('📊 CASE STATUS:');
            console.log(`    Status: ${caseData.status || 'N/A'}`);
            console.log(`    Case Type: ${caseData.caseType || caseData.case_type || 'N/A'}`);
            console.log(`    Filing Date: ${caseData.filingDate || caseData.filing_date || 'N/A'}`);
            console.log();
            console.log('📅 HEARING INFORMATION:');
            console.log(`    Next Hearing: ${caseData.nextHearingDate || caseData.next_hearing_date || 'N/A'}`);
            console.log(`    Last Hearing: ${caseData.lastHearingDate || caseData.last_hearing_date || 'N/A'}`);
            console.log();
            console.log('👨‍⚖️  JUDICIAL INFO:');
            console.log(`    Judge: ${caseData.judgeName || caseData.judge || 'N/A'}`);
            console.log();
            console.log('⚖️  ADVOCATES:');
            console.log(`    Petitioner's Advocate: ${caseData.petitionerAdvocate || 'N/A'}`);
            console.log(`    Respondent's Advocate: ${caseData.respondentAdvocate || 'N/A'}`);
            console.log();
        }
    }

    console.log();
    console.log('='.repeat(80));
    console.log('🏁 TEST COMPLETE');
    console.log('='.repeat(80));
}

// Run the test
runTest().catch(error => {
    console.error();
    console.error('💥 Unexpected error during test:');
    console.error(error);
    process.exit(1);
});
