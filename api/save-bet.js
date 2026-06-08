// Vercel Serverless Function: 保存/更新/删除注单
export default async function handler(req, res) {
  // 设置 CORS 头
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

  const { action, bet, id, paid, bets } = req.body;

  try {
    // 1. 新增单条注单
    if (action === 'insert') {
      const payload = {
        bet_id: bet.id,
        name: bet.name,
        type: bet.type,
        teams: bet.teams,
        amount: bet.amount,
        payout: bet.payout,
        profit: bet.profit,
        paid: bet.paid || false,
        created_at: new Date(bet.time).toISOString()
      };

      const response = await fetch(`${supabaseUrl}/rest/v1/bets`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Insert failed: ${errText}`);
      }

      const inserted = await response.json();
      return res.status(200).json({ success: true, data: inserted });
    }

    // 2. 批量导入注单 (汇总注单)
    if (action === 'batch_insert') {
      if (!Array.isArray(bets)) throw new Error('Invalid bets array');

      const payloads = bets.map(b => ({
        bet_id: b.id,
        name: b.name,
        type: b.type,
        teams: b.teams,
        amount: b.amount,
        payout: b.payout,
        profit: b.profit,
        paid: b.paid || false,
        created_at: new Date(b.time || Date.now()).toISOString()
      }));

      const response = await fetch(`${supabaseUrl}/rest/v1/bets`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloads)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Batch insert failed: ${errText}`);
      }

      return res.status(200).json({ success: true });
    }

    // 3. 修改单条付款状态
    if (action === 'update_paid') {
      const response = await fetch(`${supabaseUrl}/rest/v1/bets?bet_id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paid: paid })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Update paid status failed: ${errText}`);
      }

      return res.status(200).json({ success: true });
    }

    // 4. 批量更新所有状态（一键已付/一键未付）
    if (action === 'update_all_paid') {
      const response = await fetch(`${supabaseUrl}/rest/v1/bets?id=gt.0`, { // 对所有有效主键进行更新
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paid: paid })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Update all paid status failed: ${errText}`);
      }

      return res.status(200).json({ success: true });
    }

    // 5. 单条删除（撤单）
    if (action === 'delete') {
      const response = await fetch(`${supabaseUrl}/rest/v1/bets?bet_id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Delete failed: ${errText}`);
      }

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown action type.' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
