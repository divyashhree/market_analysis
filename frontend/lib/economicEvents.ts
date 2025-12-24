export interface EconomicEvent {
  date: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
}

export const economicEvents: EconomicEvent[] = [
  {
    date: '2016-11-08',
    title: 'Demonetization',
    description: 'Indian government withdrew ₹500 and ₹1000 currency notes',
    type: 'negative',
  },
  {
    date: '2017-07-01',
    title: 'GST Launch',
    description: 'Goods and Services Tax implemented across India',
    type: 'neutral',
  },
  {
    date: '2020-03-24',
    title: 'COVID-19 Lockdown',
    description: 'India announces nationwide lockdown, market crash',
    type: 'negative',
  },
  {
    date: '2020-03-23',
    title: 'Market Circuit Breaker',
    description: 'NIFTY 50 hits lower circuit due to COVID fears',
    type: 'negative',
  },
  {
    date: '2021-04-01',
    title: 'Second COVID Wave',
    description: 'India faces severe second wave of COVID-19',
    type: 'negative',
  },
  {
    date: '2022-02-24',
    title: 'Russia-Ukraine War',
    description: 'War begins, affecting global markets and oil prices',
    type: 'negative',
  },
  {
    date: '2022-05-04',
    title: 'US Fed Rate Hike',
    description: 'Federal Reserve begins aggressive rate hikes',
    type: 'negative',
  },
  {
    date: '2023-07-01',
    title: 'India Stock Split',
    description: 'Several major Indian stocks undergo splits',
    type: 'neutral',
  },
  {
    date: '2014-05-16',
    title: 'Modi Government',
    description: 'BJP wins general election, Modi becomes PM',
    type: 'positive',
  },
  {
    date: '2019-05-23',
    title: 'Modi Re-election',
    description: 'BJP wins second term with strong majority',
    type: 'positive',
  },
];

export function getEventsInRange(startDate: string, endDate: string): EconomicEvent[] {
  return economicEvents.filter(
    event => event.date >= startDate && event.date <= endDate
  ).sort((a, b) => a.date.localeCompare(b.date));
}
