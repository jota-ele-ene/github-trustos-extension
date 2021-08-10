const url = new URL(window.location.href);
document.getElementById("name").innerHTML = url.searchParams.get('name');
document.getElementById("file").innerHTML = url.searchParams.get('file');
document.getElementById("token").innerHTML = url.searchParams.get('token');
document.getElementById("info").innerHTML = url.searchParams.get('data');
