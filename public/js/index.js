$.get("/API/mongo/tweets/count", function (data) {
    document.querySelector("#count").lastElementChild.innerHTML = data.count;
});