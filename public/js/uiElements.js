
// TODO: This should be recatored @JohanHagaMohn
function genereateTwitterDOM(someData) {
    let divElm = document.createElement("div")
    divElm.style = "margin-top: 20px; width: 100%; overflow: hidden"
    divElm.innerHTML = JSON.stringify(someData)
    return divElm
}