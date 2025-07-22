import { TechCompany } from '../types/tariff'

export const techCompanies: TechCompany[] = [
  {
    id: 'canon',
    name: 'Canon',
    revenue: 32000, // $32B estimate
    headquarters: 'Japan',
    primaryManufacturing: ['China', 'Vietnam', 'Japan'],
    revenueByCountry: {
      China: 35,
      Vietnam: 20,
      Japan: 30,
      USA: 15,
    },
    category: 'hardware',
  },
  {
    id: 'apple',
    name: 'Apple',
    revenue: 383300, // $383.3B
    headquarters: 'USA',
    primaryManufacturing: ['China', 'Vietnam', 'India'],
    revenueByCountry: {
      China: 45,
      Vietnam: 15,
      India: 5,
      Taiwan: 10,
      USA: 25,
    },
    category: 'hardware',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    revenue: 574800, // $574.8B
    headquarters: 'USA',
    primaryManufacturing: ['China', 'USA', 'Mexico'],
    revenueByCountry: {
      China: 30,
      USA: 50,
      Mexico: 10,
      EU: 10,
    },
    category: 'services',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    revenue: 245100, // $245.1B estimate
    headquarters: 'USA',
    primaryManufacturing: ['China', 'USA'],
    revenueByCountry: {
      China: 15,
      USA: 60,
      EU: 15,
      Taiwan: 10,
    },
    category: 'software',
  },
  {
    id: 'alphabet',
    name: 'Alphabet (Google)',
    revenue: 307400, // $307.4B
    headquarters: 'USA',
    primaryManufacturing: ['China', 'Taiwan', 'USA'],
    revenueByCountry: {
      China: 20,
      USA: 55,
      Taiwan: 15,
      EU: 10,
    },
    category: 'software',
  },
  {
    id: 'samsung',
    name: 'Samsung Electronics',
    revenue: 267000, // $267B estimate
    headquarters: 'South Korea',
    primaryManufacturing: ['South Korea', 'China', 'Vietnam'],
    revenueByCountry: {
      'South Korea': 40,
      China: 30,
      Vietnam: 20,
      USA: 10,
    },
    category: 'hardware',
  },
  {
    id: 'tsmc',
    name: 'TSMC',
    revenue: 73900, // $73.9B
    headquarters: 'Taiwan',
    primaryManufacturing: ['Taiwan', 'China', 'USA'],
    revenueByCountry: {
      Taiwan: 85,
      China: 10,
      USA: 5,
    },
    category: 'semiconductor',
  },
  {
    id: 'foxconn',
    name: 'Foxconn',
    revenue: 215000, // $215B estimate
    headquarters: 'Taiwan',
    primaryManufacturing: ['China', 'Vietnam', 'India', 'Mexico'],
    revenueByCountry: {
      China: 70,
      Vietnam: 10,
      India: 10,
      Mexico: 5,
      Taiwan: 5,
    },
    category: 'hardware',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA',
    revenue: 60900, // $60.9B
    headquarters: 'USA',
    primaryManufacturing: ['Taiwan', 'China'],
    revenueByCountry: {
      Taiwan: 70, // TSMC manufacturing
      China: 20,
      USA: 10,
    },
    category: 'semiconductor',
  },
  {
    id: 'intel',
    name: 'Intel',
    revenue: 63054, // $63B
    headquarters: 'USA',
    primaryManufacturing: ['USA', 'China', 'Israel', 'Ireland'],
    revenueByCountry: {
      USA: 40,
      China: 25,
      Israel: 15,
      Ireland: 10,
      Malaysia: 10,
    },
    category: 'semiconductor',
  },
  {
    id: 'oracle',
    name: 'Oracle',
    revenue: 52960, // $53B estimate
    headquarters: 'USA',
    primaryManufacturing: ['USA', 'India'],
    revenueByCountry: {
      USA: 70,
      India: 20,
      EU: 10,
    },
    category: 'software',
  },
  {
    id: 'meta',
    name: 'Meta',
    revenue: 134900, // $134.9B
    headquarters: 'USA',
    primaryManufacturing: ['China', 'USA'],
    revenueByCountry: {
      China: 25, // VR hardware
      USA: 65,
      EU: 10,
    },
    category: 'software',
  },
  {
    id: 'tencent',
    name: 'Tencent',
    revenue: 85000, // $85B
    headquarters: 'China',
    primaryManufacturing: ['China'],
    revenueByCountry: {
      China: 90,
      USA: 5,
      EU: 5,
    },
    category: 'software',
  },
  {
    id: 'dell',
    name: 'Dell Technologies',
    revenue: 102300, // $102.3B
    headquarters: 'USA',
    primaryManufacturing: ['China', 'Mexico', 'Malaysia'],
    revenueByCountry: {
      China: 60,
      Mexico: 20,
      Malaysia: 10,
      USA: 10,
    },
    category: 'hardware',
  },
  {
    id: 'hp',
    name: 'HP Inc.',
    revenue: 53700, // $53.7B
    headquarters: 'USA',
    primaryManufacturing: ['China', 'Vietnam', 'Mexico', 'Thailand'],
    revenueByCountry: {
      China: 28.5,
      Vietnam: 18.8,
      Mexico: 16.2,
      EU: 13.5,
      Taiwan: 10.6,
      Japan: 5.6,
      Malaysia: 4.4,
      'South Korea': 3.9,
      Philippines: 2.1,
      Thailand: 1.5,
    },
    category: 'hardware',
  },
  {
    id: 'lenovo',
    name: 'Lenovo',
    revenue: 71000, // $71B
    headquarters: 'China',
    primaryManufacturing: ['China', 'Mexico', 'India'],
    revenueByCountry: {
      China: 65,
      Mexico: 15,
      India: 10,
      USA: 10,
    },
    category: 'hardware',
  },
  {
    id: 'cisco',
    name: 'Cisco',
    revenue: 57000, // $57B
    headquarters: 'USA',
    primaryManufacturing: ['China', 'Mexico', 'USA'],
    revenueByCountry: {
      China: 40,
      Mexico: 25,
      USA: 25,
      Malaysia: 10,
    },
    category: 'hardware',
  },
  {
    id: 'ibm',
    name: 'IBM',
    revenue: 61860, // $61.9B
    headquarters: 'USA',
    primaryManufacturing: ['USA', 'India', 'China'],
    revenueByCountry: {
      USA: 50,
      India: 30,
      China: 10,
      EU: 10,
    },
    category: 'services',
  },
  {
    id: 'qualcomm',
    name: 'Qualcomm',
    revenue: 35820, // $35.8B
    headquarters: 'USA',
    primaryManufacturing: ['Taiwan', 'China', 'South Korea'],
    revenueByCountry: {
      Taiwan: 40,
      China: 35,
      'South Korea': 15,
      USA: 10,
    },
    category: 'semiconductor',
  },
  {
    id: 'broadcom',
    name: 'Broadcom',
    revenue: 38900, // $38.9B
    headquarters: 'USA',
    primaryManufacturing: ['Taiwan', 'China', 'Singapore'],
    revenueByCountry: {
      Taiwan: 45,
      China: 30,
      Singapore: 15,
      USA: 10,
    },
    category: 'semiconductor',
  },
  {
    id: 'amd',
    name: 'AMD',
    revenue: 22680, // $22.7B
    headquarters: 'USA',
    primaryManufacturing: ['Taiwan', 'China'],
    revenueByCountry: {
      Taiwan: 65, // TSMC
      China: 25,
      USA: 10,
    },
    category: 'semiconductor',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    revenue: 34860, // $34.9B
    headquarters: 'USA',
    primaryManufacturing: ['USA'],
    revenueByCountry: {
      USA: 90,
      EU: 10,
    },
    category: 'software',
  },
  {
    id: 'sap',
    name: 'SAP',
    revenue: 35390, // $35.4B
    headquarters: 'Germany',
    primaryManufacturing: ['Germany', 'India'],
    revenueByCountry: {
      Germany: 60,
      India: 30,
      USA: 10,
    },
    category: 'software',
  },
  {
    id: 'accenture',
    name: 'Accenture',
    revenue: 66360, // $66.4B
    headquarters: 'Ireland',
    primaryManufacturing: ['India', 'Philippines', 'USA'],
    revenueByCountry: {
      India: 40,
      Philippines: 20,
      USA: 30,
      EU: 10,
    },
    category: 'services',
  },
  {
    id: 'sony',
    name: 'Sony',
    revenue: 88900, // $88.9B (electronics division)
    headquarters: 'Japan',
    primaryManufacturing: ['China', 'Japan', 'Thailand', 'Malaysia'],
    revenueByCountry: {
      China: 40,
      Japan: 25,
      Thailand: 15,
      Malaysia: 10,
      USA: 10,
    },
    category: 'hardware',
  },
  {
    id: 'panasonic',
    name: 'Panasonic',
    revenue: 65400, // $65.4B
    headquarters: 'Japan',
    primaryManufacturing: ['China', 'Japan', 'USA'],
    revenueByCountry: {
      China: 45,
      Japan: 35,
      USA: 20,
    },
    category: 'hardware',
  },
]
