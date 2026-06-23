import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const img = (id: string) => `https://images.unsplash.com/${id}?w=800&q=80&fit=crop&auto=format`

async function main() {
  console.log('Seeding database...')

  const password = await bcrypt.hash('test1234', 12)
  const adminPassword = await bcrypt.hash('admin123', 12)

  await prisma.user.create({
    data: {
      email: 'admin@reciklaza.rs', passwordHash: adminPassword, companyName: 'Reciklaža.rs Admin',
      pib: '111988991', address: 'Beograd', city: 'Beograd', contactPerson: 'Admin',
      userType: 'GENERATOR', emailVerified: true, verified: true, isAdmin: true,
    },
  })

  const users = await Promise.all([
    prisma.user.create({ data: {
      email: 'ekoreciklaza@test.rs', passwordHash: password, companyName: 'Eko Reciklaža d.o.o.', pib: '100000001',
      address: 'Bulevar Oslobođenja 55', city: 'Novi Sad', contactPerson: 'Marko Petrović', phone: '0641234567',
      userType: 'COLLECTOR', bio: 'Sakupljamo i prerađujemo plastiku, papir i metal.', emailVerified: true, verified: true,
    }}),
    prisma.user.create({ data: {
      email: 'metalservis@test.rs', passwordHash: password, companyName: 'Metal Servis NS', pib: '100000002',
      address: 'Industrijska zona bb', city: 'Novi Sad', contactPerson: 'Jovan Nikolić', phone: '0659876543',
      userType: 'COLLECTOR', bio: 'Otkup svih vrsta metalnog otpada.', emailVerified: true, verified: true,
    }}),
    prisma.user.create({ data: {
      email: 'gradnja@test.rs', passwordHash: password, companyName: 'Gradnja Plus d.o.o.', pib: '100000003',
      address: 'Kneza Miloša 12', city: 'Beograd', contactPerson: 'Stefan Jovanović', phone: '0621112233',
      userType: 'GENERATOR', bio: 'Građevinska firma sa redovnim količinama otpada.', emailVerified: true, verified: true,
    }}),
    prisma.user.create({ data: {
      email: 'fabrika@test.rs', passwordHash: password, companyName: 'Fabrika Plastike Kragujevac', pib: '100000004',
      address: 'Lepenički bulevar 100', city: 'Kragujevac', contactPerson: 'Ana Milošević', phone: '0634445566',
      userType: 'GENERATOR', bio: 'Proizvodnja plastične ambalaže.', emailVerified: true, verified: true,
    }}),
    prisma.user.create({ data: {
      email: 'hemind@test.rs', passwordHash: password, companyName: 'HemInd Šabac', pib: '100000005',
      address: 'Hajduk Veljkova 2', city: 'Šabac', contactPerson: 'Dragan Savić', phone: '0657778899',
      userType: 'GENERATOR', bio: 'Hemijska industrija.', emailVerified: true, verified: false,
    }}),
    prisma.user.create({ data: {
      email: 'zeleniput@test.rs', passwordHash: password, companyName: 'Zeleni Put Reciklaža', pib: '100000006',
      address: 'Cara Dušana 88', city: 'Niš', contactPerson: 'Milica Đorđević', phone: '0669990011',
      userType: 'COLLECTOR', bio: 'Sakupljanje i sortiranje komunalnog otpada.', emailVerified: true, verified: true,
    }}),
  ])

  console.log(`Created admin + ${users.length} users`)

  for (const user of users) {
    await prisma.permit.create({ data: {
      userId: user.id, fileUrl: '/uploads/permits/placeholder.pdf', fileName: 'dozvola.pdf',
      permitType: user.userType === 'COLLECTOR' ? 'collection' : 'storage',
      status: user.verified ? 'APPROVED' : 'PENDING',
    }})
  }

  const listingsData = [
    { userId: users[2].id, title: 'Građevinski šut — beton i cigla', description: 'Veliki komadi betona i cigle od rušenja stare zgrade. Materijal je čist, bez azbestnih primesa.', wasteIndexNumber: '17 01 07', wasteCategory: 'ostalo', wasteSubcategory: null, isHazardous: false, quantity: 50, unit: 'tona', pricePerUnit: 500, municipality: 'Stari grad',
      images: [img('photo-1558618666-fcd25c85f82e'), img('photo-1504307651254-35680f356dfd')] },
    { userId: users[2].id, title: 'Stara drvena građa — grede i daske', description: 'Drvene grede i daske od renoviranja. Drvo je suvo, bez hemikalija.', wasteIndexNumber: '17 02 01', wasteCategory: 'nemetali', wasteSubcategory: 'drvo', isHazardous: false, quantity: 8, unit: 'tona', pricePerUnit: 2000, municipality: 'Voždovac',
      images: [img('photo-1520333789090-1afc82db536a')] },
    { userId: users[3].id, title: 'PET flaše — presovane bale', description: 'Presovane bale PET flaša iz proizvodnog procesa. Čist materijal, sortiran po boji.', wasteIndexNumber: '15 01 02', wasteCategory: 'ambalazni-otpad', wasteSubcategory: 'plasticna-ambalaza', isHazardous: false, quantity: 5000, unit: 'kg', pricePerUnit: 35, municipality: 'Kragujevac',
      images: [img('photo-1572981779307-38b8cabb2407'), img('photo-1605600659908-0ef719419d41')] },
    { userId: users[3].id, title: 'HDPE plastični otpad', description: 'Otpadni HDPE materijal iz proizvodnje — odsečci i škart. Spreman za regranulaciju.', wasteIndexNumber: '15 01 02', wasteCategory: 'nemetali', wasteSubcategory: 'plastika', isHazardous: false, quantity: 3000, unit: 'kg', pricePerUnit: 45, municipality: 'Kragujevac',
      images: [img('photo-1604187351574-c75ca79f5807')] },
    { userId: users[3].id, title: 'Polipropilenska folija', description: 'Ostatak PP folije iz pakovanja. Čist materijal, rolne različitih dimenzija.', wasteIndexNumber: '15 01 02', wasteCategory: 'ambalazni-otpad', wasteSubcategory: 'plasticna-ambalaza', isHazardous: false, quantity: 2000, unit: 'kg', pricePerUnit: 30, municipality: 'Kragujevac',
      images: [img('photo-1610141084204-1bd478955cfe')] },
    { userId: users[4].id, title: 'Otpadna sumporna kiselina', description: 'Razblažena sumporna kiselina iz proizvodnog procesa. Potreban adekvatan transport.', wasteIndexNumber: '06 01 01', wasteCategory: 'posebni-tokovi', wasteSubcategory: null, isHazardous: true, quantity: 500, unit: 'litar', pricePerUnit: null, municipality: 'Šabac',
      images: [img('photo-1532187863486-abf9dbad1b69')] },
    { userId: users[4].id, title: 'Istrošeni filteri sa hemikalijama', description: 'Upotrebljeni industrijski filteri kontaminirani hemijskim materijama. Opasan otpad.', wasteIndexNumber: '15 02 02', wasteCategory: 'posebni-tokovi', wasteSubcategory: null, isHazardous: true, quantity: 200, unit: 'kg', pricePerUnit: null, municipality: 'Šabac',
      images: [img('photo-1558618666-fcd25c85f82e')] },
    { userId: users[0].id, title: 'Otkupljujemo stari papir i karton', description: 'Otkupljujemo sve vrste starog papira i kartona u velikim količinama.', wasteIndexNumber: '15 01 01', wasteCategory: 'ambalazni-otpad', wasteSubcategory: 'papirna-ambalaza', isHazardous: false, quantity: 10000, unit: 'kg', pricePerUnit: 15, municipality: 'Novi Sad',
      images: [img('photo-1585814240476-d696fa933c01')] },
    { userId: users[0].id, title: 'Otkup PET ambalaže — sve boje', description: 'Kupujemo PET ambalažu svih boja. Presovana ili nepresovana.', wasteIndexNumber: '15 01 02', wasteCategory: 'ambalazni-otpad', wasteSubcategory: 'plasticna-ambalaza', isHazardous: false, quantity: 5000, unit: 'kg', pricePerUnit: 30, municipality: 'Novi Sad',
      images: [img('photo-1572981779307-38b8cabb2407')] },
    { userId: users[1].id, title: 'Otkup starog gvožđa', description: 'Otkupljujemo staro gvožđe svih vrsta — profili, limovi, cevi.', wasteIndexNumber: '17 04 05', wasteCategory: 'metali', wasteSubcategory: 'gvozdje', isHazardous: false, quantity: 20000, unit: 'kg', pricePerUnit: 25, municipality: 'Novi Sad',
      images: [img('photo-1558618666-fcd25c85f82e'), img('photo-1567449303183-ae0d6ed1c16e')] },
    { userId: users[1].id, title: 'Otkup aluminijumskih limenki', description: 'Kupujemo aluminijumske limenke u svim količinama. Konkurentna cena.', wasteIndexNumber: '17 04 02', wasteCategory: 'obojeni-metali', wasteSubcategory: 'aluminijum', isHazardous: false, quantity: 2000, unit: 'kg', pricePerUnit: 120, municipality: 'Novi Sad',
      images: [img('photo-1611284446314-60a58ac0deb9')] },
    { userId: users[1].id, title: 'Otkup bakra i bakarnih legura', description: 'Otkupljujemo bakar u svim oblicima — kablovi, cevi, ploče, strugotina.', wasteIndexNumber: '17 04 01', wasteCategory: 'obojeni-metali', wasteSubcategory: 'bakar', isHazardous: false, quantity: 500, unit: 'kg', pricePerUnit: 800, municipality: 'Novi Sad',
      images: [img('photo-1605539585742-2a72e6b535e1')] },
    { userId: users[2].id, title: 'Čelične konstrukcije — demontaža', description: 'Demontirana čelična konstrukcija. Profili, nosači i limovi.', wasteIndexNumber: '17 04 05', wasteCategory: 'metali', wasteSubcategory: 'celik', isHazardous: false, quantity: 15, unit: 'tona', pricePerUnit: 20000, municipality: 'Zemun',
      images: [img('photo-1567449303183-ae0d6ed1c16e')] },
    { userId: users[5].id, title: 'Otkup staklene ambalaže', description: 'Otkupljujemo sve vrste staklene ambalaže — flaše, tegle, lomljeno staklo.', wasteIndexNumber: '15 01 07', wasteCategory: 'nemetali', wasteSubcategory: 'staklo', isHazardous: false, quantity: 3000, unit: 'kg', pricePerUnit: 8, municipality: 'Niš',
      images: [img('photo-1610141084204-1bd478955cfe')] },
    { userId: users[5].id, title: 'Sakupljamo elektronski otpad', description: 'Preuzimamo sve vrste e-otpada — računari, monitori, telefoni, kablovi.', wasteIndexNumber: '16 02 14', wasteCategory: 'posebni-tokovi', wasteSubcategory: 'elektronski-otpad', isHazardous: false, quantity: 1000, unit: 'kg', pricePerUnit: null, municipality: 'Niš',
      images: [img('photo-1550009158-9ebf69173e03')] },
    { userId: users[3].id, title: 'Plastični poklopci — mešane boje', description: 'Plastični poklopci od flaša, pretežno PP i HDPE.', wasteIndexNumber: '15 01 02', wasteCategory: 'nemetali', wasteSubcategory: 'plastika', isHazardous: false, quantity: 800, unit: 'kg', pricePerUnit: 20, municipality: 'Kragujevac',
      images: [img('photo-1605600659908-0ef719419d41')] },
    { userId: users[0].id, title: 'Otkup tekstilnog otpada', description: 'Otkupljujemo staru odeću i tekstilne ostatke iz proizvodnje.', wasteIndexNumber: '04 02 22', wasteCategory: 'ostalo', wasteSubcategory: null, isHazardous: false, quantity: 5000, unit: 'kg', pricePerUnit: 10, municipality: 'Novi Sad',
      images: [img('photo-1567113463300-102a7eb3cb26')] },
    { userId: users[4].id, title: 'Otpadno motorno ulje', description: 'Upotrebljeno motorno ulje iz mašina. Sakupljeno u IBC kontejnerima.', wasteIndexNumber: '13 02 08', wasteCategory: 'posebni-tokovi', wasteSubcategory: 'otpadna-ulja', isHazardous: true, quantity: 3000, unit: 'litar', pricePerUnit: null, municipality: 'Šabac',
      images: [img('photo-1558618666-fcd25c85f82e')] },
    { userId: users[5].id, title: 'Otkup starih auto guma', description: 'Preuzimamo stare auto gume svih dimenzija za reciklažu.', wasteIndexNumber: '16 01 03', wasteCategory: 'posebni-tokovi', wasteSubcategory: 'otpadne-gume', isHazardous: false, quantity: 2000, unit: 'komad', pricePerUnit: null, municipality: 'Niš',
      images: [img('photo-1609004564654-f44a36db86f1')] },
    { userId: users[1].id, title: 'Otkup limenog otpada', description: 'Kupujemo lim svih vrsta i debljina. Isplata odmah.', wasteIndexNumber: '17 04 05', wasteCategory: 'metali', wasteSubcategory: 'lim', isHazardous: false, quantity: 10000, unit: 'kg', pricePerUnit: 22, municipality: 'Novi Sad',
      images: [img('photo-1504307651254-35680f356dfd')] },
  ]

  for (const { images, ...data } of listingsData) {
    const listing = await prisma.listing.create({ data: data as any })
    if (images) {
      for (let i = 0; i < images.length; i++) {
        await prisma.listingImage.create({ data: { listingId: listing.id, imageUrl: images[i], displayOrder: i } })
      }
    }
  }

  console.log(`Created ${listingsData.length} listings with images`)
  console.log('\n✅ Seed complete!')
  console.log('\nAdmin: admin@reciklaza.rs / admin123')
  console.log('\nTest accounts (password: test1234):')
  for (const u of users) console.log(`  ${u.email} — ${u.companyName} (${u.userType})`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
