// sample maleware URL: https://www.wicar.org/test-malware.html


const SAFE_BROWSE_API_KEY = '';
const SAFE_BROWSE_REQ_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=";


let displayedURL = '';

function getProperty(obj, prop, df) {
    if (obj.hasOwnProperty(prop)) {
        return obj[prop];
    } else {
        return df;
    }
}

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



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (getProperty(tab, 'status', 'loading') == 'complete') {
        let newURL = getProperty(tab, 'url', 'None');
        if (newURL == '') {
            alert("threat detected");
            console.log('Chrome blocked url extraction');
        } else if (displayedURL != newURL && newURL.slice(0, 6) != 'chrome') {
            displayedURL = newURL;
            checkURL(displayedURL).then((threat) => {
                if (Object.entries(threat).length != 0) {
                    alert("threat detected");
                    console.log(threat)
                }
            })
        }
    }
})
