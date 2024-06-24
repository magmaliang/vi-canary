

function toggleClass(el, className) {
  let cs = el.className;

  if (cs.includes(className)) {
    el.setAttribute("class", cs.replace(className, ""))
  } else {
    el.setAttribute("class", cs.split(" ").concat([className]).join(" "))
  }
}

function createTree(pNode, children) {
  let childrenHolder = document.createElement("ul")
  // 附加类
  let currentClass = pNode.getAttribute("class")
  if (currentClass) {
    currentClass = [currentClass, 'has-children'].join(" ")
  } else {
    currentClass = 'has-children'
  }

  // 创建加号减号button
  let pNodeSpan = pNode.firstChild
  if (pNodeSpan.nodeType !== 3) {
    let btn = document.createElement("div")
    btn.setAttribute("class", "btn")
    btn.innerText = "-"
    pNodeSpan.appendChild(btn)
    pNode.setAttribute("class", currentClass)
    // 如果当前后代大于4，则折叠
    if (children?.length > 4) {
      toggleClass(pNode, "collapsed")
      btn.innerText = "+"
    }
  }
  

  // 创建后代
  children.forEach(cmp => {
    let childNode = document.createElement("li")
    let spanText = document.createElement("span")
    spanText.innerText = cmp.cmpType
    childNode.appendChild(spanText)
    childrenHolder.appendChild(childNode)
    if (cmp.subCmps) {
      createTree(childNode, cmp.subCmps)
    }
  });
  pNode.appendChild(childrenHolder)
}

// btn toggle
document.addEventListener("click", (e) => {
  // 如果点击了按钮
  if (e.target.getAttribute("class") == 'btn') {
    e.stopPropagation()
    let liContainer = e.target.parentElement.parentElement;
    // 当前状态
    let collapsed = false;
    let curClass = liContainer.getAttribute("class");
    if (curClass.includes("collapsed")) {
      collapsed = true;
    }
    // toggle 状态
    toggleClass(liContainer, "collapsed")
    if (collapsed) {
      e.target.innerText = "-"
    } else {
      e.target.innerText = "+"
    }
  }
})

// com click
document.addEventListener("click", (e) => {
  if (e.target.tagName === 'SPAN') {
    document.querySelectorAll(".active").forEach(e => toggleClass(e, "active"))
    toggleClass(e.target, "active")
  }
})




document.getElementById("sendMessageButton").addEventListener("click", function() {
  chrome.runtime.sendMessage({ cmd: "get_tree_data" }, function(response) {
    console.log(response);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request)
  if (request.cmd === "return_tree_data_from_background") {
    console.log("return_tree_data_from_background", request)
    createTree(document.getElementsByClassName("tree")[0], [JSON.parse(request.data)])
  }
});