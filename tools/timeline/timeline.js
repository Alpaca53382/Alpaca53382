const newNodeContent = `
    <div class="node"></div>
    <textarea class="label" readonly>test</textarea>
    <div class="line"></div>
`;
{
    let newNode = document.createElement("div");
    document.getElementById("timeline").appendChild(newNode);
    newNode.className = "item";
    newNode.innerHTML = newNodeContent;
}


let selection = null;
let selectionType = null;
let offsetX = 0;
let offsetY = 0;
let shift = false;

dummyNode = {get style() {return ""}, set style(val) {return true;}};

document.addEventListener("mousedown", (e) => {
    if (e.button != 0) return;
    if (selectionType == "edit") {
        if (e.target == selection) return;
        selection.style.cursor = "";
        selection.setAttribute("readonly","");
        selectionType = null;
        selection = null;
    }
    if (e.target.className == "label" || (e.target.parentElement && e.target.parentElement.className == "label")) {
        if (e.target.parentElement.className == "label") {
            selection = e.target.parentElement;
        } else {
            selection = e.target;
        }
        selectionType = "drag";
        offsetX = parseInt(selection.style.left || 150) - e.clientX;
        offsetY = parseInt(selection.style.top || 0) - e.clientY;
    } else if (e.target.className == "node") {
        selection = e.target;
        selectionType = "drag";
        offsetY = parseInt((selection.parentElement.previousElementSibling || dummyNode).style.marginBottom || 0) - e.clientY;
        if (e.shiftKey) {
            shift = true;
        } else {
            shift = false;
            offsetX = parseInt(selection.parentElement.style.marginBottom || 0) + e.clientY;
        }
    } else if (e.target.id == "end") {
        let newNode = document.createElement("div");
        e.target.previousElementSibling.appendChild(newNode);
        newNode.className = "item";
        newNode.innerHTML = newNodeContent;
        newNode.previousElementSibling.style.marginBottom = "30px";
        selection = newNode.firstElementChild;
        selectionType = "drag";
        offsetY = 30 - e.clientY;
        offsetX = e.clientY;
    } else if (e.target.id == "start") {
        let newNode = document.createElement("div");
        e.target.nextElementSibling.insertAdjacentElement("afterBegin",newNode);
        newNode.className = "item";
        newNode.innerHTML = newNodeContent;
        newNode.style.marginBottom = "30px";
        selection = newNode.firstElementChild;
        selectionType = "drag";
        offsetY = e.clientY;
        offsetX = e.clientY + 30;
    }
});
document.addEventListener("mousemove", (e) => {
    if (e.button != 0) return;
    switch (selectionType) {
        case null: break;
        case "drag":
            if (selection.className == "label") {
                selection.style.left = offsetX + e.clientX + "px";
                selection.style.top = offsetY + e.clientY + "px";
                selection.nextElementSibling.style.height = Math.round(Math.sqrt(
                    (offsetX + e.clientX)**2 + (offsetY + e.clientY)**2
                )) + "px";
                selection.nextElementSibling.style.transform = "rotate(" + Math.atan2(
                    - offsetX - e.clientX, offsetY + e.clientY
                ) + "rad)";
            } else if (selection.className == "node") {
                let prev = (selection.parentElement.previousElementSibling || dummyNode)
                prev.style.marginBottom = offsetY + e.clientY + "px";
                if (!shift && selection.parentElement.nextElementSibling) {
                    selection.parentElement.style.marginBottom = offsetX - e.clientY + "px";
                }
                while (true) {
                    if (parseInt(selection.parentElement.style.marginBottom || 0) < 0) {
                        if (selection.parentElement.nextElementSibling === null) {
                            selection.parentElement.style.marginBottom = "";
                            continue;
                        }
                        let top = parseInt((selection.parentElement.previousElementSibling || dummyNode).style.marginBottom || 0);
                        let mid = parseInt(selection.parentElement.style.marginBottom || 0);
                        let bot = parseInt(selection.parentElement.nextElementSibling.style.marginBottom || 0);
                        top = top + mid;
                        bot = bot + mid;
                        mid = 0 - mid;
                        (selection.parentElement.previousElementSibling || dummyNode).style.marginBottom = top + "px";
                        selection.parentElement.nextElementSibling.style.marginBottom = mid + "px";
                        selection.parentElement.style.marginBottom = bot + "px";
                        selection.parentElement.parentElement.insertBefore(selection.parentElement.nextElementSibling, selection.parentElement);
                        offsetY = parseInt((selection.parentElement.previousElementSibling || dummyNode).style.marginBottom || 0) - e.clientY;
                        offsetX = parseInt(selection.parentElement.style.marginBottom || 0) + e.clientY;
                        continue;
                    }
                    if (parseInt((selection.parentElement.previousElementSibling || dummyNode).style.marginBottom || 0) < 0) {
                        let top = parseInt(((selection.parentElement.previousElementSibling || dummyNode).previousElementSibling || dummyNode).style.marginBottom || 0);
                        let mid = parseInt((selection.parentElement.previousElementSibling || dummyNode).style.marginBottom || 0);
                        let bot = parseInt(selection.parentElement.style.marginBottom || 0);
                        top = top + mid;
                        bot = bot + mid;
                        mid = 0 - mid;
                        ((selection.parentElement.previousElementSibling || dummyNode).previousElementSibling || dummyNode).style.marginBottom = top + "px";
                        selection.parentElement.style.marginBottom = mid + "px";
                        (selection.parentElement.previousElementSibling || dummyNode).style.marginBottom = bot + "px";
                        selection.parentElement.parentElement.insertBefore(selection.parentElement, selection.parentElement.previousElementSibling);
                        offsetY = parseInt((selection.parentElement.previousElementSibling || dummyNode).style.marginBottom || 0) - e.clientY;
                        offsetX = parseInt(selection.parentElement.style.marginBottom || 0) + e.clientY;
                        if ((selection.parentElement.nextElementSibling || dummyNode).nextElementSibling === null) {
                            selection.parentElement.nextElementSibling.style.marginBottom = "";
                        }
                        continue;
                    }
                    break;
                }
            }
            break;
        case "edit":
        break;
    }
})
document.addEventListener("mouseup", (e) => {
    if (e.button != 0) return;
    switch (selectionType) {
        case null: break;
        case "drag":
            selection = null;
            selectionType = null;
            break;
        case "edit":
            break;
    }
})
document.addEventListener("dblclick", (e) => {
    if (e.button != 0) return;
    if (e.target.className == "label") {
        selection = e.target;
        selectionType = "edit";
        selection.style.cursor = "text";
        selection.removeAttribute("readonly");
    } else if (e.target.className == "node") {
        if (e.target.parentElement.nextElementSibling) {
            if (e.target.parentElement.previousElementSibling) {
                e.target.parentElement.previousElementSibling.style.marginBottom =
                parseInt(e.target.parentElement.previousElementSibling.style.marginBottom || 0) +
                parseInt(e.target.parentElement.style.marginBottom || 0) + "px";
            }
        } else {
            if (e.target.parentElement.previousElementSibling) {
                e.target.parentElement.previousElementSibling.style.marginBottom = "0px";
            } else {
                return;
            }
        }
        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    } else if (e.target.id == "timeline" || e.target.id == "timeline-container") {
        let yPos = 0;
        let prevNode = null;
        let done = false;
        Array.from(document.getElementById("timeline").children).forEach((node) => {
            if (((yPos + parseInt((node.previousElementSibling || dummyNode).style.marginBottom || 0)) < (e.clientY - 100)) && !done) {
                yPos += parseInt((node.previousElementSibling || dummyNode).style.marginBottom || 0);
                prevNode = node;
            } else {
                done = true;
            }
        })
        let newNode = document.createElement("div");
        prevNode.parentElement.insertBefore(newNode,prevNode.nextElementSibling);
        newNode.className = "item";
        newNode.innerHTML = newNodeContent;
        console.log(parseInt(prevNode.style.marginBottom || 0), yPos, e.clientY);
        let temp = (e.clientY - 140) - yPos;
        newNode.style.marginBottom = parseInt(prevNode.style.marginBottom || 0) - temp + "px";
        prevNode.style.marginBottom = temp + "px";
    }
})