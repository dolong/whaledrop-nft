// chrome.devtools.network.onRequestFinished.addListener(request => {
//     request.getContent((body) => {
//       if (request.request && request.request.url) {
//         if (request.request.url.includes('<url-to-intercept>')) {
//           chrome.runtime.sendMessage({
//               response: body
//           });
//         }
//       }
//     });
//   });

var _open = XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, URL) {
    var _onreadystatechange = this.onreadystatechange,
        _this = this;

    _this.onreadystatechange = function() {
        // catch only completed 'api/search/universal' requests
        console.log(_this.status, _this.readyState)
        if (_this.readyState === 4 && _this.status === 200 && ~URL.indexOf('api.treasureland.market')) {
            try {
                //////////////////////////////////////
                // THIS IS ACTIONS FOR YOUR REQUEST //
                //             EXAMPLE:             //
                //////////////////////////////////////
                var data = JSON.parse(_this.responseText); // {"fields": ["a","b"]}
                //console.log(_this.responseText)
                // if (data.fields) {
                //     data.fields.push('c','d');
                // }

                // // rewrite responseText
                // Object.defineProperty(_this, 'responseText', {value: JSON.stringify(data)});
                /////////////// END //////////////////
            } catch (e) {}

            console.log('Caught! :)', method, URL /*, _this.responseText*/ );
        }
        // call original callback
        if (_onreadystatechange) _onreadystatechange.apply(this, arguments);
    };

    // detect any onreadystatechange changing
    Object.defineProperty(this, "onreadystatechange", {
        get: function() {
            return _onreadystatechange;
        },
        set: function(value) {
            _onreadystatechange = value;
        }
    });

    return _open.apply(_this, arguments);
};
/*
{"code":0,"message":"Success","data":{"image_path":"https://treasureland.market/","items":[
    {"token_id":"31911","name":"grateful bonefish","description":"","image":"images/bsc/ALPACA_NFT/31911.svg",
    "extra":"{\"name\":
    \"grateful bonefish\",\"description\":\"\",\"image\":\"https://d2jscuii9czrw5.cloudfront.net/alpacas/svg/31911.svg\",\"external_url\":\"https://alpaca.city/alpaca/31911\",\"background_color\":\"#EFEEC0\",\"attributes\":[{\"trait_type\":\"accent_color\",\"value\":\"your pink\"},{\"trait_type\":\"base_color\",\"value\":\"palest pearl\"},{\"trait_type\":\"ears\",\"value\":\"trumpet\"},{\"trait_type\":\"eye_color\",\"value\":\"red\"},{\"trait_type\":\"eye_shape\",\"value\":\"doubt\"},{\"trait_type\":\"hairs\",\"value\":\"cloud\"},{\"trait_type\":\"highlight_color\",\"value\":\"portage\"},{\"trait_type\":\"mouth\",\"value\":\"singing\"},{\"trait_type\":\"pattern\",\"value\":\"inferno\"}
*/