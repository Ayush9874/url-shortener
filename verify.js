async function runTests() {
    const baseUrl = 'http://localhost:3000/shorten';
    
    console.log('Running API Tests...\n');

    // 1. Create a short URL
    let res = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com/test' })
    });
    let data = await res.json();
    console.log('1. CREATE (POST)', res.status, data);
    const shortCode = data.shortCode;

    if (!shortCode) {
        console.error('Failed to get shortCode');
        process.exit(1);
    }

    // 2. Retrieve the original URL
    res = await fetch(`${baseUrl}/${shortCode}`);
    data = await res.json();
    console.log('\n2. GET (Retrieve)', res.status, data);

    // 3. Get URL Stats
    res = await fetch(`${baseUrl}/${shortCode}/stats`);
    data = await res.json();
    console.log('\n3. GET STATS', res.status, data);

    // 4. Update the URL
    res = await fetch(`${baseUrl}/${shortCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com/updated' })
    });
    data = await res.json();
    console.log('\n4. UPDATE (PUT)', res.status, data);

    // 5. Delete the URL
    res = await fetch(`${baseUrl}/${shortCode}`, { method: 'DELETE' });
    console.log('\n5. DELETE', res.status);

    // 6. Verify Delete
    res = await fetch(`${baseUrl}/${shortCode}`);
    data = await res.json();
    console.log('\n6. VERIFY DELETE (expected 404)', res.status, data);
}

runTests().catch(console.error);
