// State and District mapping with smart inference
export interface StateInfo {
  id: string;
  name: string;
  code: string;
  keywords: string[];
}

export const STATE_MAPPINGS: StateInfo[] = [
  {
    id: '1',
    name: 'Delhi',
    code: 'DL',
    keywords: ['delhi', 'patiala house', 'tis hazari', 'saket', 'dwarka', 'rohini', 'karkardooma']
  },
  {
    id: '2',
    name: 'Maharashtra',
    code: 'MH',
    keywords: ['maharashtra', 'bombay', 'mumbai', 'pune', 'nagpur', 'aurangabad', 'nashik']
  },
  {
    id: '3',
    name: 'Karnataka',
    code: 'KA',
    keywords: ['karnataka', 'bangalore', 'bengaluru', 'mysore', 'mangalore', 'hubli']
  },
  {
    id: '4',
    name: 'Tamil Nadu',
    code: 'TN',
    keywords: ['tamil nadu', 'chennai', 'madras', 'coimbatore', 'madurai', 'salem']
  },
  {
    id: '5',
    name: 'West Bengal',
    code: 'WB',
    keywords: ['west bengal', 'kolkata', 'calcutta', 'howrah', 'siliguri', 'durgapur']
  },
  {
    id: '6',
    name: 'Uttar Pradesh',
    code: 'UP',
    keywords: ['uttar pradesh', 'lucknow', 'allahabad', 'prayagraj', 'varanasi', 'kanpur', 'agra', 'noida', 'ghaziabad']
  },
  {
    id: '7',
    name: 'Gujarat',
    code: 'GJ',
    keywords: ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar']
  },
  {
    id: '8',
    name: 'Rajasthan',
    code: 'RJ',
    keywords: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'kota', 'ajmer']
  },
  {
    id: '9',
    name: 'Punjab',
    code: 'PB',
    keywords: ['punjab', 'chandigarh', 'ludhiana', 'amritsar', 'jalandhar', 'patiala']
  },
  {
    id: '10',
    name: 'Haryana',
    code: 'HR',
    keywords: ['haryana', 'gurgaon', 'gurugram', 'faridabad', 'panipat', 'ambala']
  },
  {
    id: '11',
    name: 'Madhya Pradesh',
    code: 'MP',
    keywords: ['madhya pradesh', 'bhopal', 'indore', 'jabalpur', 'gwalior', 'ujjain']
  },
  {
    id: '12',
    name: 'Andhra Pradesh',
    code: 'AP',
    keywords: ['andhra pradesh', 'hyderabad', 'vijayawada', 'visakhapatnam', 'guntur', 'tirupati']
  },
  {
    id: '13',
    name: 'Telangana',
    code: 'TS',
    keywords: ['telangana', 'hyderabad', 'warangal', 'nizamabad', 'karimnagar']
  },
  {
    id: '14',
    name: 'Kerala',
    code: 'KL',
    keywords: ['kerala', 'thiruvananthapuram', 'kochi', 'cochin', 'kozhikode', 'calicut']
  },
  {
    id: '15',
    name: 'Bihar',
    code: 'BR',
    keywords: ['bihar', 'patna', 'gaya', 'bhagalpur', 'muzaffarpur']
  },
  {
    id: '16',
    name: 'Odisha',
    code: 'OR',
    keywords: ['odisha', 'orissa', 'bhubaneswar', 'cuttack', 'rourkela', 'puri']
  },
  {
    id: '17',
    name: 'Assam',
    code: 'AS',
    keywords: ['assam', 'guwahati', 'gauhati', 'silchar', 'dibrugarh']
  },
  {
    id: '18',
    name: 'Jharkhand',
    code: 'JH',
    keywords: ['jharkhand', 'ranchi', 'jamshedpur', 'dhanbad', 'bokaro']
  },
  {
    id: '19',
    name: 'Chhattisgarh',
    code: 'CG',
    keywords: ['chhattisgarh', 'raipur', 'bilaspur', 'durg', 'bhilai']
  },
  {
    id: '20',
    name: 'Uttarakhand',
    code: 'UK',
    keywords: ['uttarakhand', 'dehradun', 'haridwar', 'roorkee', 'haldwani']
  },
  {
    id: '21',
    name: 'Himachal Pradesh',
    code: 'HP',
    keywords: ['himachal pradesh', 'shimla', 'dharamshala', 'manali', 'kullu']
  },
  {
    id: '22',
    name: 'Jammu and Kashmir',
    code: 'JK',
    keywords: ['jammu', 'kashmir', 'srinagar', 'jammu and kashmir']
  },
  {
    id: '23',
    name: 'Goa',
    code: 'GA',
    keywords: ['goa', 'panaji', 'margao', 'vasco']
  }
];

export function inferStateFromText(text: string): StateInfo | null {
  const lowerText = text.toLowerCase();

  for (const state of STATE_MAPPINGS) {
    for (const keyword of state.keywords) {
      if (lowerText.includes(keyword)) {
        return state;
      }
    }
  }

  return null;
}

export function findStateByName(name: string): StateInfo | null {
  const lowerName = name.toLowerCase();
  return STATE_MAPPINGS.find(s =>
    s.name.toLowerCase() === lowerName ||
    s.code.toLowerCase() === lowerName ||
    s.keywords.some(k => k === lowerName)
  ) || null;
}

// Portal determination from query
export function inferPortalFromQuery(query: string): string | null {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('order') || lowerQuery.includes('judgment')) {
    return 'courtorder';
  }

  if (lowerQuery.includes('cause list') || lowerQuery.includes('tomorrow') ||
      lowerQuery.includes('today') || lowerQuery.includes('hearing date')) {
    return 'causelist';
  }

  if (lowerQuery.includes('caveat')) {
    return 'caveat';
  }

  if (lowerQuery.includes('location') || lowerQuery.includes('court address')) {
    return 'location';
  }

  // Default to case status
  return 'casestatus';
}
