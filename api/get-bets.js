// Vercel Serverless Function: 获取所有注单
export default async function handler(req, res) {
  // 设置 CORS 头，防止跨域问题
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: 'Missing Supabase environment variables on server.',
      fallbackMode: true
    });
  }

  try {
    // 使用原生 Fetch 调用 Supabase REST API，避免引入 node_modules 依赖以实现秒级冷启动
    const response = await fetch(`${supabaseUrl}/rest/v1/bets?select=*&order=id.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Supabase API responded with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    
    // 映射字段以符合前端原本的命名规则 (bet_id -> id)
    const formattedData = data.map(item => ({
      id: item.bet_id,
      realDbId: item.id, // 保留数据库自增真实ID
      type: item.type,
      name: item.name,
      teams: item.teams,
      amount: item.amount,
      payout: item.payout,
      profit: item.profit,
      paid: item.paid,
      time: item.created_at
    }));

    return res.status(200).json(formattedData);
} catch (error) {
console.log('SUPABASE_URL:', supabaseUrl);
console.log('KEY_LENGTH:', supabaseKey?.length);
  console.error('fetch error detail:', error.cause || error.message, JSON.stringify(error));
  return res.status(500).json({ error: error.message, cause: String(error.cause) });
}
}
