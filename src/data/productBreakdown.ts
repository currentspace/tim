// Product breakdown data for each company
export interface ProductBreakdown {
  product: string
  percentage: number
}

export interface CompanyProductData {
  company: string
  products: ProductBreakdown[]
}

export const productBreakdownData: Record<string, ProductBreakdown[]> = {
  'HP Inc.': [
    { product: 'Server', percentage: 15.25 },
    { product: 'Printer', percentage: 22.4 },
    { product: 'Poly', percentage: 8.15 },
    { product: 'Desktop', percentage: 12.3 },
    { product: 'Laptop', percentage: 18.75 },
    { product: 'Scanner', percentage: 25.6 },
    { product: 'Software', percentage: 5.8 },
    { product: 'Peripheral', percentage: 30.25 },
    { product: 'Services', percentage: 10.5 },
  ],
  Apple: [
    { product: 'iPhone', percentage: 28.5 },
    { product: 'iPad', percentage: 15.75 },
    { product: 'Mac', percentage: 22.3 },
    { product: 'Watch', percentage: 12.6 },
    { product: 'AirPods', percentage: 18.9 },
    { product: 'Services', percentage: 35.2 },
    { product: 'Accessories', percentage: 8.4 },
    { product: 'AppleTV+', percentage: 5.25 },
    { product: 'Other', percentage: 11.85 },
  ],
  'Dell Technologies': [
    { product: 'Server', percentage: 20.15 },
    { product: 'Storage', percentage: 18.9 },
    { product: 'Desktop', percentage: 14.25 },
    { product: 'Laptop', percentage: 25.6 },
    { product: 'Monitor', percentage: 12.3 },
    { product: 'Networking', percentage: 8.75 },
    { product: 'Services', percentage: 15.4 },
    { product: 'Software', percentage: 6.9 },
    { product: 'Peripheral', percentage: 22.85 },
  ],
}

export function getProductBreakdown(companyName: string): ProductBreakdown[] {
  if (!(companyName in productBreakdownData)) {
    return []
  }
  return productBreakdownData[companyName]
}

export function calculateCumulativeAverage(products: ProductBreakdown[]): number {
  if (products.length === 0) return 0
  const sum = products.reduce((acc, p) => acc + p.percentage, 0)
  return sum / products.length
}
