//let server = 'https://trustos.telefonica.com';
let server = chrome.runtime.getURL('server.html');

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ server });
  console.log('Default server url set', `server: ${server}`);
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: openNewPage
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cmd === "closeModal") {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: closeModal
      });
    }
    else if (request.cmd === "changeModal") {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: changeModal
      });
    }
  }
);

// The body of this function will be execuetd as a content script inside the
// current page
function openNewPage() {
  window.open("https://trustos.telefonica.com", '_blank');
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
  document.getElementsByClassName("modal-content")[0].style.height = "600px";
}

function changeModal() {
  document.getElementsByClassName("modal-content")[0].style.height = "200px";
}

function injectTrustOSButton(details) {
  chrome.scripting.executeScript({
    target: {tabId: details.tabId},
    files: ['injection.js']
  });
  chrome.scripting.insertCSS({
    target: { tabId: details.tabId },
    files: ["common.css"]
  });
}

//chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  // Page uses History API and we heard a pushSate/replaceState
//  console.log("webNavigation.onHistoryStateUpdated triggered!");
//  injectTrustOSButton(details);
//}, {url: [{hostSuffix: 'github.com'}]});

//   webNavigation Events (https://developer.chrome.com/docs/extensions/reference/webNavigation/)
//
//   Events triggered when reload:
//   onBeforeNavigate > onCommitted > onDOMContentLoaded > onCompleted
//
//   If the history API is used to modify the state of a frame (e.g. using history.pushState()):
//   onHistoryStateUpdated event is fired after onDOMContentLoaded.
//
//  Others: onCreatedNavigationTarget, onErrorOccurred, onHistoryStateUpdated, onReferenceFragmentUpdated, onTabReplaced
//


//chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
//    navigationEvenFired(details,"onBeforeNavigate");
//});
//
//chrome.webNavigation.onCommitted.addListener(function(details) {
//    navigationEvenFired(details,"onCommitted");
//});
//
//chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
//    navigationEvenFired(details,"onDOMContentLoaded");
//});
//
chrome.webNavigation.onCompleted.addListener(function(details) {
    navigationEvenFired(details,"onCompleted");
}, {url: [{hostSuffix: 'github.com'}]});
//
//chrome.webNavigation.onCreatedNavigationTarget.addListener(function(details) {
//    navigationEvenFired(details,"onCreatedNavigationTarget");
//});
//
//chrome.webNavigation.onErrorOccurred.addListener(function(details) {
//    navigationEvenFired(details,"onErrorOccurred");
//});
//
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    navigationEvenFired(details,"onHistoryStateUpdated");
}, {url: [{hostSuffix: 'github.com'}]});
//
//chrome.webNavigation.onReferenceFragmentUpdated.addListener(function(details) {
//    navigationEvenFired(details,"onReferenceFragmentUpdated");
//});
//
//chrome.webNavigation.onTabReplaced.addListener(function(details) {
//    navigationEvenFired(details,"onTabReplaced");
//});

function navigationEvenFired(details,event) {
  let eventFired = event;
  chrome.storage.sync.set({ eventFired });
  injectTrustOSButton(details);
//  var elms = document.evaluate("//a[contains(., 'Download ZIP')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
}
