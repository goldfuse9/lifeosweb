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

### Cloudflare
1. Cloudflare → **Workers & Pages → Create** → import repozitáře `lifeosweb` z GitHubu.
2. Název projektu **`lifeosweb`** (musí sedět s `name` ve `wrangler.jsonc`).
3. V **Advanced settings → Path** nechat **`/`** (kořen repa) — co se nasadí, určuje
   `wrangler.jsonc` (složka `web/`). Build příkaz výchozí (`npx wrangler deploy`).
4. Web poběží na `https://lifeosweb.<účet>.workers.dev`. Každý push do `main` se nasadí sám.
5. Vlastní doména: v projektu **Settings → Domains & Routes → Add → Custom domain** →
   `romarte.cz` a `www.romarte.cz`. Doména musí mít DNS na Cloudflare — u Active24 se změní
   nameservery na ty, které ukáže Cloudflare. Předtím zkontrolovat, že Cloudflare načetl
   všechny DNS záznamy, hlavně **MX** (e-mail) a ověřovací TXT.

Na jedné doméně může v jednu chvíli běžet jen jeden hosting. Netlify může dál
běžet na své adrese `*.netlify.app` jako záloha nebo testovací verze.
