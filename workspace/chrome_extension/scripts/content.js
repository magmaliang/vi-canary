var body = document.querySelector("body")

// set body's background color to red
if (body) {
  body.style.backgroundColor = "#ddd"
}

function sendTreeData2Background() {
  chrome.runtime.sendMessage({
    cmd: "return_tree_data",
    data: sessionStorage.getItem("comTree")
  });
}


// Listen for messages from the background page or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.cmd === "get_tree_data") {
    console.log("Content script received a message:", request);
    sendTreeData2Background()
  }
});


