// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.

var alpacaObjects = [].slice.apply(document.getElementsByClassName("hbLMfh"));

alpacaObjects = alpacaObjects.map(async function(element) {
    name = JSON.stringify(element);

    var statusListing = element.children[0].textContent;
    var name = element.children[1].textContent;
    var src = element.children[2].getElementsByTagName("img")[0].src;
    var node = element.children[2];

    var alpacaId = src.substring(src.indexOf("svg/") + 4, src.length - 4);

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
    moreAttrs = getAlpaca(alpacaData)
    for (i in attributes) {
        switch (attributes[i].trait_type) {
            case "energy":
                formattedAttributes += `<tr><td>Energy</td><td>${attributes[i].value}</td></tr>`
                break;
            case "breeding fee reset at":
                formattedAttributes += `<tr><td>Breeding Time</td><td>${attributes[i].value}</td></tr>`
                break;
            case "generation":
                formattedAttributes += `<tr><td>Gen</td><td>${attributes[i].value}</td></tr>`
                break;
        }
    }

    newData = `<tbody><td>
${formattedAttributes}
</td></tbody>`

    var newAlpaca = document.createElement("table");
    newAlpaca.innerHTML = newData + moreAttrs;

    return newAlpaca
}



//Get More Alpaca Info
function getAlpaca(alpacaJson) {

    //Sort the Important traits
    const traits = alpacaJson.attributes
    let attrs = ""

    let fire_trait_count = 0
    let leaf_trait_count = 0
    let lightning_trait_count = 0
    for (var i in traits) {
        switch (traits[i].trait_type) {
            case "accent_color":
                attrs += `<b>Accent Color:</b> ${traits[i].value}`
                break;
            case "accent_color":
                attrs += `<br><b>Accent Color:</b> ${traits[i].value}`
                break;
            case "base_color":
                attrs += `<br><b>Base Color:</b> ${traits[i].value}`
                break;
            case "ears":
                attrs += `<br><b>Ears:</b> ${traits[i].value}`
                break;
            case "eye_color":
                attrs += `<br><b>Eye Color:</b> ${traits[i].value}`
                break;
            case "eye_shape":
                attrs += `<br><b>Eye Shape:</b> ${traits[i].value}`
                break;
            case "hairs":
                attrs += `<br><b>Hair:</b> ${traits[i].value}`
                break;
            case "highlight_color":
                attrs += `<br><b>Highlight Color:</b> ${traits[i].value}`
                break;
            case "mouth":
                attrs += `<br><b>Mouth:</b> ${traits[i].value}`
                break;
            case "pattern":
                attrs += `<br><b>Pattern:</b> ${traits[i].value}`
                break;
            case "tail":
                attrs += `<br><b>Tail:</b> ${traits[i].value}`
                break;
        }

        const fireTraits = [
            "passion", "orange", "burnt sienna", "christine",
            "bonfire", "torch",
            "crab pliers", "feathers",
            "onfire", "chad",
            "spark", "spaark",
            "blaze", "inferno"
        ]
        const leafTraits = [
            "grass", "spring green", "jade", "downy",
            "fox", "scepter",
            "batwings",
            "mulan", "cotton candy", "wind wings",
            "leaf"
        ]
        const lightningTraits = [
            "blue violet", "magenta", "studio",
            "lightning", "playboy",
            "deniro",
            "saber", "crack"
        ]
        if (fireTraits.indexOf(traits[i].value) > -1) {
            attrs += `<span style="color:red"> FIRE</span>`
            fire_trait_count++
        }
        if (leafTraits.indexOf(traits[i].value) > -1) {
            attrs += `<span style="color:green"> LEAF</span>`
            leaf_trait_count++
        }
        if (lightningTraits.indexOf(traits[i].value) > -1) {
            attrs += `<span style="color:orange"> LIGHTNING</span>`
            lightning_trait_count++
        }


    }

    if (fire_trait_count == 5)
        attrs += `<h4 style="color: red">FULL FIRE COMBO</h4>`
    else if (leaf_trait_count == 5)
        attrs += `<h4 style="color: green">FULL LEAF COMBO</h4>`
    else if (lightning_trait_count == 5)
        attrs += `<h4 style="color: orange">FULL LIGHTNING COMBO</h4>`
    else {
        attrs +=
            `<br><p>
              <span style="color:red">${fire_trait_count}/5 FIRE</span>
              <span style="color:green">${leaf_trait_count}/5 LEAF</span>
              <span style="color:orange">${lightning_trait_count}/5 LIGHTNING</span>
          </p>`
    }

    return attrs;
}
chrome.extension.sendRequest(alpacaObjects);