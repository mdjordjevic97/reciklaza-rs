import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function UsloviKoriscenja() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Uslovi korišćenja</h1>
            <p className="text-primary-100 mt-2">Poslednja izmena: 22. jun 2026.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="prose prose-gray max-w-none space-y-8">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Opšte odredbe</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Veb portal Reciklaža.rs (u daljem tekstu: „Portal") je vlasništvo preduzetnika <strong>PORT 22 Mihailo Đorđević PR</strong>, matični broj: 65790777, PIB: 111988991 (u daljem tekstu: „Vlasnik portala"). Korišćenjem Portala, svaki korisnik potvrđuje da je pročitao, razumeo i u potpunosti prihvatio ove Uslove korišćenja. Ukoliko se ne slažete sa bilo kojom odredbom ovih Uslova, molimo vas da ne koristite Portal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Priroda usluge i ograničenje odgovornosti</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Portal Reciklaža.rs predstavlja isključivo <strong>onlajn platformu za oglašavanje</strong> koja omogućava registrovanim korisnicima da objavljuju oglase za kupovinu i prodaju otpada, kao i da međusobno komuniciraju putem ugrađenog sistema za poruke.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Vlasnik portala <strong>nije vlasnik, posednik, niti držalac bilo kakvog otpada</strong> koji se oglašava na Portalu. Vlasnik portala ne učestvuje u transakcijama između korisnika, ne posreduje u pregovorima, ne garantuje kvalitet, količinu, vrstu ili bilo koju drugu karakteristiku oglašenog otpada.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Vlasnik portala <strong>ne naplaćuje proviziju</strong> niti bilo kakvu drugu naknadu od transakcija ostvarenih između korisnika putem Portala. Portal ne vrši nikakvu finansijsku obradu niti posredovanje u plaćanjima.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Vlasnik portala <strong>ne snosi nikakvu odgovornost</strong> za:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1.5 text-sm text-gray-600">
                <li>Tačnost, potpunost, istinitost ili ažurnost podataka koje korisnici objavljuju na Portalu</li>
                <li>Kvalitet, vrstu, količinu, sastav ili bilo koju drugu karakteristiku oglašenog otpada</li>
                <li>Zakonitost delatnosti korisnika, uključujući posedovanje potrebnih dozvola za upravljanje otpadom</li>
                <li>Bilo kakvu štetu, gubitak, povredu ili spor koji nastane iz ili u vezi sa transakcijama između korisnika</li>
                <li>Neispunjenje ili neuredno ispunjenje obaveza jednog korisnika prema drugom</li>
                <li>Kršenje propisa o zaštiti životne sredine, upravljanju otpadom ili bilo kojih drugih važećih zakona od strane korisnika</li>
                <li>Tehničke probleme, prekide u radu Portala, gubitak podataka ili bilo kakve druge tehničke smetnje</li>
                <li>Sadržaj poruka razmenjenih između korisnika putem sistema za komunikaciju na Portalu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Registracija i nalog korisnika</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Za korišćenje Portala potrebna je registracija. Prilikom registracije, korisnik je dužan da:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
                <li>Unese <strong>tačne, potpune i ažurne podatke</strong> o svom pravnom licu ili preduzetničkoj radnji, uključujući tačan naziv, PIB, matični broj, adresu sedišta i kontakt podatke</li>
                <li>Odabere odgovarajući tip korisničkog naloga — generator otpada ili sakupljač otpada — u skladu sa svojom stvarnom registrovanom delatnošću</li>
                <li>Priloži <strong>važeće dozvole</strong> za sakupljanje, skladištenje, transport ili tretman otpada, koje su izdate od strane nadležnog organa Republike Srbije</li>
                <li>Redovno ažurira svoje podatke u slučaju bilo kakvih promena (promene adrese, naziva, dozvola i slično)</li>
                <li>Čuva pristupne podatke svog naloga (email adresu i lozinku) i ne deli ih sa trećim licima</li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                Vlasnik portala zadržava pravo da <strong>bez prethodnog obaveštenja suspenduje ili trajno obriše</strong> nalog korisnika koji krši ove Uslove korišćenja, objavljuje netačne podatke, zloupotrebljava Portal ili postupa suprotno važećim zakonskim propisima.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Obaveze korisnika pri objavljivanju oglasa</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Svaki korisnik koji objavljuje oglas na Portalu garantuje i potvrđuje sledeće:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm text-gray-600">
                <li>Oglas sadrži <strong>tačne i istinite podatke</strong> o vrsti otpada, indeksnom broju, količini, ceni, lokaciji i svim drugim navedenim karakteristikama</li>
                <li>Indeksni broj otpada je <strong>pravilno klasifikovan</strong> u skladu sa Katalogom otpada (Pravilnik o kategorijama, ispitivanju i klasifikaciji otpada Republike Srbije)</li>
                <li>Korisnik poseduje <strong>zakonsko pravo</strong> da raspolaže oglašenim otpadom i da obavlja delatnost upravljanja otpadom</li>
                <li>Slike priložene uz oglas verno prikazuju oglašeni otpad i nisu preuzete sa interneta niti iz drugih izvora bez odobrenja</li>
                <li>Oglas ne sadrži lažne, obmanjujuće, uvredljive ili nezakonite informacije</li>
                <li>Korisnik preuzima <strong>punu odgovornost</strong> za svaki oglas koji objavi, kao i za sve posledice koje iz njega proizađu</li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                Zabranjeno je oglašavanje opasnog otpada bez važeće dozvole za upravljanje opasnim otpadom. Zabranjeno je oglašavanje materijala čiji je promet zabranjen zakonom.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Komunikacija između korisnika</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                Sva komunikacija između korisnika odvija se isključivo putem ugrađenog sistema za poruke na Portalu. Objavljivanje ličnih kontakt podataka (broj telefona, email adresa, adresa veb sajta i slično) u porukama ili oglasima nije dozvoljeno. Vlasnik portala zadržava pravo da ukloni sadržaj koji krši ovo pravilo.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Korisnici su dužni da u komunikaciji postupaju profesionalno i u skladu sa dobrim poslovnim običajima. Zabranjeno je slanje neželjenih poruka (spam), pretnji, uvredljivog sadržaja ili bilo kakvog sadržaja koji je u suprotnosti sa zakonom.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Intelektualna svojina</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sav sadržaj Portala, uključujući ali ne ograničavajući se na dizajn, logotip, tekstove, grafičke elemente, softver i bazu podataka, predstavlja intelektualnu svojinu Vlasnika portala i zaštićen je važećim zakonima o autorskim i srodnim pravima. Neovlašćeno kopiranje, distribucija, modifikovanje ili bilo kakvo drugo korišćenje sadržaja Portala bez prethodne pisane saglasnosti Vlasnika portala je strogo zabranjeno.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Ograničenje garancija</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Portal se pruža „u viđenom stanju" (as is) i „kako je dostupno" (as available). Vlasnik portala ne daje nikakve garancije, izričite ili podrazumevane, u pogledu funkcionisanja Portala, dostupnosti, tačnosti informacija ili pogodnosti za određenu namenu. Vlasnik portala ne garantuje neprekidan, bezbedan ili besprekorni rad Portala i ne odgovara za bilo kakvu štetu nastalu usled korišćenja ili nemogućnosti korišćenja Portala.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Izmene uslova korišćenja</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Vlasnik portala zadržava pravo da u bilo kom trenutku izmeni ili dopuni ove Uslove korišćenja bez prethodnog obaveštenja. Izmenjeni uslovi stupaju na snagu danom objavljivanja na Portalu. Nastavak korišćenja Portala nakon objavljivanja izmenjenih uslova smatra se prihvatanjem tih izmena.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Rešavanje sporova</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Na ove Uslove korišćenja primenjuje se pravo Republike Srbije. Svi sporovi koji nastanu u vezi sa korišćenjem Portala rešavaće se pred nadležnim sudom u Beogradu. Pre pokretanja sudskog postupka, korisnici su dužni da pokušaju da spor reše mirnim putem.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Kontakt</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Za sva pitanja u vezi sa ovim Uslovima korišćenja, možete nas kontaktirati na: <strong>office@reciklaza.rs</strong>
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
