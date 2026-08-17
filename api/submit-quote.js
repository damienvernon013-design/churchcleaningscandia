const CRM_PUSH_LEAD_URL = 'https://thequotemasters.com/crm_api/api.php?action=push_lead';
const INDUSTRY_CODE = 23; // church / faith facility cleaning
const ZIP_SCANDIA_MN = '55073';

function splitName(fullName) {
  const trimmed = fullName.trim().replace(/\s+/g, ' ');
  const parts = trimmed.split(' ');
  if (parts.length === 1) return { first_name: parts[0], last_name: '' };
  return { first_name: parts.slice(0, -1).join(' '), last_name: parts[parts.length - 1] };
}

function isValidPhone(phone) {
  return /^\+?[\d\s().-]{7,20}$/.test(phone);
}

function sanitizeUtm(utm) {
  if (!utm || typeof utm !== 'object') return {};
  const allowedKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const clean = {};
  allowedKeys.forEach((key) => {
    if (typeof utm[key] === 'string' && utm[key].trim()) {
      clean[key] = utm[key].trim().slice(0, 255);
    }
  });
  return clean;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://churchcleaningscandia.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.CRM_API_TOKEN;
  if (!token) {
    console.error('CRM_API_TOKEN is not configured');
    res.status(500).json({ error: 'Server misconfiguration' });
    return;
  }

  const body = req.body || {};
  const { name, org, phone, sqft, notes, page_url: pageUrl } = body;
  const utm = sanitizeUtm(body.utm);

  if (typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  if (typeof phone !== 'string' || !isValidPhone(phone)) {
    res.status(400).json({ error: 'A valid phone number is required' });
    return;
  }
  if (org !== undefined && typeof org !== 'string') {
    res.status(400).json({ error: 'Invalid organization value' });
    return;
  }

  const { first_name, last_name } = splitName(name);

  // The CRM payload only has one utm_source text field, so secondary UTM params
  // and the landing page URL are folded into notes rather than silently dropped.
  const utmDetail = ['utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    .filter((key) => utm[key])
    .map((key) => `${key}=${utm[key]}`)
    .join(' ');

  const combinedNotes = [
    org ? `Organization: ${org}` : null,
    sqft ? `Approx. size: ${sqft}` : null,
    notes,
    utmDetail ? `UTM: ${utmDetail}` : null,
    typeof pageUrl === 'string' && pageUrl ? `Landing page: ${pageUrl.slice(0, 300)}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  const payload = {
    zip: ZIP_SCANDIA_MN,
    customer: {
      company_name: typeof org === 'string' ? org.trim().slice(0, 255) : '',
      first_name: first_name.slice(0, 100),
      last_name: last_name.slice(0, 100),
      position: '',
      phone: phone.replace(/[^\d+]/g, '').slice(0, 20),
      email: '',
      email2: '',
      address: '',
      service_address: '',
      notes: combinedNotes.slice(0, 2000),
    },
    industry: INDUSTRY_CODE,
    questions: [],
    appointments: [],
    number_of_quotes: '1',
    utm_source: utm.utm_source || 'churchcleaningscandia.com',
  };

  try {
    const crmResponse = await fetch(CRM_PUSH_LEAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await crmResponse.text();

    if (!crmResponse.ok) {
      console.error('CRM PushLead failed', crmResponse.status, responseText);
      res.status(502).json({ error: 'Unable to submit quote request right now' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('CRM PushLead request error', err);
    res.status(502).json({ error: 'Unable to submit quote request right now' });
  }
};
