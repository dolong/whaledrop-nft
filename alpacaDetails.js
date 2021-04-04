document.body.onload = async function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')


    alpacaId = id;
    let url = `https://apibsc.alpaca.city/metadata/${alpacaId}`
    console.log(url)

    $.get(url, function(data) {
        alpacaId = url.substring(url.indexOf("metadata/") + 9, url.length)
        $(`#alpacaName`).html(data.name)
        $(`#alpacaId`).html(` (${alpacaId})`)
        $(`#alpacaImage`).attr('src', data.image)
        const traits = data.attributes
        for (var i in traits) {
            switch (traits[i].trait_type) {
                case "energy":
                    $(`#alpacaEnergy`).html(`Energy: ${traits[i].value}`)
                    break;
                case "breeding fee reset at":
                    $(`#alpacaBreedingTime`).html(`Breeding Time: ${unixTimeStampConverter(traits[i].value)}`)
                    break;

                case "generation":
                    $(`#alpacaGeneration`).html(`Gen ${traits[i].value}`)
                    break;
            }
        }
        $(`#alpacaName`).html(data.name)
        $(`#alpacaNFT`).html(getAlpaca(data))
    });
}

function unixTimeStampConverter(unix_timestamp) {
    var dt = new Date(unix_timestamp * 1000);
    dt.setTime(dt.getTime() + dt.getTimezoneOffset() * 60 * 1000);
    var offset = -300; //Timezone offset for EST in minutes.
    var estDate = new Date(dt.getTime() + offset * 60 * 1000);
    return (estDate.toString());
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
        attrs += `<hr><h4 style="color: red">FULL FIRE COMBO</h4>`
    else if (leaf_trait_count == 5)
        attrs += `<hr><h4 style="color: green">FULL LEAF COMBO</h4>`
    else if (lightning_trait_count == 5)
        attrs += `<hr><h4 style="color: orange">FULL LIGHTNING COMBO</h4>`
    else {
        attrs +=
            `<br><hr><p>
                <span style="color:red">${fire_trait_count}/5 FIRE</span>
                <span style="color:green">${leaf_trait_count}/5 LEAF</span>
                <span style="color:orange">${lightning_trait_count}/5 LIGHTNING</span>
            </p>`
    }

    return attrs;
}