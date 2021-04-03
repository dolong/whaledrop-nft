// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById("set").onclick = function() {
//         //window.close();
//         window.location.href = "navigation.html"
//     }
// });
//]]>
window.onload = function() {

    chrome.storage.sync.get("wallet", function(items) {
        if (document.getElementById("text"))
            document.getElementById("text").value = items.wallet;
    })
    document.getElementById("set").onclick = function() {
        var wallet = document.getElementById("text").value;
        chrome.storage.sync.set({ "wallet": wallet }, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        });
        //window.close();
        window.location.href = "login.html"
    }
    document.getElementById('launchBounce').onclick = alpacaBounce;
    document.getElementById('launchTI').onclick = alpacaTreasureIsland;
}


// Download all visible checked links.
function alpacaBounce() {
    chrome.windows.getCurrent(function(currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id },
            function(activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id, { file: 'alpacaBounce.js', allFrames: true });
            });
    });
}


// Download all visible checked links.
function alpacaTreasureIsland() {
    console.log("launched TL")
    chrome.windows.getCurrent(function(currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id },
            function(activeTabs) {
                chrome.tabs.executeScript(
                    activeTabs[0].id, { file: 'alpacaTreasureLand.js', allFrames: true });
            });
    });
}