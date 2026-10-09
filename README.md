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
