document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check if there is a shortcode in the query param
    const urlParams = new URLSearchParams(window.location.search);
    const shortCode = urlParams.get('c');
    
    // REDIRECT MODE
    if (shortCode) {
        document.body.innerHTML = '<div class="redirecting">Redirecting you...</div>';
        try {
            const res = await fetch(`/api/shorten/${shortCode}`);
            if (res.ok) {
                const data = await res.json();
                window.location.replace(data.url);
            } else {
                document.body.innerHTML = '<div class="redirecting" style="color:#ef4444;-webkit-text-fill-color:#ef4444;">Link not found or expired.</div>';
            }
        } catch (e) {
            document.body.innerHTML = '<div class="redirecting" style="color:#ef4444;-webkit-text-fill-color:#ef4444;">Connection error.</div>';
        }
        return;
    }

    // 2. MAIN APP MODE
    const form = document.getElementById('shorten-form');
    const input = document.getElementById('url-input');
    const resultContainer = document.getElementById('result-container');
    const shortUrlEl = document.getElementById('short-url');
    const copyBtn = document.getElementById('copy-btn');
    const button = form.querySelector('button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalUrl = input.value.trim();
        if (!originalUrl) return;

        button.textContent = 'Shortening...';
        button.disabled = true;

        try {
            const res = await fetch('/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: originalUrl })
            });

            if (res.ok) {
                const data = await res.json();
                
                // Construct the redirect URL that the user can share
                const fullShortUrl = `${window.location.origin}/?c=${data.shortCode}`;
                
                shortUrlEl.href = fullShortUrl;
                shortUrlEl.textContent = fullShortUrl;
                
                resultContainer.classList.remove('hidden');
                copyBtn.textContent = 'Copy';
                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                input.value = '';
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (err) {
            alert('Failed to connect to the server.');
        } finally {
            button.textContent = 'Shorten';
            button.disabled = false;
        }
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shortUrlEl.href);
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'rgba(74, 222, 128, 0.4)';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            }, 2500);
        } catch (err) {
            alert('Failed to copy. Please copy the link manually.');
        }
    });
});
