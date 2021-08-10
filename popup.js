document.getElementById("CrearButton").addEventListener("click", async (e) => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      target = document.getElementById("CrearButton").getAttribute('target');
      indexToken = target.indexOf("token=");
      restTarget = target.substring(target.indexOf("&",indexToken));
      targetURL = target.substring(0,indexToken) + "token=" + document.getElementsByName("accessToken")[0].value + restTarget;
      //console.log (targetURL);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: openNewPage (targetURL)
      }, function() {
        if(chrome.runtime.lastError) {
          // Something went wrong
          //console.warn("Whoops.. " + chrome.runtime.lastError.message);
        } else {
          //console.log("lastError cheked");
        }
      });
    });

document.getElementById("CerrarButton").addEventListener("click", async (e) => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.runtime.sendMessage({cmd: "closeModal"}, function(response) {
        if(chrome.runtime.lastError) {
          // Something went wrong
          //console.warn("Whoops.. " + chrome.runtime.lastError.message);
        } else {
          //console.log("lastError cheked");
        }
        document.getElementById("FormData").style.display = "block";
        document.getElementById("textIntro").style.display = "block";
        document.getElementById("textClose").style.display = "none";
        document.getElementById("FormData-CerrarButton").style.display = "none";
      });
});

function openNewPage(target) {
  //window.open("https://trustos.telefonica.com", '_blank
  window.open(target, '_blank');
  document.getElementById("FormData").style.display = "none";
  document.getElementById("textIntro").style.display = "none";
  document.getElementById("textClose").style.display = "block";
  document.getElementById("FormData-CerrarButton").style.display = "block";
  chrome.runtime.sendMessage({cmd: "changeModal"}, function() {
    if(chrome.runtime.lastError) {
      // Something went wrong
      //console.warn("Whoops.. " + chrome.runtime.lastError.message);
    } else {
      //console.log("lastError cheked");
    }
  });

}

htmlData = "";
htmlName = "repo_";
fileUrl = "";
serverUrl = "";

chrome.storage.sync.get("dataClick", ({ dataClick }) => {
  const dataClickObj = JSON.parse(dataClick);
  //console.log('data-payload = ', dataClickObj.payload);
  origUrl = dataClickObj.payload.originating_url;
  splittedUrl = origUrl.split("?")[0].split("/") ;
  user = splittedUrl[3];
  repo = splittedUrl[4];
  htmlName += user +"_" + repo;
  document.getElementsByName("operationName")[0].value = htmlName;
  htmlData += 'User: ' + user + '\r\n';
  htmlData += 'User ID: ' + dataClickObj.payload.user_id+ '\r\n';
  htmlData += 'Repo: ' + repo + '\r\n';
  htmlData += 'Repository ID: ' + dataClickObj.payload.repository_id+ '\r\n';
  htmlData += 'Originating url: ' + origUrl.substring(0,origUrl.indexOf("?"))+ '\r\n';
  document.getElementsByName("additionalInfo")[0].value = htmlData;
});

chrome.storage.sync.get("dataHref", ({ dataHref }) => {
  fileUrl = 'https://github.com' + dataHref;
  zip_file = dataHref.split("/");
  htmlData += 'Branch: ' + zip_file[zip_file.length-1].split(".")[0] + '\r\n';
  htmlData += 'Download url: ' + fileUrl + '\r\n';
  document.getElementsByName("additionalInfo")[0].value = htmlData;
});

chrome.storage.sync.get("server", ({ server }) => {
  serverUrl = server + "?";
  serverUrl += "name=" + encodeURI(document.getElementsByName("operationName")[0].value);
  serverUrl += "&token=" + encodeURI(document.getElementsByName("accessToken")[0].value);
  serverUrl += "&data=" + encodeURI(document.getElementsByName("additionalInfo")[0].value);
  serverUrl += "&file=" + encodeURI(fileUrl);
  var att = document.createAttribute("target");
  att.value = serverUrl;
  document.getElementById("CrearButton").setAttributeNode(att);
});
