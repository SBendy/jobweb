/**
 * Загружает content/<тип>/<slug>/meta.json относительно страницы в pages/
 */
(function () {
    const body = document.body;
    const root = body.dataset.contentRoot;
    if (!root) return;

    const metaUrl = new URL(`${root.replace(/\/$/, '')}/meta.json`, window.location.href);

    function resolveImageUrl(image) {
        if (!image) return null;
        if (/^https?:\/\//i.test(image) || image.startsWith('/')) return image;
        const baseDir = new URL('.', metaUrl).href;
        if (image.startsWith('../')) {
            return new URL(image, window.location.href).href;
        }
        return new URL(image, baseDir).href;
    }

    fetch(metaUrl.href)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('meta'))))
        .then((meta) => {
            if (meta.pageTitle) document.title = meta.pageTitle;

            const imageUrl = resolveImageUrl(meta.image);
            if (imageUrl) {
                body.style.backgroundImage = `url('${imageUrl}')`;
            }

            const elLabel = document.getElementById('detail-label');
            const elTitle = document.getElementById('detail-title');
            const elText = document.getElementById('detail-text');
            const elDate = document.getElementById('detail-date');

            if (elLabel && meta.label != null) elLabel.textContent = meta.label;
            if (elTitle && meta.title != null) elTitle.textContent = meta.title;
            if (elText && meta.body != null) elText.textContent = meta.body;

            if (elDate) {
                if (meta.date) {
                    elDate.textContent = meta.date;
                    elDate.hidden = false;
                } else {
                    elDate.hidden = true;
                }
            }

            const primary = document.getElementById('detail-btn-primary');
            const secondary = document.getElementById('detail-btn-secondary');
            if (primary && meta.primaryButton) {
                if (meta.primaryButton.text) primary.textContent = meta.primaryButton.text;
                if (meta.primaryButton.href) primary.href = meta.primaryButton.href;
            }
            if (secondary && meta.secondaryButton) {
                if (meta.secondaryButton.text) secondary.textContent = meta.secondaryButton.text;
                if (meta.secondaryButton.href) secondary.href = meta.secondaryButton.href;
                if (meta.secondaryButton.hidden) secondary.style.display = 'none';
            }
        })
        .catch(() => {
            /* фон и текст из HTML */
        });
})();
