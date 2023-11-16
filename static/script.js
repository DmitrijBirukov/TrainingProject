let xhr = XMLHttpRequest();
let host = window.location.host;
let url = `${host}files?root=${root}&sortOrder=${sortOrder}`;
xhr.open('GET', url)
xhr.send();
if (xhr.status !== 200) {
        alert(`${xhr.status}: ${xhr.statusText}`)
}