import { TariffSchedule, TariffScenario } from '../types/tariff'

export const tariffTimeline: TariffSchedule[] = [
  {
    date: '2025-02-01',
    description: 'Initial tariffs on China, Mexico, and Canada',
    rates: {
      China: 10,
      Mexico: 25,
      Canada: 25
    },
    status: 'active'
  },
  {
    date: '2025-03-04',
    description: 'China tariffs increased to 20%',
    rates: {
      China: 20,
      Mexico: 25,
      Canada: 25
    },
    status: 'active'
  },
  {
    date: '2025-04-05',
    description: '10% baseline tariff on all countries',
    rates: {
      China: 20,
      Mexico: 25,
      Canada: 25,
      Taiwan: 10,
      Japan: 10,
      'South Korea': 10,
      Vietnam: 10,
      India: 10,
      Malaysia: 10,
      Thailand: 10,
      Philippines: 10,
      EU: 10,
      Israel: 10,
      Ireland: 10,
      Germany: 10,
      Singapore: 10
    },
    status: 'active'
  },
  {
    date: '2025-04-09',
    description: '90-day pause on most tariffs (except China)',
    rates: {
      China: 20,
      Mexico: 0,
      Canada: 0,
      Taiwan: 0,
      Japan: 0,
      'South Korea': 0,
      Vietnam: 0,
      India: 0,
      Malaysia: 0,
      Thailand: 0,
      Philippines: 0,
      EU: 0,
      Israel: 0,
      Ireland: 0,
      Germany: 0,
      Singapore: 0
    },
    status: 'paused'
  },
  {
    date: '2025-05-14',
    description: 'US-China agreement: tariffs reduced by 11.5%',
    rates: {
      China: 8.5, // 20% - 11.5%
      Mexico: 0,
      Canada: 0,
      Taiwan: 0,
      Japan: 0,
      'South Korea': 0,
      Vietnam: 0,
      India: 0,
      Malaysia: 0,
      Thailand: 0,
      Philippines: 0,
      EU: 0,
      Israel: 0,
      Ireland: 0,
      Germany: 0,
      Singapore: 0
    },
    status: 'active'
  },
  {
    date: '2025-05-28',
    description: 'Court blocks fentanyl-related China tariffs',
    rates: {
      China: 8.5,
      Mexico: 0,
      Canada: 0,
      Taiwan: 0,
      Japan: 0,
      'South Korea': 0,
      Vietnam: 0,
      India: 0,
      Malaysia: 0,
      Thailand: 0,
      Philippines: 0,
      EU: 0,
      Israel: 0,
      Ireland: 0,
      Germany: 0,
      Singapore: 0
    },
    status: 'blocked'
  },
  {
    date: '2025-07-09',
    description: 'End of 90-day pause - tariffs potentially resume',
    rates: {
      China: 20,
      Mexico: 25,
      Canada: 25,
      Taiwan: 10,
      Japan: 10,
      'South Korea': 10,
      Vietnam: 10,
      India: 10,
      Malaysia: 10,
      Thailand: 10,
      Philippines: 10,
      EU: 10,
      Israel: 10,
      Ireland: 10,
      Germany: 10,
      Singapore: 10
    },
    status: 'proposed'
  },
  {
    date: '2025-08-01',
    description: 'New tariff schedule (ranges 10-50% by country)',
    rates: {
      China: 35,
      Mexico: 30,
      Canada: 25,
      Taiwan: 15,
      Japan: 10,
      'South Korea': 10,
      Vietnam: 20,
      India: 10,
      Malaysia: 15,
      Thailand: 15,
      Philippines: 10,
      EU: 10,
      Israel: 10,
      Ireland: 10,
      Germany: 10,
      Singapore: 10
    },
    status: 'proposed'
  }
]

export const scenarios: TariffScenario[] = [
  {
    name: 'Current Timeline',
    description: 'Actual tariff implementation as of July 2025',
    timeline: tariffTimeline
  },
  {
    name: 'Escalation Scenario',
    description: 'What if tariffs continue to increase',
    timeline: [
      ...tariffTimeline,
      {
        date: '2025-10-01',
        description: 'Hypothetical: Major escalation',
        rates: {
          China: 50,
          Mexico: 40,
          Canada: 30,
          Taiwan: 25,
          Japan: 15,
          'South Korea': 15,
          Vietnam: 30,
          India: 15,
          Malaysia: 20,
          Thailand: 20,
          Philippines: 15,
          EU: 15,
          Israel: 10,
          Ireland: 10,
          Germany: 15,
          Singapore: 10
        },
        status: 'proposed'
      }
    ]
  },
  {
    name: 'De-escalation Scenario',
    description: 'What if trade agreements are reached',
    timeline: [
      ...tariffTimeline.slice(0, 5),
      {
        date: '2025-09-01',
        description: 'Hypothetical: Trade deals reduce tariffs',
        rates: {
          China: 5,
          Mexico: 5,
          Canada: 0,
          Taiwan: 0,
          Japan: 0,
          'South Korea': 0,
          Vietnam: 5,
          India: 0,
          Malaysia: 0,
          Thailand: 0,
          Philippines: 0,
          EU: 0,
          Israel: 0,
          Ireland: 0,
          Germany: 0,
          Singapore: 0
        },
        status: 'proposed'
      }
    ]
  }
]