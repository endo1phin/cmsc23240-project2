# SmellsFishy
Chrome extension that detects malicious website and triggers release of odor.

## Usage
- Add api key to `background.js`
- Load `chrome-extension` to [Chrome extension](https://developer.chrome.com/extensions/getstarted#manifest)
- Run flask server:
```
$ export FLASK_APP=hello.py
$ flask run
```
- Try going to a [malicious website](https://www.wicar.org/test-malware.html)

