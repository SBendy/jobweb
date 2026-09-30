/**
 * Контент главной из content/. Картинки в разметке уже указывают на content/.../assets/ —
 * скрипт подтягивает meta.json при работе через http(s); при file:// без сервера фото остаются из HTML.
 */
(function () {
    function getSiteBaseUrl() {
        const el = document.querySelector('script[src*="home-content.js"]');
        if (el && el.src) {
            return new URL('.', el.src).href;
        }
        return new URL('./', window.location.href).href;
    }

    const siteBase = getSiteBaseUrl();

    function mediaUrl(pathFromRoot) {
        if (!pathFromRoot) return null;
        if (/^https?:\/\//i.test(pathFromRoot)) return pathFromRoot;
        const clean = pathFromRoot.replace(/^\//, '');
        return new URL(clean, siteBase).href;
    }

    function catalogMediaUrl(catalogBase, slug, imagePath) {
        if (!imagePath) return null;
        if (/^https?:\/\//i.test(imagePath)) return imagePath;
        if (imagePath.startsWith('../') || imagePath.startsWith('content/')) {
            return mediaUrl(imagePath);
        }
        const clean = imagePath.replace(/^\//, '');
        return mediaUrl(`${catalogBase}/${slug}/${clean}`);
    }

    function contentFolderUrl(folder, imagePath) {
        if (!imagePath) return null;
        if (/^https?:\/\//i.test(imagePath)) return imagePath;
        if (imagePath.startsWith('../') || imagePath.startsWith('content/')) {
            return mediaUrl(imagePath);
        }
        const clean = imagePath.replace(/^\//, '');
        return mediaUrl(`${folder.replace(/\/$/, '')}/${clean}`);
    }

    async function loadJson(pathFromRoot) {
        const url = mediaUrl(pathFromRoot);
        try {
            const response = await fetch(url);
            if (response.ok) return await response.json();
        } catch (e) {
            /* file:// или сеть */
        }
        return null;
    }

    async function loadMeta(basePath) {
        const path = `${basePath.replace(/\/$/, '')}/meta.json`;
        const data = await loadJson(path);
        if (!data) throw new Error(path);
        return data;
    }

    async function fillHeroBackground() {
        const img = document.querySelector('.hero-bg-img');
        if (!img) return;
        const pool = await loadJson('content/hero/pool.json');
        if (!pool || !Array.isArray(pool.files) || !pool.files.length) return;
        const pick = pool.files[Math.floor(Math.random() * pool.files.length)];
        const nextSrc = contentFolderUrl('content/hero', pick);
        if (nextSrc) img.src = nextSrc;
    }

    async function fillWarrantyImage() {
        const elImg = document.querySelector('.warranty-img');
        if (!elImg) return;
        try {
            const meta = await loadMeta('content/warranty');
            if (meta.image) elImg.src = contentFolderUrl('content/warranty', meta.image);
            if (meta.alt) elImg.alt = meta.alt;
        } catch (e) {
            /* оставляем src из index.html */
        }
    }

    async function fillServiceCards() {
        const cards = document.querySelectorAll('.offer-card[data-catalog="service"]');
        for (const card of cards) {
            const slug = card.dataset.catalogSlug;
            if (!slug) continue;
            try {
                const meta = await loadMeta(`content/services/${slug}`);
                const img = card.querySelector('.offer-img');
                if (img && meta.image) img.src = catalogMediaUrl('content/services', slug, meta.image);
                const titleEl = card.querySelector('.offer-title');
                if (titleEl && meta.title) titleEl.textContent = meta.title;
                const descEl = card.querySelector('.offer-desc');
                if (descEl && meta.description) descEl.textContent = meta.description;
                if (meta.detailPage) {
                    card.setAttribute('data-detail-url', meta.detailPage);
                    card.setAttribute('role', 'link');
                    card.setAttribute('tabindex', '0');
                }
            } catch (e) {
                console.warn('Catalog service:', slug, e);
            }
        }
    }

    async function fillSpecialOfferCards() {
        const cards = document.querySelectorAll('.offer-card[data-catalog="special-offer"]');
        for (const card of cards) {
            const slug = card.dataset.catalogSlug;
            if (!slug) continue;
            try {
                const meta = await loadMeta(`content/special-offers/${slug}`);
                const home = meta.homeCard || {};
                const img = card.querySelector('.offer-img');
                if (img && home.image) img.src = catalogMediaUrl('content/special-offers', slug, home.image);
                const dateEl = card.querySelector('.offer-date');
                if (dateEl && home.date) dateEl.textContent = home.date;
                const titleEl = card.querySelector('.offer-title');
                if (titleEl && home.title) titleEl.textContent = home.title;
                const descEl = card.querySelector('.offer-desc');
                if (descEl && home.description) descEl.textContent = home.description;
                if (home.detailPage) card.setAttribute('data-detail-url', home.detailPage);
            } catch (e) {
                console.warn('Catalog special-offer:', slug, e);
            }
        }
    }

    async function fillNewsCards() {
        const cards = document.querySelectorAll('.news-card[data-catalog="news"]');
        for (const card of cards) {
            const slug = card.dataset.catalogSlug;
            if (!slug) continue;
            try {
                const meta = await loadMeta(`content/news/${slug}`);
                const home = meta.homeCard || {};
                const img = card.querySelector('.news-img');
                if (img && home.image) img.src = catalogMediaUrl('content/news', slug, home.image);
                const dateEl = card.querySelector('.news-date');
                if (dateEl && home.date) dateEl.textContent = home.date;
                const titleEl = card.querySelector('.news-title');
                if (titleEl && home.title) titleEl.textContent = home.title;
                if (home.detailPage) card.setAttribute('data-detail-url', home.detailPage);
            } catch (e) {
                console.warn('Catalog news:', slug, e);
            }
        }
    }

    function initPromoFromCatalog() {
        const promoWidget = document.getElementById('promoWidget');
        const promoClose = document.getElementById('promoClose');
        if (!promoWidget) return Promise.resolve();

        if (promoClose && !promoClose.dataset.bound) {
            promoClose.dataset.bound = '1';
            promoClose.addEventListener('click', () => {
                promoWidget.classList.add('hidden');
                setTimeout(() => {
                    promoWidget.style.display = 'none';
                }, 600);
            });
        }

        return loadMeta('content/promo')
            .then((meta) => {
                const titleEl = promoWidget.querySelector('.promo-title');
                const img = promoWidget.querySelector('.promo-img');
                const btn = promoWidget.querySelector('.btn[data-promo-detail]');

                if (titleEl && meta.title) titleEl.textContent = meta.title;
                if (img && meta.image) img.src = contentFolderUrl('content/promo', meta.image);
                if (img && meta.alt) img.alt = meta.alt;
                if (btn && meta.detailPage) btn.setAttribute('data-detail-url', meta.detailPage);

                const delay = typeof meta.showDelayMs === 'number' ? meta.showDelayMs : 3000;

                setTimeout(() => {
                    promoWidget.style.display = 'block';
                    promoWidget.classList.remove('hidden');
                }, delay);
            })
            .catch(() => {
                setTimeout(() => {
                    promoWidget.style.display = 'block';
                    promoWidget.classList.remove('hidden');
                }, 3000);
            });
    }

    window.loadHomeCatalogContent = async function loadHomeCatalogContent() {
        await Promise.all([
            fillHeroBackground(),
            fillWarrantyImage(),
            fillServiceCards(),
            fillSpecialOfferCards(),
            fillNewsCards()
        ]);
        await initPromoFromCatalog();
    };
})();
