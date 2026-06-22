import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const password = await bcrypt.hash('test1234', 12)

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ekoreciklaza@test.rs',
        passwordHash: password,
        companyName: 'Eko Reciklaža d.o.o.',
        pib: '100000001',
        address: 'Bulevar Oslobođenja 55',
        city: 'Novi Sad',
        contactPerson: 'Marko Petrović',
        phone: '0641234567',
        userType: 'COLLECTOR',
        bio: 'Sakupljamo i prerađujemo plastiku, papir i metal. 15 godina iskustva u industriji reciklaže.',
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'metalservis@test.rs',
        passwordHash: password,
        companyName: 'Metal Servis NS',
        pib: '100000002',
        address: 'Industrijska zona bb',
        city: 'Novi Sad',
        contactPerson: 'Jovan Nikolić',
        phone: '0659876543',
        userType: 'COLLECTOR',
        bio: 'Otkup svih vrsta metalnog otpada. Posedujemo sopstveni transport.',
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'gradnja@test.rs',
        passwordHash: password,
        companyName: 'Gradnja Plus d.o.o.',
        pib: '100000003',
        address: 'Kneza Miloša 12',
        city: 'Beograd',
        contactPerson: 'Stefan Jovanović',
        phone: '0621112233',
        userType: 'GENERATOR',
        bio: 'Građevinska firma sa redovnim količinama građevinskog otpada.',
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'fabrika@test.rs',
        passwordHash: password,
        companyName: 'Fabrika Plastike Kragujevac',
        pib: '100000004',
        address: 'Lepenički bulevar 100',
        city: 'Kragujevac',
        contactPerson: 'Ana Milošević',
        phone: '0634445566',
        userType: 'GENERATOR',
        bio: 'Proizvodnja plastične ambalaže. Generišemo redovne količine plastičnog otpada.',
        verified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'hemind@test.rs',
        passwordHash: password,
        companyName: 'HemInd Šabac',
        pib: '100000005',
        address: 'Hajduk Veljkova 2',
        city: 'Šabac',
        contactPerson: 'Dragan Savić',
        phone: '0657778899',
        userType: 'GENERATOR',
        bio: 'Hemijska industrija sa potrebom za redovnim odvožanjem hemijskog otpada.',
        verified: false,
      },
    }),
    prisma.user.create({
      data: {
        email: 'zeleniput@test.rs',
        passwordHash: password,
        companyName: 'Zeleni Put Reciklaža',
        pib: '100000006',
        address: 'Cara Dušana 88',
        city: 'Niš',
        contactPerson: 'Milica Đorđević',
        phone: '0669990011',
        userType: 'COLLECTOR',
        bio: 'Specijalizovani za sakupljanje i sortiranje komunalnog otpada i ambalaže.',
        verified: true,
      },
    }),
  ])

  console.log(`Created ${users.length} users`)

  // Create permits for each user
  for (const user of users) {
    await prisma.permit.create({
      data: {
        userId: user.id,
        fileUrl: '/uploads/permits/placeholder.pdf',
        fileName: 'dozvola-za-upravljanje-otpadom.pdf',
        permitType: user.userType === 'COLLECTOR' ? 'collection' : 'storage',
        status: user.verified ? 'APPROVED' : 'PENDING',
      },
    })
  }

  console.log('Created permits')

  // Create listings
  const listingsData = [
    {
      userId: users[2].id, // Gradnja Plus - GENERATOR
      title: 'Građevinski šut — beton i cigla',
      description: 'Veliki komadi betona i cigle od rušenja stare zgrade u centru Beograda. Materijal je čist, bez azbestnih primesa. Potrebno organizovati transport sa lokacije. Dostupno odmah.',
      wasteIndexNumber: '17 01 07',
      wasteCategory: '17',
      quantity: 50,
      unit: 'tona',
      pricePerUnit: 500,
      city: 'Beograd',
      address: 'Skadarska 15',
    },
    {
      userId: users[2].id,
      title: 'Stara drvena građa — grede i daske',
      description: 'Drvene grede i daske od renoviranja krovne konstrukcije. Drvo je suvo, bez tretmana hemikalijama. Idealno za reciklažu ili biomasu.',
      wasteIndexNumber: '17 02 01',
      wasteCategory: '17',
      quantity: 8,
      unit: 'tona',
      pricePerUnit: 2000,
      city: 'Beograd',
      address: 'Vojvode Stepe 200',
    },
    {
      userId: users[3].id, // Fabrika Plastike - GENERATOR
      title: 'PET flaše — presovane bale',
      description: 'Presovane bale PET flaša iz proizvodnog procesa. Čist materijal bez primesa, sortiran po boji. Redovna mesečna količina. Mogućnost dugogodišnjeg ugovora.',
      wasteIndexNumber: '15 01 02',
      wasteCategory: '15',
      quantity: 5000,
      unit: 'kg',
      pricePerUnit: 35,
      city: 'Kragujevac',
    },
    {
      userId: users[3].id,
      title: 'HDPE plastični otpad',
      description: 'Otpadni HDPE materijal iz proizvodnje — odsečci, škart komadi i neiskorišćeni granulat. Materijal je čist i spreman za regranulaciju.',
      wasteIndexNumber: '15 01 02',
      wasteCategory: '15',
      quantity: 3000,
      unit: 'kg',
      pricePerUnit: 45,
      city: 'Kragujevac',
    },
    {
      userId: users[3].id,
      title: 'Polipropilenska folija — ostatak',
      description: 'Ostatak PP folije iz pakovanja. Čist materijal, rolne različitih dimenzija. Ukupna količina oko 2 tone mesečno.',
      wasteIndexNumber: '15 01 02',
      wasteCategory: '15',
      quantity: 2000,
      unit: 'kg',
      pricePerUnit: 30,
      city: 'Kragujevac',
    },
    {
      userId: users[4].id, // HemInd - GENERATOR
      title: 'Otpadna kiselina — sumporna',
      description: 'Razblažena sumporna kiselina iz proizvodnog procesa, koncentracija ispod 10%. Potreban adekvatan transport i dozvola za opasan otpad.',
      wasteIndexNumber: '06 01 01',
      wasteCategory: '06',
      quantity: 500,
      unit: 'litar',
      pricePerUnit: null,
      city: 'Šabac',
    },
    {
      userId: users[4].id,
      title: 'Istrošeni filteri sa hemikalijama',
      description: 'Upotrebljeni industrijski filteri kontaminirani hemijskim materijama. Klasifikovani kao opasan otpad. Potrebna firma sa dozvolom za opasan otpad.',
      wasteIndexNumber: '15 02 02',
      wasteCategory: '15',
      quantity: 200,
      unit: 'kg',
      pricePerUnit: null,
      city: 'Šabac',
    },
    {
      userId: users[0].id, // Eko Reciklaža - COLLECTOR
      title: 'Otkupljujemo stari papir i karton',
      description: 'Otkupljujemo sve vrste starog papira i kartona u velikim količinama. Dolazimo na adresu, obezbeđujemo kontejnere i transport. Plaćanje odmah pri preuzimanju.',
      wasteIndexNumber: '15 01 01',
      wasteCategory: '15',
      quantity: 10000,
      unit: 'kg',
      pricePerUnit: 15,
      city: 'Novi Sad',
    },
    {
      userId: users[0].id,
      title: 'Otkup PET ambalaže — sve boje',
      description: 'Kupujemo PET ambalažu svih boja. Presovana ili nepresovana. Obezbeđujemo pres kontejnere za veće količine. Redovna saradnja sa fabrikama i trgovinama.',
      wasteIndexNumber: '15 01 02',
      wasteCategory: '15',
      quantity: 5000,
      unit: 'kg',
      pricePerUnit: 30,
      city: 'Novi Sad',
    },
    {
      userId: users[1].id, // Metal Servis - COLLECTOR
      title: 'Otkup starog gvožđa',
      description: 'Otkupljujemo staro gvožđe svih vrsta — profili, limovi, cevi, mašinski delovi. Dolazimo na lokaciju sa sopstvenim transportom. Vaga na licu mesta.',
      wasteIndexNumber: '17 04 05',
      wasteCategory: '17',
      quantity: 20000,
      unit: 'kg',
      pricePerUnit: 25,
      city: 'Novi Sad',
    },
    {
      userId: users[1].id,
      title: 'Otkup aluminijumskih limenki',
      description: 'Kupujemo aluminijumske limenke u svim količinama. Presovane ili rasute. Konkurentna cena sa isplatom na licu mesta.',
      wasteIndexNumber: '17 04 02',
      wasteCategory: '17',
      quantity: 2000,
      unit: 'kg',
      pricePerUnit: 120,
      city: 'Novi Sad',
    },
    {
      userId: users[1].id,
      title: 'Otkup bakra i bakarnih legura',
      description: 'Otkupljujemo bakar u svim oblicima — kablovi, cevi, ploče, strugotina. Nudimo najbolje cene na tržištu uz brzu isplatu.',
      wasteIndexNumber: '17 04 01',
      wasteCategory: '17',
      quantity: 500,
      unit: 'kg',
      pricePerUnit: 800,
      city: 'Novi Sad',
    },
    {
      userId: users[2].id,
      title: 'Stari keramički pločice',
      description: 'Skinutne keramičke pločice sa renoviranja kupatila i kuhinja. Razne dimenzije i boje. Bez lepka na poleđini.',
      wasteIndexNumber: '17 01 03',
      wasteCategory: '17',
      quantity: 3,
      unit: 'tona',
      pricePerUnit: 300,
      city: 'Beograd',
    },
    {
      userId: users[5].id, // Zeleni Put - COLLECTOR
      title: 'Otkup staklene ambalaže',
      description: 'Otkupljujemo sve vrste staklene ambalaže — flaše, tegle, lomljeno staklo. Sortiranje nije potrebno. Organizujemo prevoz za količine preko 500kg.',
      wasteIndexNumber: '15 01 07',
      wasteCategory: '15',
      quantity: 3000,
      unit: 'kg',
      pricePerUnit: 8,
      city: 'Niš',
    },
    {
      userId: users[5].id,
      title: 'Sakupljamo elektronski otpad',
      description: 'Preuzimamo sve vrste elektronskog otpada — računari, monitori, štampači, mobilni telefoni, kablovi. Besplatan odvoz za količine preko 100kg.',
      wasteIndexNumber: '16 02 14',
      wasteCategory: '16',
      quantity: 1000,
      unit: 'kg',
      pricePerUnit: null,
      city: 'Niš',
    },
    {
      userId: users[3].id,
      title: 'Plastični poklopci — mešane boje',
      description: 'Plastični poklopci od flaša, mešane boje. Materijal: pretežno PP i HDPE. Dostupno odmah, redovna mesečna količina.',
      wasteIndexNumber: '15 01 02',
      wasteCategory: '15',
      quantity: 800,
      unit: 'kg',
      pricePerUnit: 20,
      city: 'Kragujevac',
    },
    {
      userId: users[0].id,
      title: 'Otkup tekstilnog otpada',
      description: 'Otkupljujemo staru odeću, tekstilne ostatke iz proizvodnje i industrijske krpe. Količine od 200kg naviše.',
      wasteIndexNumber: '04 02 22',
      wasteCategory: '04',
      quantity: 5000,
      unit: 'kg',
      pricePerUnit: 10,
      city: 'Novi Sad',
    },
    {
      userId: users[4].id,
      title: 'Otpadno motorno ulje',
      description: 'Upotrebljeno motorno ulje iz mašina i voznog parka fabrike. Sakupljeno u IBC kontejnerima od 1000L. Ukupno 3 kontejnera.',
      wasteIndexNumber: '13 02 08',
      wasteCategory: '13',
      quantity: 3000,
      unit: 'litar',
      pricePerUnit: null,
      city: 'Šabac',
    },
    {
      userId: users[5].id,
      title: 'Otkup starih auto guma',
      description: 'Preuzimamo stare auto gume svih dimenzija. Gume se koriste za energetsko iskorišćenje ili reciklažu u gumeni granulat.',
      wasteIndexNumber: '16 01 03',
      wasteCategory: '16',
      quantity: 2000,
      unit: 'komad',
      pricePerUnit: null,
      city: 'Niš',
    },
    {
      userId: users[2].id,
      title: 'Metalna konstrukcija — stari hangar',
      description: 'Demontirana metalna konstrukcija starog hangara. Čelični profili, nosači i limovi. Ukupna težina oko 15 tona. Potreban kran za utovar.',
      wasteIndexNumber: '17 04 05',
      wasteCategory: '17',
      quantity: 15,
      unit: 'tona',
      pricePerUnit: 20000,
      city: 'Beograd',
      address: 'Autoput za Niš bb',
    },
  ]

  for (const data of listingsData) {
    await prisma.listing.create({ data })
  }

  console.log(`Created ${listingsData.length} listings`)

  // Create a sample conversation with messages
  const conv = await prisma.conversation.create({
    data: {
      listingId: (await prisma.listing.findFirst({ where: { userId: users[2].id } }))!.id,
      participant1Id: [users[0].id, users[2].id].sort()[0],
      participant2Id: [users[0].id, users[2].id].sort()[1],
    },
  })

  await prisma.message.createMany({
    data: [
      { conversationId: conv.id, senderId: users[0].id, content: 'Dobar dan! Zanima me vaš oglas za građevinski šut. Da li je materijal još dostupan?', read: true },
      { conversationId: conv.id, senderId: users[2].id, content: 'Zdravo! Da, materijal je još uvek dostupan. Možete doći da pogledate kad god vam odgovara.', read: true },
      { conversationId: conv.id, senderId: users[0].id, content: 'Odlično. Da li biste mogli da organizujete utovar ili treba da dovedemo svoju mehanizaciju?', read: true },
      { conversationId: conv.id, senderId: users[2].id, content: 'Imamo bager na lokaciji koji može da utovari. Treba vam samo kamion za transport.', read: false },
    ],
  })

  console.log('Created sample conversation with messages')
  console.log('\n✅ Seed complete!')
  console.log('\nTest accounts (password: test1234):')
  for (const u of users) {
    console.log(`  ${u.email} — ${u.companyName} (${u.userType})`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
