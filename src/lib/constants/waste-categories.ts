export type WasteSubcategory = {
  value: string
  label: string
}

export type WasteCategory = {
  value: string
  label: string
  subcategories: WasteSubcategory[]
}

export const wasteCategories: WasteCategory[] = [
  {
    value: 'ambalazni-otpad',
    label: 'Ambalažni otpad',
    subcategories: [
      { value: 'drvena-ambalaza', label: 'Drvena ambalaža' },
      { value: 'metalna-ambalaza', label: 'Metalna ambalaža' },
      { value: 'papirna-ambalaza', label: 'Papirna ambalaža' },
      { value: 'plasticna-ambalaza', label: 'Plastična ambalaža' },
    ],
  },
  {
    value: 'metali',
    label: 'Metali',
    subcategories: [
      { value: 'celik', label: 'Čelik' },
      { value: 'gvozdje', label: 'Gvožđe' },
      { value: 'lim', label: 'Lim' },
      { value: 'prohrom', label: 'Prohrom' },
      { value: 'spon', label: 'Špon' },
    ],
  },
  {
    value: 'nemetali',
    label: 'Nemetali',
    subcategories: [
      { value: 'drvo', label: 'Drvo' },
      { value: 'papir', label: 'Papir' },
      { value: 'plastika', label: 'Plastika' },
      { value: 'staklo', label: 'Staklo' },
    ],
  },
  {
    value: 'obojeni-metali',
    label: 'Obojeni metali',
    subcategories: [
      { value: 'aluminijum', label: 'Aluminijum' },
      { value: 'bakar', label: 'Bakar' },
      { value: 'cink', label: 'Cink' },
      { value: 'kablovi', label: 'Kablovi' },
      { value: 'kalaj', label: 'Kalaj' },
      { value: 'mesing', label: 'Mesing' },
      { value: 'olovo', label: 'Olovo' },
    ],
  },
  {
    value: 'posebni-tokovi',
    label: 'Posebni tokovi otpada',
    subcategories: [
      { value: 'elektronski-otpad', label: 'Elektronski otpad' },
      { value: 'olovni-akumulatori', label: 'Olovni akumulatori' },
      { value: 'otpadna-ulja', label: 'Otpadna ulja' },
      { value: 'otpadna-vozila', label: 'Otpadna vozila' },
      { value: 'otpadne-gume', label: 'Otpadne gume' },
    ],
  },
  {
    value: 'ostalo',
    label: 'Ostale vrste otpada',
    subcategories: [],
  },
]

export function getCategoryLabel(value: string): string {
  for (const cat of wasteCategories) {
    if (cat.value === value) return cat.label
    const sub = cat.subcategories.find(s => s.value === value)
    if (sub) return sub.label
  }
  return value
}

export function getParentCategory(subcategoryValue: string): string | null {
  for (const cat of wasteCategories) {
    if (cat.subcategories.some(s => s.value === subcategoryValue)) return cat.value
  }
  return null
}
