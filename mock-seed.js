// Seed data for the mock backend (local testing only). Mirrors the real fleet.
export function seed() {
  const venues = {
    'spacebar-arcade': { name: 'Spacebar Arcade', address: 'Sunderland', contactName: '', contactPhone: '', active: true },
    'play': { name: 'Play', address: '', contactName: '', contactPhone: '', active: true },
    'jds': { name: "JD's", address: '', contactName: '', contactPhone: '', active: true },
    'newcastle-site': { name: 'Newcastle site', address: 'Newcastle', contactName: '', contactPhone: '', active: true },
  };
  const M = (assetTag, name, category, purchaseCost, currentVenueId, extra = {}) => ({ assetTag, name, category, purchaseCost, currentVenueId, status: 'live', dealType: 'profit_share', splitPct: 50, rentAmount: 0, nayaxSerials: [], ...extra });
  const machines = {
    m3001: M('3001', 'Star Wars 2017', 'pinball', 5000, 'play', { dealType: 'rental', rentAmount: 200, nayaxSerials: ['4612124722113334'] }),
    m3002: M('3002', 'Iron Maiden', 'pinball', 5100, 'spacebar-arcade', { nayaxSerials: ['4612124722221014'] }),
    m3004: M('3004', 'Stranger Things', 'pinball', 10000, 'spacebar-arcade', { nayaxSerials: ['0612122720438757'] }),
    m3005: M('3005', 'Jaws Pro', 'pinball', 8400, 'spacebar-arcade', { nayaxSerials: ['4612134825278090'] }),
    m3011: M('3011', 'Deadpool', 'pinball', 6300, 'spacebar-arcade', { nayaxSerials: ['0612122720438582'], loan: { originalAmount: 6300, monthlyRepayment: 630, startDate: '2026-07-15', lender: 'Deadpool finance' } }),
    m3012: M('3012', 'Godzilla', 'pinball', 6300, 'spacebar-arcade', { nayaxSerials: ['4612124722113370'], loan: { originalAmount: 6300, monthlyRepayment: 630, startDate: '2026-07-15', lender: 'Godzilla finance' } }),
    m1001: M('1001', 'WWE', 'retro_arcade', 1200, 'play', { nayaxSerials: ['4612124722113414'] }),
    m1007: M('1007', 'Guitar Hero', 'retro_arcade', 2500, 'play', { nayaxSerials: ['4612124722221205'] }),
    m2001: M('2001', 'Ice Cold Beer', 'ice_cold_beer', 3000, 'spacebar-arcade', { nayaxSerials: ['0612134525256927'] }),
    m5003: M('5003', 'Pool 3', 'pool_table', 1730, 'jds', {}),
    m4001: M('4001', 'Boxer (Spacebar)', 'boxing', 4000, 'spacebar-arcade', { nayaxSerials: ['0612133025103931'] }),
    m4003: M('4003', 'Boxer Newcastle', 'boxing', 1900, 'newcastle-site', { status: 'down', openTicketCount: 1 }),
  };
  const takings = {};
  const T = (mid, month, cash, card, fee, venueId, dealType = 'profit_share', rent = 0) => {
    const gross = cash + card;
    const income = dealType === 'rental' ? rent : gross;
    const venuePayout = dealType === 'rental' ? 0 : Math.round((gross * 0.5 - fee) * 100) / 100;
    const pinkysNet = dealType === 'rental' ? Math.round((rent - fee) * 100) / 100 : Math.round(gross * 50) / 100;
    takings[`${mid}_${month}`] = { machineId: mid, venueId, month, cash, card, cardTransactions: Math.round(card), nayaxFeeIncVat: fee, nayaxFeeExVat: Math.round(fee / 1.2 * 100) / 100, dealType, splitPct: dealType === 'rental' ? null : 50, rentAmount: rent, gross, income, venuePayout, nayaxFee: fee, pinkysNet, counted: true, countedAt: `${month}-20T10:00:00.000Z`, settled: true, settledAt: `${month}-20T10:00:00.000Z` };
  };
  for (const month of ['2026-05', '2026-06', '2026-07']) {
    T('m3001', month, 115, 85, 15.01, 'play', 'rental', 200);
    T('m3002', month, 140, 25, 12.89, 'spacebar-arcade');
    T('m3004', month, 210, 32, 13.13, 'spacebar-arcade');
    T('m3005', month, 260, 80, 14.83, 'spacebar-arcade');
    T('m3011', month, 190, 33, 13.16, 'spacebar-arcade');
    T('m3012', month, 175, 33, 13.16, 'spacebar-arcade');
    T('m1001', month, 60, 27, 12.96, 'play');
    T('m1007', month, 150, 114, 16.03, 'play');
    T('m2001', month, 90, 16, 12.56, 'spacebar-arcade');
    T('m5003', month, 120, 0, 0, 'jds');
    T('m4001', month, 400, 983, 46.8, 'spacebar-arcade');
  }
  const repayments = {
    r1: { machineId: 'm3011', amount: 630, date: '2026-07-15' }, r2: { machineId: 'm3011', amount: 630, date: '2026-08-10' },
    r3: { machineId: 'm3012', amount: 630, date: '2026-07-15' }, r4: { machineId: 'm3012', amount: 630, date: '2026-08-10' },
  };
  const tickets = {
    t1: { machineId: 'm4003', venueId: 'newcastle-site', category: 'mechanical', description: 'Bag sensor not registering hits', status: 'open', openedAt: '2026-09-02T09:00:00.000Z', source: 'staff', photoUrls: [] },
    t2: { machineId: 'm3005', venueId: 'spacebar-arcade', category: 'payment', description: 'Card reader took payment, no credit', status: 'resolved', openedAt: '2026-07-10T09:00:00.000Z', resolvedAt: '2026-07-12T09:00:00.000Z', source: 'public', photoUrls: [], repair: { parts: 0, labour: 40, external: 0, total: 40, notes: 'Reset Nayax reader' } },
  };
  const faultQueue = {
    q1: { assetTag: '3004', machineId: 'm3004', category: 'mechanical', description: 'Right flipper weak', contact: '', submittedAt: '2026-09-08T18:30:00.000Z', status: 'pending' },
  };
  const nayaxDevices = {};
  for (const [id, m] of Object.entries(machines)) for (const s of m.nayaxSerials) nayaxDevices[s] = { machineId: id, label: m.name };
  const publicTags = {};
  for (const [id, m] of Object.entries(machines)) publicTags[m.assetTag] = { machineId: id, name: m.name, sold: false, venueId: m.currentVenueId, venueName: venues[m.currentVenueId]?.name || '' };
  const countQueue = { cq1: { assetTag: '3002', machineId: 'm3002', machineName: 'Iron Maiden', venueId: 'spacebar-arcade', venueName: 'Spacebar Arcade', cash: 212.5, meterReading: null, submittedAt: new Date(Date.now() - 86400000).toISOString(), status: 'pending' } };
  return { venues, machines, takings, repayments, tickets, faultQueue, countQueue, nayaxDevices, publicTags, nayaxImports: {}, costs: {}, settings: { app: { migratedFinance: true } } };
}
