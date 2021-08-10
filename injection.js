var downloadLinks = document.evaluate("//a[contains(., 'Download ZIP')]", document, null, XPathResult.ANY_TYPE, null );
var downloadLink = downloadLinks.iterateNext();


if (downloadLink && (document.getElementById("trustos-btn-nav")==null) )
{

  let dataClick = downloadLink.getAttribute("data-hydro-click");
  let dataHref = downloadLink.getAttribute("href");
  chrome.storage.sync.set({ dataClick });
  chrome.storage.sync.set({ dataHref });
  //console.log('dataClick = ', `${dataClick}`);
  //console.log('dataHref = ', `${dataHref}`);

  let fileNavigationBar = document.getElementsByClassName("file-navigation");

  const container = document.createElement('button');
  container.id = "trustos-btn-container";

  const a = document.createElement('a');
  a.id = "trustos-btn-nav";
  a.title = "TrustOSCerts";
  a.text = "TrustOS"
//  a.href = "https://trustos.telefonica.com";
//  a.target = "_blank";

  container.appendChild(a);
  fileNavigationBar[0].appendChild(container);

  const myModal = document.createElement('div');
  myModal.id = "myModal";
  myModal.classList.add("modal");

  const modalContent = document.createElement('div');
  modalContent.classList.add("modal-content");

  const popup = document.createElement('object');
  popup.classList.add("inherit");
  popup.data = chrome.runtime.getURL("popup.html");
  modalContent.appendChild(popup);
  myModal.appendChild(modalContent);
  fileNavigationBar[0].appendChild(myModal);

  var modal = document.getElementById("myModal");

  // When the user clicks the button, open the modal
  container.onclick = function() {
    myModal.style.display = "block";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

}
