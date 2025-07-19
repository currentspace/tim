import { NetworkData, VC, Startup, Founder, Connection } from '../types/network'

// Generate sample data mimicking the startup universe
const vcs: VC[] = [
  { id: 'vc1', name: '500 Startups', type: 'vc', investments: 15 },
  { id: 'vc2', name: 'Anthemis Group', type: 'vc', investments: 8 },
  { id: 'vc3', name: 'Crosslink Capital', type: 'vc', investments: 12 },
  { id: 'vc4', name: 'Ecosystem Ventures', type: 'vc', investments: 6 },
  { id: 'vc5', name: 'Endeavor Partners', type: 'vc', investments: 9 },
  { id: 'vc6', name: 'Giza Venture Capital', type: 'vc', investments: 7 },
  { id: 'vc7', name: 'Josh James', type: 'vc', investments: 4 },
  { id: 'vc8', name: 'Kapor Capital', type: 'vc', investments: 10 },
  { id: 'vc9', name: 'Mark Goines', type: 'vc', investments: 5 },
  { id: 'vc10', name: 'Naval Ravikant', type: 'vc', investments: 11 },
  { id: 'vc11', name: 'SoftTech VC', type: 'vc', investments: 13 },
]

const startups: Startup[] = [
  {
    id: 's1',
    name: 'Airbnb',
    type: 'startup',
    fundingAmount: 450000000,
    founded: 2008,
    category: 'marketplace',
  },
  {
    id: 's2',
    name: 'Dropbox',
    type: 'startup',
    fundingAmount: 300000000,
    founded: 2008,
    category: 'storage',
  },
  {
    id: 's3',
    name: 'Uber',
    type: 'startup',
    fundingAmount: 800000000,
    founded: 2009,
    category: 'transportation',
  },
  {
    id: 's4',
    name: 'Pinterest',
    type: 'startup',
    fundingAmount: 200000000,
    founded: 2010,
    category: 'social',
  },
  {
    id: 's5',
    name: 'Square',
    type: 'startup',
    fundingAmount: 350000000,
    founded: 2009,
    category: 'fintech',
  },
  {
    id: 's6',
    name: 'Spotify',
    type: 'startup',
    fundingAmount: 500000000,
    founded: 2006,
    category: 'entertainment',
  },
  {
    id: 's7',
    name: 'Twitter',
    type: 'startup',
    fundingAmount: 400000000,
    founded: 2006,
    category: 'social',
  },
  {
    id: 's8',
    name: 'Stripe',
    type: 'startup',
    fundingAmount: 600000000,
    founded: 2010,
    category: 'fintech',
  },
  {
    id: 's9',
    name: 'Lyft',
    type: 'startup',
    fundingAmount: 250000000,
    founded: 2012,
    category: 'transportation',
  },
  {
    id: 's10',
    name: 'Snapchat',
    type: 'startup',
    fundingAmount: 300000000,
    founded: 2011,
    category: 'social',
  },
  {
    id: 's11',
    name: 'WhatsApp',
    type: 'startup',
    fundingAmount: 150000000,
    founded: 2009,
    category: 'communication',
  },
  {
    id: 's12',
    name: 'Instagram',
    type: 'startup',
    fundingAmount: 100000000,
    founded: 2010,
    category: 'social',
  },
  {
    id: 's13',
    name: 'Slack',
    type: 'startup',
    fundingAmount: 180000000,
    founded: 2013,
    category: 'communication',
  },
  {
    id: 's14',
    name: 'Palantir',
    type: 'startup',
    fundingAmount: 700000000,
    founded: 2003,
    category: 'enterprise',
  },
  {
    id: 's15',
    name: 'SpaceX',
    type: 'startup',
    fundingAmount: 900000000,
    founded: 2002,
    category: 'aerospace',
  },
]

const founders: Founder[] = [
  { id: 'f1', name: 'Brian Chesky', type: 'founder', companies: 1 },
  { id: 'f2', name: 'Drew Houston', type: 'founder', companies: 1 },
  { id: 'f3', name: 'Travis Kalanick', type: 'founder', companies: 2 },
  { id: 'f4', name: 'Ben Silbermann', type: 'founder', companies: 1 },
  { id: 'f5', name: 'Jack Dorsey', type: 'founder', companies: 2 },
  { id: 'f6', name: 'Daniel Ek', type: 'founder', companies: 1 },
  { id: 'f7', name: 'Patrick Collison', type: 'founder', companies: 1 },
  { id: 'f8', name: 'John Zimmer', type: 'founder', companies: 1 },
  { id: 'f9', name: 'Evan Spiegel', type: 'founder', companies: 1 },
  { id: 'f10', name: 'Jan Koum', type: 'founder', companies: 1 },
  { id: 'f11', name: 'Kevin Systrom', type: 'founder', companies: 1 },
  { id: 'f12', name: 'Stewart Butterfield', type: 'founder', companies: 2 },
  { id: 'f13', name: 'Peter Thiel', type: 'founder', companies: 3 },
  { id: 'f14', name: 'Elon Musk', type: 'founder', companies: 4 },
]

// Create connections between VCs and startups (investments)
const investments: Connection[] = [
  // 500 Startups investments
  { source: 'vc1', target: 's1', value: 50000000, type: 'investment' },
  { source: 'vc1', target: 's4', value: 30000000, type: 'investment' },
  { source: 'vc1', target: 's9', value: 25000000, type: 'investment' },
  { source: 'vc1', target: 's13', value: 20000000, type: 'investment' },

  // Anthemis Group
  { source: 'vc2', target: 's5', value: 45000000, type: 'investment' },
  { source: 'vc2', target: 's8', value: 60000000, type: 'investment' },

  // Crosslink Capital
  { source: 'vc3', target: 's2', value: 40000000, type: 'investment' },
  { source: 'vc3', target: 's7', value: 35000000, type: 'investment' },
  { source: 'vc3', target: 's10', value: 30000000, type: 'investment' },

  // Ecosystem Ventures
  { source: 'vc4', target: 's3', value: 80000000, type: 'investment' },
  { source: 'vc4', target: 's6', value: 50000000, type: 'investment' },

  // Endeavor Partners
  { source: 'vc5', target: 's11', value: 20000000, type: 'investment' },
  { source: 'vc5', target: 's12', value: 15000000, type: 'investment' },
  { source: 'vc5', target: 's14', value: 70000000, type: 'investment' },

  // More investments...
  { source: 'vc6', target: 's15', value: 90000000, type: 'investment' },
  { source: 'vc7', target: 's1', value: 25000000, type: 'investment' },
  { source: 'vc8', target: 's3', value: 60000000, type: 'investment' },
  { source: 'vc9', target: 's5', value: 35000000, type: 'investment' },
  { source: 'vc10', target: 's8', value: 50000000, type: 'investment' },
  { source: 'vc11', target: 's4', value: 20000000, type: 'investment' },
]

// Create connections between founders and startups
const founderConnections: Connection[] = [
  { source: 'f1', target: 's1', value: 1, type: 'founded' },
  { source: 'f2', target: 's2', value: 1, type: 'founded' },
  { source: 'f3', target: 's3', value: 1, type: 'founded' },
  { source: 'f4', target: 's4', value: 1, type: 'founded' },
  { source: 'f5', target: 's5', value: 1, type: 'founded' },
  { source: 'f5', target: 's7', value: 1, type: 'founded' },
  { source: 'f6', target: 's6', value: 1, type: 'founded' },
  { source: 'f7', target: 's8', value: 1, type: 'founded' },
  { source: 'f8', target: 's9', value: 1, type: 'founded' },
  { source: 'f9', target: 's10', value: 1, type: 'founded' },
  { source: 'f10', target: 's11', value: 1, type: 'founded' },
  { source: 'f11', target: 's12', value: 1, type: 'founded' },
  { source: 'f12', target: 's13', value: 1, type: 'founded' },
  { source: 'f13', target: 's14', value: 1, type: 'founded' },
  { source: 'f14', target: 's15', value: 1, type: 'founded' },
]

export const networkData: NetworkData = {
  nodes: [...vcs, ...startups, ...founders],
  links: [...investments, ...founderConnections],
}
