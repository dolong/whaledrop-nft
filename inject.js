// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script lets you fix all eggs on the treasureland site
// @author       You
// @match        https://www.treasureland.market/
// @icon         https://www.google.com/s2/favicons?domain=treasureland.market
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var _open = XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, URL) {
        var _onreadystatechange = this.onreadystatechange,
            _this = this;

        _this.onreadystatechange = function() {
            if (_this.readyState === 4 && _this.status === 200 && ~URL.indexOf('api.treasureland.market')) {
                try {
                    var data = JSON.parse(_this.responseText);

                    let alpacaRequest = URL

                    let alpacaId = alpacaRequest.substring(alpacaRequest.indexOf("token_id=") + 9, alpacaRequest.length)
                    let alpacaImage = `https://d2jscuii9czrw5.cloudfront.net/alpacas/svg/${alpacaId}.svg`;


                    //change the image
                    console.log(data.data.items[0].image)

                    let image = data.data.items[0].image


                    if (image.includes("egg")) {
                        data.data.items[0].image = alpacaImage;
                        data.data.image_path = "";
                    }


                    // // rewrite responseText
                    Object.defineProperty(_this, 'responseText', { value: JSON.stringify(data) });
                    /////////////// END //////////////////
                } catch (e) {}

                //console.log('Caught! :)', method, URL /*, _this.responseText*/ );
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
})();