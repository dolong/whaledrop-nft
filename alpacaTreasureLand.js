// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.

var alpacaObjects = [].slice.apply(document.getElementsByClassName("card"));

alpacaObjects = alpacaObjects.map(async function(element) {
    name = JSON.stringify(element);

    var alpacaId = element.getAttribute("data-id");
    var node = element;


    //fix eggs
    image = element.getElementsByTagName("img");
    if ((image[0].src).indexOf("egg") > 0) {
        image = `https://d2jscuii9czrw5.cloudfront.net/alpacas/svg/${alpacaId}.svg`
        element.getElementsByTagName("img")[0].src = image
    }

    async function getAlpaca(alpacaId) {
        const Http = new XMLHttpRequest();
        const url = `https://apibsc.alpaca.city/metadata/${alpacaId}`;
        Http.open("GET", url);
        Http.send();

        if (Http.readyState === XMLHttpRequest.DONE) {
            return Http;
        }

        let res;
        const p = new Promise((r) => (res = r));
        Http.onreadystatechange = () => {
            if (Http.readyState === XMLHttpRequest.DONE) {
                res(Http);
            }
        };

        return p;
    }

    const response = await getAlpaca(alpacaId);
    const status = response.status;
    if (status === 0 || (status >= 200 && status < 400)) {
        // The request has been completed successfully

        var newInfo = (formatResponse(response.responseText));

        node.appendChild(newInfo);
    } else {
        // Oh no! There has been an error with the request!
        console.log(`Server Error: ${response.status}`);
    }


    return `AlpacaId: ${alpacaId} `;
});


function formatResponse(response) {
    alpacaData = JSON.parse(response)
    name = alpacaData.name
    attributes = alpacaData.attributes
    formattedAttributes = ""
    for (i in attributes) {
        formattedAttributes += `<tr><td>${attributes[i].trait_type}</td><td>${attributes[i].value}</td></tr>`
    };
    newData = `<tbody><td>
 <tr>${name}</tr>
 ${formattedAttributes}
 </td></tbody>`

    var newAlpaca = document.createElement("table");
    newAlpaca.innerHTML = newData;

    return newAlpaca
}

chrome.extension.sendRequest(alpacaObjects);