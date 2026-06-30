import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PolitikaPrivatnosti() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Politika privatnosti</h1>
            <p className="text-primary-100 mt-2">Poslednja izmena: 22. jun 2026.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="prose prose-gray max-w-none space-y-8">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Rukovalac podataka</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rukovalac ličnih podataka korisnika portala Reciklaža.rs je <strong>PORT 22 Mihailo Đorđević PR</strong>, matični broj: 65790777, PIB: 111988991 (u daljem tekstu: „Rukovalac"). Rukovalac se obavezuje da obradu ličnih podataka vrši u skladu sa Zakonom o zaštiti podataka o ličnosti Republike Srbije (ZZPL) i svim drugim primenjivim propisima.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Podaci koji se prikupljaju</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Prilikom registracije i korišćenja Portala, prikupljamo sledeće kategorije podataka:
              </p>
              <h3 className="text-base font-semibold text-gray-800 mb-2">2.1. Podaci o pravnom licu / preduzetniku</h3>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600 mb-4">
                <li>Naziv firme / preduzetničke radnje</li>
                <li>Poreski identifikacioni broj (PIB)</li>
                <li>Adresa sedišta i grad</li>
                <li>Ime i prezime kontakt osobe</li>
                <li>Broj telefona (opciono)</li>
                <li>Email adresa</li>
                <li>Tip korisnika (generator ili sakupljač otpada)</li>
              </ul>
              <h3 className="text-base font-semibold text-gray-800 mb-2">2.2. Dokumentacija</h3>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600 mb-4">
                <li>Dozvole za sakupljanje, skladištenje, transport ili tretman otpada (kopije u PDF ili slikovnom formatu)</li>
              </ul>
              <h3 className="text-base font-semibold text-gray-800 mb-2">2.3. Podaci generisani korišćenjem Portala</h3>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
                <li>Sadržaj oglasa (tekst, slike, klasifikacija otpada, količina, cena, lokacija)</li>
                <li>Poruke razmenjene sa drugim korisnicima putem sistema za komunikaciju</li>
                <li>IP adresa, tip pretraživača i uređaj (za tehničke i bezbednosne svrhe)</li>
                <li>Datum i vreme registracije, prijave i aktivnosti na Portalu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Svrha obrade podataka</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Podaci se obrađuju u sledeće svrhe:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
                <li><strong>Pružanje usluge</strong> — kreiranje i održavanje korisničkog naloga, omogućavanje objavljivanja oglasa i komunikacije između korisnika</li>
                <li><strong>Verifikacija korisnika</strong> — provera priloženih dozvola i poslovnih podataka radi obezbeđivanja pouzdanosti platforme</li>
                <li><strong>Bezbednost</strong> — sprečavanje zloupotreba, prevara, neovlašćenog pristupa i zaštita integriteta Portala</li>
                <li><strong>Komunikacija</strong> — obaveštavanje korisnika o bitnim promenama na Portalu, uslovima korišćenja ili tehničkim pitanjima</li>
                <li><strong>Poboljšanje usluge</strong> — analiza korišćenja Portala u cilju unapređenja funkcionalnosti i korisničkog iskustva</li>
                <li><strong>Zakonske obaveze</strong> — ispunjavanje obaveza predviđenih zakonom, uključujući saradnju sa nadležnim organima na osnovu validnog pravnog zahteva</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Pravni osnov obrade</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Obrada ličnih podataka vrši se na osnovu: (a) pristanka korisnika datog prilikom registracije; (b) neophodnosti za izvršenje ugovora o korišćenju Portala; (c) legitimnog interesa Rukovaoca za obezbeđivanje bezbednosti i funkcionalnosti Portala; i (d) zakonskih obaveza Rukovaoca.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Deljenje podataka sa trećim stranama</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Rukovalac <strong>ne prodaje, ne iznajmljuje i ne ustupa</strong> lične podatke korisnika trećim stranama u komercijalne svrhe.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Podaci mogu biti deljeni sa trećim stranama isključivo u sledećim slučajevima:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
                <li><strong>Pružaoci tehničkih usluga</strong> — hosting provajderi, servisi za upravljanje bazom podataka i drugi pružaoci tehničke infrastrukture neophodne za rad Portala, koji su obavezani ugovornim odredbama o zaštiti podataka</li>
                <li><strong>Nadležni organi</strong> — na osnovu validnog sudskog naloga, zahteva inspekcijskih organa ili drugih zakonom predviđenih postupaka</li>
                <li><strong>Javno dostupni podaci</strong> — podaci iz korisničkog profila koji su namenjeni javnom prikazu (naziv firme, grad, tip korisnika, opis delatnosti) vidljivi su drugim registrovanim korisnicima Portala</li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                <strong>Broj telefona i email adresa korisnika se nikada ne prikazuju javno</strong> drugim korisnicima na Portalu. Sva komunikacija se odvija isključivo putem ugrađenog sistema za poruke.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Zaštita podataka</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Rukovalac primenjuje odgovarajuće tehničke i organizacione mere za zaštitu ličnih podataka od neovlašćenog pristupa, gubitka, oštećenja ili uništenja, uključujući:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
                <li>Enkripciju lozinki korišćenjem savremenih kriptografskih algoritama (bcrypt)</li>
                <li>Zaštitu komunikacije putem HTTPS protokola</li>
                <li>Kontrolu pristupa podacima na osnovu principa minimalnih privilegija</li>
                <li>Redovno ažuriranje softverskih komponenti i sigurnosnih zakrpa</li>
                <li>Ograničenje broja zahteva (rate limiting) radi sprečavanja zlonamernih napada</li>
                <li>Validaciju i sanitizaciju svih korisničkih unosa radi sprečavanja ubacivanja zlonamernog koda</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Period čuvanja podataka</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Lični podaci korisnika čuvaju se dok je korisnički nalog aktivan. Nakon brisanja naloga, podaci se brišu u roku od 30 dana, osim podataka koje smo zakonski obavezni da čuvamo duže (npr. podaci vezani za izvršene transakcije čuvaju se u skladu sa važećim propisima o računovodstvu i poreskim obavezama). Anonimizovani, agregatni podaci mogu se čuvati neograničeno u statističke svrhe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Prava korisnika</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                U skladu sa Zakonom o zaštiti podataka o ličnosti, svaki korisnik ima sledeća prava:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
                <li><strong>Pravo na pristup</strong> — pravo da zahtevate informaciju o tome da li i koji vaši podaci se obrađuju</li>
                <li><strong>Pravo na ispravku</strong> — pravo da zahtevate ispravku netačnih ili nepotpunih podataka</li>
                <li><strong>Pravo na brisanje</strong> — pravo da zahtevate brisanje svojih podataka kada za obradom više ne postoji potreba ili pravni osnov</li>
                <li><strong>Pravo na ograničenje obrade</strong> — pravo da zahtevate ograničenje obrade u određenim situacijama predviđenim zakonom</li>
                <li><strong>Pravo na prenosivost podataka</strong> — pravo da dobijete svoje podatke u strukturiranom, mašinski čitljivom formatu</li>
                <li><strong>Pravo na prigovor</strong> — pravo da uložite prigovor na obradu podataka koja se vrši na osnovu legitimnog interesa</li>
                <li><strong>Pravo na povlačenje pristanka</strong> — pravo da u svakom trenutku povučete pristanak za obradu podataka, pri čemu povlačenje ne utiče na zakonitost obrade izvršene pre povlačenja</li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                Za ostvarivanje ovih prava, kontaktirajte nas na: <strong>office@reciklaza.rs</strong>. Na vaš zahtev odgovorićemo u roku od 30 dana.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                Ukoliko smatrate da je obrada vaših podataka izvršena suprotno zakonu, imate pravo da uložite pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti Republike Srbije.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Kolačići (Cookies)</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Portal koristi kolačiće isključivo u tehničke svrhe neophodne za funkcionisanje platforme (npr. održavanje korisničke sesije nakon prijave). Ne koristimo kolačiće za praćenje, reklamiranje ili analitiku trećih strana. Korišćenjem Portala, pristajete na upotrebu neophodnih tehničkih kolačića.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Izmene politike privatnosti</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rukovalac zadržava pravo da izmeni ovu Politiku privatnosti u bilo kom trenutku. Sve izmene biće objavljene na ovoj stranici sa ažuriranim datumom poslednje izmene. Nastavak korišćenja Portala nakon objavljivanja izmenjene Politike privatnosti smatra se prihvatanjem tih izmena.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Kontakt</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Za sva pitanja u vezi sa zaštitom vaših ličnih podataka, možete nas kontaktirati na: <strong>office@reciklaza.rs</strong>
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600">
                <p><strong>PORT 22 Mihailo Đorđević PR</strong></p>
                <p>Matični broj: 65790777</p>
                <p>PIB: 111988991</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
