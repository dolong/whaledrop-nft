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
                    $(`#alpacaBreedingTime`).html(traits[i].value)
                    break;

                case "generation":
                    $(`#alpacaGeneration`).html(`Gen ${traits[i].value}`)
                    break;
            }
        }
        $(`#alpacaName`).html(data.name)
        $(`#alpacaNFT`).html(getAlpaca(data))
    });

    // Render Alpaca

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
    return attrs;
}




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