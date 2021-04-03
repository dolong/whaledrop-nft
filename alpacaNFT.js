document.body.onload = async function() {


    const address = new Promise((resolve, reject) => {
        chrome.storage.sync.get("wallet", function(items) {
            document.getElementById("linkedWallet").innerHTML = `Wallet Connected: <span id="address">${(items.wallet)}</span> <a href="navigation.html">Refresh</a>`;
            resolve(items.wallet);
        })
    }).then((address) => {

        // TODO: Refresh on new wallet
        // if (document.getElementById("address").textContent.localeCompare(address) == 0) {
        //     location.reload()
        // }

        //In Use
        let inUseAPI = `https://apibsc.alpaca.city/me/stallions/all?address=${address}&offset=0&orderBy=energy&order=-1`

        //Idle
        let idleAPI = `https://apibsc.alpaca.city/me/alpacas?address=${address}&offset=0&orderBy=energy&order=-1`

        //Squad
        let squadAPI = `https://apibsc.alpaca.city/me/squad?&address=${address}&orderBy=energy&order=-1`

        let callInUseAPI = requestAlpacaCity(inUseAPI, "alpacaDataInUse");
        let callIdleAPI = requestAlpacaCity(idleAPI, "alpacaDataIdle");
        // let callsquadAPI = requestAlpacaCity(squadAPI, "alpacaDataSquad");

        let callAlpacaDataIdle = getAlpacaStorage("alpacaDataIdle")
        let callAlpacaDataInUse = getAlpacaStorage("alpacaDataInUse")
            //let callAlpacaDataSquad = getAlpacaStorage("alpacaDataSquad")
            //const callAlpacaDataSquad = getAlpacaStorage("alpacaDataSquad")

        arrayOfAlpacaCalls = [callInUseAPI, callIdleAPI, , callAlpacaDataIdle, callAlpacaDataInUse, ]
        Promise.all(arrayOfAlpacaCalls).then((values) => {


        })
    })

    // document.getElementById("linkedWallet").innerText = `Wallet Connected: ${(address)}`


    async function requestAlpacaCity(url, storageName) {
        var alpacaCityRequest = new XMLHttpRequest();
        alpacaCityRequest.open('GET', url);
        alpacaCityRequest.onload = async function() {
            alpacaJson = JSON.parse(alpacaCityRequest.responseText)

            await chrome.storage.local.set({
                [storageName]: alpacaJson
            }, function() {

                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
            //console.log('after set')
        }
        await alpacaCityRequest.send();
        //console.log("sent request")

    }

    async function getAlpacaStorage(data) {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.get(data, function(items) {
                if (!chrome.runtime.error) {
                    console.log(`getting ${data} from chrome storage`)

                    //alert(data + JSON.stringify(items))

                    //alert(items[data].data.alpacas)
                    try {
                        let alpacas = items[data].data.alpacas
                            //alert(JSON.stringify(items[data].data.alpacas));

                        for (var i in alpacas) {
                            alpaca = alpacas[i]

                            newHtml =
                                `
                                <div class="ish-p-col  pfilt-theme ish-p-col-w2 ish-p-col-h1" style="visibility: visible; opacity: 1;">
                                    <a href="alpacaDetails.html?id=${alpaca.id}" class="detailsLink">
                                        <div class="ish-p-item">
                                            <div class="ish-p-img" style="background-image: url('${alpaca.svg_url}');"></div>
                                            <div class="ish-p-overlay ish-color5 ish-text-color4"><span style="opacity: 0.9;"></span>
                                                <div>
                                                    <span class="ish-p-title">
                                                        <span class="ish-p-headline">${alpaca.name}</span>
                                                    <span class="ish-p-cat">${alpaca.id}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                `

                            document.getElementById("alpacaNFT").innerHTML += newHtml
                        }
                    } catch (e) {}

                }
                resolve();
            });
        });

    }


    //Get More Alpaca Info
    function getAlpaca(alpacaJson) {

        //Sort the Important traits
        const traits = alpacaJson.attributes
            //console.log(traits)
        let attrs = ""

        for (var i in traits) {
            switch (traits[i].trait_type) {
                case "accent_color":
                    attrs += `<br><b>Accent Color:</b> ${traits[i].value}<br>`
                    break;
                case "base_color":
                    attrs += `<b>Base Color:</b> ${traits[i].value}<br>`
                    break;
                case "ears":
                    attrs += `<b>Ears:</b> ${traits[i].value}<br>`
                    break;
                case "eye_color":
                    attrs += `<b>Eye Color:</b> ${traits[i].value}<br>`
                    break;
                case "eye_shape":
                    attrs += `<b>Eye Shape:</b> ${traits[i].value}<br>`
                    break;
                case "hairs":
                    attrs += `<b>Hair:</b> ${traits[i].value}<br>`
                    break;
                case "highlight_color":
                    attrs += `<b>Highlight Color:</b> ${traits[i].value}<br>`
                    break;
                case "mouth":
                    attrs += `<b>Mouth:</b> ${traits[i].value}<br>`
                    break;
                case "pattern":
                    attrs += `<b>Pattern:</b> ${traits[i].value}<br>`
                    break;
                case "tail":
                    attrs += `<b>Tail:</b> ${traits[i].value}<br>`
                    break;
            }
        }
        console.log(attrs)
        return attrs;
    }
};




// document.getElementById("set").onclick = function() {
//     $(".showTraits").each(function() {
//         alpacaId = ($(this).attr("data-attribute"));
//         let url = `https://apibsc.alpaca.city/metadata/${alpacaId}`
//         console.log(url)
//             // const response = await fetch(url, {});
//             // const json = await response.json();

//         //$(`*[data-attribute="${alpacaId}"`).html("2")

//         $.get(url, function(data) {
//             alpacaId = url.substring(url.indexOf("metadata/") + 9, url.length)
//                 //$(`*[data-attribute="${alpacaId}"`).html(data.name)
//                 //alert("Load was performed.");
//                 //$(`*[data-attribute="${alpacaId}"`).html(JSON.stringify(data.attributes))
//             $(`*[data-attribute="${alpacaId}"`).html(getAlpaca(data))
//         });

//     })
// }