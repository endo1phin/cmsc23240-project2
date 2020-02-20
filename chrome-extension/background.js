// sample maleware URL: https://www.wicar.org/test-malware.html

// DELETE API KEY BEFORE COMMITTING TO GIT!!!
const SAFE_BROWSE_API_KEY = 'AIzaSyAGzzkQROCp8aW44pM423857kNMUmGJGJM';
const SAFE_BROWSE_REQ_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=";


let displayedURL = '';

// helper
function getProperty(obj, prop, df) {
    if (obj.hasOwnProperty(prop)) {
        return obj[prop];
    } else {
        return df;
    }
}


// build request body for API fetch
function requestBuilder(entry) {
    let requestBody = {
        client: {
            clientId: 'CMSC23240',
            clientVersion: '2020.2.14'
        },
        threatInfo: {
            threatTypes: [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            platformTypes: ['ALL_PLATFORMS'],
            threatEntryTypes: ['URL'],
            threatEntries: [{
                'url': entry
            }]
        }
    };
    return JSON.stringify(requestBody);
}


// check url through Google's Safe Browsing API
async function checkURL(entry) {
    let url = SAFE_BROWSE_REQ_URL + SAFE_BROWSE_API_KEY;
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: requestBuilder(entry),
    });
    return await response.json();
}


// send signal to local server to execute python script
async function sendSignal(type) {
    fetch(`http://127.0.0.1:5000/release_odor_${type}`,{mode: 'no-cors'});
}



// main function, executed when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // if api key is missing
    if (SAFE_BROWSE_API_KEY==''){
        alert('Missing API key');
    } else if (getProperty(tab, 'status', 'loading') == 'complete') {
        let newURL = getProperty(tab, 'url', 'None');

        // if chrome display warning, extension cannot read url
        if (newURL == '') {
            alert("Threat detected!");
            sendSignal('high');
            console.log('Chrome blocked url extraction');
        }

        // check if update is repetitive and if tab is not a webpage
        else if (displayedURL != newURL && newURL.slice(0, 6) != 'chrome') {
            displayedURL = newURL;
            console.log(displayedURL.slice(0,5));
            checkURL(displayedURL).then((threat) => {
                if (Object.entries(threat).length != 0) {
                    alert("Threat detected!");
                    sendSignal('high');
                    console.log(threat);
                    return;
                }
            });
            if (displayedURL.slice(0,5)!='https'){
                alert("Warning: http is not safe!");
                sendSignal('low');
            } 
        }
    }
})
