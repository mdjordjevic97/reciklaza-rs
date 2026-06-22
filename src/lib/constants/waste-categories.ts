export const wasteCategories = [
  { code: '01', name: 'Otpadi od istraživanja i iskopavanja iz rudnika i kamenoloma' },
  { code: '02', name: 'Otpadi iz poljoprivrede, hortikulture, proizvodnje hrane' },
  { code: '03', name: 'Otpadi od prerade drveta i proizvodnje ploča i nameštaja' },
  { code: '04', name: 'Otpadi iz kožne, krznene i tekstilne industrije' },
  { code: '05', name: 'Otpadi od prerade nafte, prečišćavanja gasa i pirolize uglja' },
  { code: '06', name: 'Otpadi od neorganskih hemijskih procesa' },
  { code: '07', name: 'Otpadi od organskih hemijskih procesa' },
  { code: '08', name: 'Otpadi od proizvodnje i korišćenja premaza, lepkova, zaptivača' },
  { code: '09', name: 'Otpadi iz fotografske industrije' },
  { code: '10', name: 'Otpadi iz termičkih procesa' },
  { code: '11', name: 'Otpadi od hemijskog tretmana i zaštite metala' },
  { code: '12', name: 'Otpadi od oblikovanja i fizičko-hemijske obrade metala i plastike' },
  { code: '13', name: 'Otpadi od ulja i tečnih goriva' },
  { code: '14', name: 'Otpadi od organskih rastvarača, rashladnih sredstava' },
  { code: '15', name: 'Otpadna ambalaža, apsorbenti, krpe za brisanje, filterski materijali' },
  { code: '16', name: 'Otpadi koji nisu drugačije specificirani u katalogu' },
  { code: '17', name: 'Građevinski otpad i otpad od rušenja' },
  { code: '18', name: 'Otpadi iz zdravstvene i veterinarske zaštite' },
  { code: '19', name: 'Otpadi iz postrojenja za obradu otpada' },
  { code: '20', name: 'Komunalni otpad i slični otpadi' },
]

export function getCategoryName(code: string): string {
  return wasteCategories.find(c => c.code === code)?.name ?? code
}
