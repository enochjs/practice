// data from: https://www.hublot.com/en-us/find-your-hublot/classic-fusion

let items = document.querySelectorAll('.ts_watch')
let doc = [];
for(let i = 0; i < items.length; i++) {
    const item = items[i];
    const img = item.querySelector('img').src;
    const price = item.querySelector('.ts_watch__price').innerText;
    const collection = item.querySelector('.ts_watch__collection').innerText;
    const subcollection = item.querySelector('.ts_watch__subcollection').innerText;

    doc.push({
        img,
        price,
        collection,
        subcollection
    })
}

copy(JSON.stringify(doc, null, 2))