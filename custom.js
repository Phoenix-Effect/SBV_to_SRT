let dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragenter', handleDrop, false);
dropArea.addEventListener('dragleave', handleDrop, false);
dropArea.addEventListener('dragover', handleDrop, false);
dropArea.addEventListener('drop', handleDrop, false);

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

dropArea.addEventListener('drop', handleDrop, false);

function handleFiles(files) {

    if(files.length !== 0){
        console.log("firing file");
        doIt(files[0])
    }

}

function doIt(file) {
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        convertedSubtitles = sbvToSrt(textFromFileLoaded);
        var fname = file.name;
        fname = fname.split('.').slice(0, -1).join('.');
        fname += ".srt";
        downloadSubs(convertedSubtitles, fname);
        document.getElementById("converted").value = convertedSubtitles;
    };
    console.log(file.name);
    fileReader.readAsText(file, "UTF-8");
}

function downloadSubs(subs, fileName){
    document.getElementById("form-drop").innerText = "Download Ready!";
    var textToSaveAsBlob = new Blob([subs], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

    var downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function destroyClickedElement(event){
    document.body.removeChild(event.target);
}


function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files)
}

function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

function sbvToSrt(text){
    var str = text.replace(/^\s+|\s+$/g, '');
    var addLine = "\n" + str;
    var split = addLine.split("\n");
    var size = split.length;
    var nSub = "";
    var num = 0;
    var lineNum = 0;

    for(var i = 0; i < size; i++){
        if(lineNum === 0){
            nSub += "\n" + num.toString() + "\n";
            num++;
            lineNum++;
        } else if(lineNum === 1){
            var temp = split[i];
            temp = temp.replace(",", " --> ");
            temp = temp.replace(".", ",");
            nSub += temp + "\n";
            lineNum++;
        } else if(lineNum === 2){
            nSub += split[i] + "\n";
            lineNum = 0;
        }
    }

    nSub += "\n";
    nSub = nSub.substring(1);

    return nSub;
}