# romarte.cz — vizitka a rozcestník

Čisté HTML (`site/index.html`), bez buildu. Odkazuje na LifeOS (lifeos.romarte.cz)
a Digitální školku (lifeds.romarte.cz).

Před zveřejněním doplnit v `site/index.html`: `[E-MAIL]`, `[TELEFON]`, `[IČO]`.

## Cloudflare
1. **Workers & Pages → Create** → import repozitáře `lifeosweb`.
2. Název **`romarte`**, **Advanced settings → Path: `/romarte`**, build příkaz výchozí.
3. V Cloudflare → DNS smazat záznamy `romarte.cz` a `www`, které míří na Netlify
   (MX a TXT nechat).
4. Projekt → **Settings → Domains & Routes → Add → Custom domain** → `romarte.cz`
   a `www.romarte.cz`.
5. V Netlify web smazat nebo odebrat doménu.
