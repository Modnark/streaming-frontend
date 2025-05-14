async function fetchEndpoint(options={}) {
    const res = await fetch(options.endpointUrl, {
        method: options.method,
        body: options.body,
        headers: options.headers
    });

    return res;
}