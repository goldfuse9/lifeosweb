# LifeOS – web

Prezentační onepage pro aplikaci LifeOS. Čisté HTML a CSS, žádný build.

## Struktura

```
index.html            celá stránka (styly jsou uvnitř)
img/                  snímky obrazovek (vymyšlená data) a ikona aplikace
favicon.png
apple-touch-icon.png
```

## Spuštění lokálně

Stačí otevřít `index.html` v prohlížeči.

## Zveřejnění přes GitHub Pages

1. **Settings → Pages**
2. **Deploy from a branch**, větev `main`, složka `/ (root)`
3. Web poběží na `https://goldfuse9.github.io/lifeosweb/`

## Úpravy

- Cena a zkušební doba: sekce `id="cena"`
- Připravované funkce: sekce `id="brzy"`
- Snímky obrazovek: složka `img/` (390 × 844 px při 2× hustotě)

## Testovací stránka „Nevzpomínej. Ukaž to.“ (Netlify)

Složka `test-horecka/` je samostatná stránka pro test zájmu: rozhovor u doktora,
skutečná obrazovka z aplikace a předobjednávka ročního plánu se slevou.
`netlify.toml` říká Netlify, ať publikuje právě tuhle složku.

- E-maily z předobjednávky se ukládají v Netlify → **Forms → predobjednavka**.
- Počet lidí, kteří klikli na „Předobjednat“, je v **Forms → klik**.
- U nového webu je potřeba v Netlify zapnout **Forms → Enable form detection**
  a pak web nasadit znovu.

### Platba přes Stripe

- Odkaz na Stripe Payment Link se vkládá do `test-horecka/config.js`
  (`window.LIFEOS_STRIPE_LINK = 'https://buy.stripe.com/…'`).
- Prázdný odkaz = jen rezervace e-mailem, nic se neplatí.
- S odkazem: formulář uloží e-mail do Netlify Forms (`krok=platba`)
  a přesměruje na Stripe s předvyplněným e-mailem.
- V Payment Linku nastav po platbě přesměrování na `https://romarte.cz/dekujeme.html`.

## romarte.cz (Netlify) – složka `web/`

- `index.html` – rozcestník napůl: vlevo LifeOS pro rodiny, vpravo Digitální školka
- `rodiny.html` – rozhovor u doktora, video časové osy, co aplikace umí
- `skolky.html` – co ve školce zdržuje, tablet a ředitelna, kdo co vidí
- Bez ceny a bez formulářů. Staré adresy `/predobjednavka` a `/dekujeme` přesměrují na úvod.

## romarte.cz — Netlify i Cloudflare Pages

Nasazuje se složka `web/` (rozcestník `index.html`, `rodiny.html`, `skolky.html`).
Je to čisté HTML bez buildu, takže běží stejně na Netlify i na Cloudflare Pages.
Hlavičky jsou ve `web/_headers`, přesměrování ve `web/_redirects` — oba hostingy
je čtou ze stejných souborů.

### Cloudflare (Workers) — lifeos.romarte.cz
1. Cloudflare → **Workers & Pages → Create** → import repozitáře `lifeosweb` z GitHubu.
2. Název projektu **`lifeosweb`** (musí sedět s `name` ve `wrangler.jsonc`).
3. **Advanced settings → Path: `/`** (kořen repa). Build příkaz výchozí (`npx wrangler deploy`).
   Co se nasadí, určuje `wrangler.jsonc` (složka `web/`).
4. Web poběží na `https://lifeosweb.<účet>.workers.dev`. Každý push do `main` se nasadí sám.
5. Subdoména: Worker umí vlastní doménu jen tehdy, když je DNS domény na Cloudflare.
   - Cloudflare → **Add a domain** → `romarte.cz` (Free) → zkontrolovat načtené záznamy,
     hlavně **MX** (e-mail), TXT a záznamy pro romarte.cz/www (Netlify).
   - U Active24 změnit **nameservery** na ty, které ukáže Cloudflare.
   - Projekt → **Settings → Domains & Routes → Add → Custom domain** → `lifeos.romarte.cz`.
     Záznam i certifikát vytvoří Cloudflare sám.

Na jedné doméně může v jednu chvíli běžet jen jeden hosting. Netlify může dál
běžet na své adrese `*.netlify.app` jako záloha nebo testovací verze.


## Weby na Cloudflare (od listopadu 2026)

| Doména | Složka | Projekt v Cloudflare | Co tam je |
| --- | --- | --- | --- |
| romarte.cz | `romarte/site/` | `romarte` (Path `/romarte`) | vizitka, odkazy na oba projekty |
| lifeos.romarte.cz | `web/` | `lifeosweb` (kořen, `wrangler.jsonc`) | aplikace LifeOS pro rodiny, zásady, podmínky |
| lifeds.romarte.cz | `lifeds/site/` | `lifeds` (Path `/lifeds`) | Digitální školka |

Staré adresy `lifeos.romarte.cz/rodiny` a `/skolky` přesměrují na nové weby (`web/_redirects`).

## Přihlášky testerů pro Android (lifeos.romarte.cz)

Tlačítko „Android“ otevře formulář, který pošle e-mail na `/api/tester` (worker `src/worker.js`).

- Každá přihláška je vidět v Cloudflare → Workers & Pages → lifeosweb → **Logs** (záznam `android-tester`).
- E-mailové upozornění: v Cloudflare zapni e-mail pro doménu romarte.cz a do `wrangler.jsonc` přidej
  `"send_email": [{ "name": "LIFEOS_MAIL", "destination_address": "artejsem@gmail.com" }]`.
  Odesílatel je `web@romarte.cz` (jde změnit proměnnou `MAIL_FROM`).
- Přidání testera: Google Play Console → LifeOS → Testování → Interní testování → Testeři → seznam e-mailů → poslat mu odkaz pro připojení.
