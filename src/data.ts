// All product data is fictional.

export type PriorityKey = 'battery' | 'performance' | 'portability';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  tags: string[];
  reason: string;
  specs: [label: string, value: string][];
  scores: Record<PriorityKey, number>;
  popularity: number;
  learned: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'aerobook-14',
    name: 'AeroBook 14',
    price: 74999,
    rating: 4.6,
    tags: ['Lightweight', '16 hr battery', '14"'],
    reason: 'Best match for portability and battery life.',
    specs: [
      ['Display', '14" 2.8K'],
      ['Weight', '1.2 kg'],
      ['Battery', 'Up to 16 hr'],
      ['Memory', '16GB RAM · 512GB SSD'],
      ['Graphics', 'Integrated'],
    ],
    scores: { battery: 5, performance: 2, portability: 5 },
    popularity: 3,
    learned: ['14" screen', 'Long battery'],
  },
  {
    id: 'thinkpro-14',
    name: 'ThinkPro 14',
    price: 78490,
    rating: 4.5,
    tags: ['Business focused', '16GB RAM', '14"'],
    reason: 'Strong option if you want a more productivity-focused machine.',
    specs: [
      ['Display', '14" FHD+'],
      ['Weight', '1.4 kg'],
      ['Battery', 'Up to 11 hr'],
      ['Memory', '16GB RAM · 512GB SSD'],
      ['Graphics', 'Integrated'],
    ],
    scores: { battery: 3, performance: 3, portability: 4 },
    popularity: 5,
    learned: ['14" screen', 'Business-class build'],
  },
  {
    id: 'powerbook-15',
    name: 'PowerBook 15',
    price: 79999,
    rating: 4.4,
    tags: ['High performance', '16GB RAM', 'Larger display'],
    reason: 'Best if performance matters more than weight.',
    specs: [
      ['Display', '15.6" 144Hz'],
      ['Weight', '1.9 kg'],
      ['Battery', 'Up to 7 hr'],
      ['Memory', '16GB RAM · 512GB SSD'],
      ['Graphics', '6GB dedicated GPU'],
    ],
    scores: { battery: 2, performance: 5, portability: 2 },
    popularity: 4,
    learned: ['Dedicated GPU', 'Larger display'],
  },
];

export interface MemoryGroup {
  id: 'fashion' | 'electronics' | 'habits';
  title: string;
  chips: string[];
}

export const INITIAL_MEMORY: MemoryGroup[] = [
  { id: 'fashion', title: 'Fashion', chips: ['Size M', 'Nike', 'Uniqlo', 'Black', 'Regular fit', '₹2,000–₹5,000'] },
  { id: 'electronics', title: 'Electronics', chips: ['Battery first', 'Lightweight', 'Under ₹80K', 'Android ecosystem'] },
  { id: 'habits', title: 'Shopping habits', chips: ['Compares 3–5 products', 'Prefers fast delivery', 'Values easy returns'] },
];

export const QUERY = 'best laptop for MBA under ₹80,000';

export const JOURNEY = [
  { n: '01', label: 'Discover', text: "NIRA understands what you're looking for." },
  { n: '02', label: 'Compare', text: 'It compares relevant products, prices and trade-offs.' },
  { n: '03', label: 'Decide', text: 'It explains why each option fits you.' },
  { n: '04', label: 'Cart', text: 'Add the selected product to your cart.' },
  { n: '05', label: 'Buy', text: 'Complete the purchase through connected commerce partners.' },
  { n: '06', label: 'Learn', text: 'NIRA learns from the outcome for future shopping.' },
];

export const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN');

/** Ranking weights. Memory shapes the defaults; a live choice overrides them. */
export function rankProducts(
  memoryOn: boolean,
  electronicsChips: string[],
  priority: PriorityKey | null,
  gaming: 'no' | 'sometimes' | 'yes' | null,
): Product[] {
  const hasBattery = electronicsChips.includes('Battery first');
  const hasLight = electronicsChips.includes('Lightweight');
  const personal = memoryOn && (hasBattery || hasLight);

  const w = {
    battery: personal ? (hasBattery ? 2 : 1) : 1,
    portability: personal ? (hasLight ? 2 : 1) : 1,
    performance: personal ? 0.5 : 1,
    popularity: personal ? 0 : 3,
  };
  if (priority) w[priority] = 5;
  if (gaming === 'yes') w.performance += 2.5;
  if (gaming === 'sometimes') w.performance += 1;

  const score = (p: Product) =>
    p.scores.battery * w.battery +
    p.scores.portability * w.portability +
    p.scores.performance * w.performance +
    p.popularity * w.popularity;

  return [...PRODUCTS].sort((a, b) => score(b) - score(a));
}
