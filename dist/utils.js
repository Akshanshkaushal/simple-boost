export const linkFallback = (paymentRequest) => {
    const src = `lightning:${paymentRequest}`;
    const link = document.createElement('a');
    link.href = src;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export const requestInvoice = (lnurl, sats) => {
    let url = lnurl;
    if (lnurl.match(/@/)) {
        const [user, host] = lnurl.split('@');
        url = `https://${host}/.well-known/lnurlp/${user}`;
    }
    return fetch(url)
        .then((response) => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error('Network response was not OK');
        }
    })
        .then((lnurl) => {
        const url = new URL(lnurl.callback);
        const amount = sats * 1000;
        url.searchParams.set('amount', amount.toString());
        return fetch(url.toString()).then((response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Invoice creation failed');
            }
        });
    });
};
//# sourceMappingURL=utils.js.map