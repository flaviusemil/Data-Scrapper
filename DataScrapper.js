/**
* Created by Flavius Condurache on 05/05/2017.
* Scrapper Script v1.0
*/


var tableNodes = document.getElementById('main-content').childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes;
var object = [];
var currentCount = 0;
var addedPage = false;


(function startProcess() {

    var mainDiv = document.createElement('div');
    var btnPrv = document.createElement('button').appendChild(document.createTextNode('Previous')).parentNode;
    var btnAdd = document.createElement('button').appendChild(document.createTextNode('Add')).parentNode;
    var btnNxt = document.createElement('button').appendChild(document.createTextNode('Next')).parentNode;
    var btnDownload = document.createElement('button').appendChild(document.createTextNode('Download')).parentNode;
    var btnClear = document.createElement('button').appendChild(document.createTextNode('Clear')).parentNode;
    var btnCount = document.createElement('button').appendChild(document.createTextNode('Pages added: 0')).parentNode;

    btnCount.setAttribute("disabled", "");
    btnCount.setAttribute("id", "scriptPageCounter");

    var btnArray = [btnPrv, btnAdd, btnNxt, btnCount, btnClear, btnDownload];
    var funcArray = ['goToPreviousPage', 'addItemsToObject', 'goToNextPage', '', 'clearData', 'download'];

    for (var i = 0; i < btnArray.length; i++) {
        mainDiv.appendChild(btnArray[i]);
        btnArray[i].setAttribute('class', 'scriptEventButtons');
        btnArray[i].setAttribute('onclick', funcArray[i] + '()');
    }



    mainDiv.style.position = 'fixed';
    mainDiv.style.top = 0;
    mainDiv.setAttribute('id', 'scriptButtonsContainer');
    document.body.appendChild(mainDiv);

})();

function addItemsToObject() {
    if (!addedPage) {
        for(var i = 1; i < tableNodes.length; i += 2) {

            var rowNodes = tableNodes[i].childNodes;

            var columns = [];
            for(var j = 1; j < tableNodes[i].childNodes.length; j+=2) {

                var item;

                switch (j) {
                    case 1:
                        columns.push(rowNodes[j].childNodes[1].innerText);
                        item = rowNodes[j].childNodes[2].innerText.trim();
                        break;
                    case 3:
                        item = rowNodes[j].childNodes[1].innerText.trim();
                        break;
                    case 5:
                        var topic = rowNodes[j].childNodes[1].innerText.trim();
                        var subject = "";

                        if (rowNodes[j].childNodes.length > 3)
                            subject = rowNodes[j].childNodes[3].innerText.trim();

                        item = topic + (subject == "" ? "" : (" > " + subject));
                        break;
                    case 9:
                        item = rowNodes[j].innerText.replace(',','').trim();
                        break;
                    case 7:
                    case 11:
                        item = rowNodes[j].innerText.trim();
                }

                item = item.replace('\n', '');
                columns.push(item);
            }

            object.push(columns);
        }

        currentCount++;
        updateCount();
        addedPage = true;
    } else
        alert("This page was already added!");
}

function updateCount() {
    document.getElementById('scriptPageCounter').innerText = 'Pages added: ' + currentCount;
}

function goToNextPage() {
    document.getElementsByClassName('pager-next')[0].childNodes[0].click();
    addedPage = false;
}

function goToPreviousPage() {
    document.getElementsByClassName('pager-previous')[0].childNodes[0].click();
}

function download() {
    var csvContent = 'data:text/csv;charset=utf-8,';
    object.forEach(function(infoArray, index){

        dataString = infoArray.join(',');
        csvContent += index < object.length ? dataString+ '\n' : dataString;

    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('id', 'myDownloadFile' + currentCount);
    link.setAttribute('download', 'my_data.csv');
    document.body.appendChild(link);

    link.click();

    setTimeout(function () {
        document.getElementById('myDownloadFile' + currentCount).outerHTML = '';
    }, 3000);
}

function clearData() {
    object = [];
    currentCount = 0;
    updateCount();
}