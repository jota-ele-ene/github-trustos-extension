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

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  // Page uses History API and we heard a pushSate/replaceState
  //console.log("webNavigation.onHistoryStateUpdated triggered!");
  injectTrustOSButton(details);
}, {url: [{hostSuffix: 'github.com'}]});

chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
  // Page loaded/reloaded
  //console.log("webNavigation.onDOMContentLoaded triggered!");
  injectTrustOSButton(details);
}, {url: [{hostSuffix: 'github.com'}]});


//   webNavigation Events
//
//   Events triggered when reload:
//   onBeforeNavigate > onCommitted > onDOMContentLoaded > onCompleted
//
//
//chrome.webNavigation.onBeforeNavigate.addListener(function() {
//    console.log("webNavigation.onBeforeNavigate triggered!");
//});
//
//chrome.webNavigation.onCommitted.addListener(function() {
//    console.log("webNavigation.onCommitted triggered!");
//});
//
//chrome.webNavigation.onCompleted.addListener(function() {
//    console.log("webNavigation.onCompleted triggered!");
//});
//
//chrome.webNavigation.onCreatedNavigationTarget.addListener(function() {
//    console.log("webNavigation.onCreatedNavigationTarget triggered!");
//});
//
//chrome.webNavigation.onDOMContentLoaded.addListener(function() {
//    console.log("webNavigation.onDOMContentLoaded triggered!");
//});
//
//chrome.webNavigation.onErrorOccurred.addListener(function() {
//    console.log("webNavigation.onErrorOccurred triggered!");
//});
//
//chrome.webNavigation.onHistoryStateUpdated.addListener(function() {
//    console.log("webNavigation.onHistoryStateUpdated triggered!");
//});
//
//chrome.webNavigation.onReferenceFragmentUpdated.addListener(function() {
//    console.log("webNavigation.onReferenceFragmentUpdated triggered!");
//});
//
//chrome.webNavigation.onTabReplaced.addListener(function() {
//    console.log("webNavigation.onTabReplaced triggered!");
//});
