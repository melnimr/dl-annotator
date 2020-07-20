const { remote, ipcRenderer } = require('electron');
const mainProcess = remote.require('./main.js');

const openFileButton = document.querySelector('#open_file');
const getOutputDirButton = document.querySelector('#get_output_dir');
const resetAnnotationsButton = document.querySelector('#reset_annotations');
const outputDirSpan = document.querySelector('#output_dir')
const audio = document.querySelector('audio');


openFileButton.addEventListener('click', ()=> {
    mainProcess.readAudioFile();
})

getOutputDirButton.addEventListener('click', ()=> {
    mainProcess.getAnnoOutputDir();
})

let fileName;
ipcRenderer.on('file-opened', (event, obj) => {
    audio.src = obj.dataURI;
    fileName = obj.filename;
    window.addEventListener('keyup', handleKeyup);
})

let dirPath;
ipcRenderer.on('dir-selected', (event, outputDirPath) => {
    dirPath = outputDirPath;
    outputDirSpan.textContent = dirPath
})

let annoTimes = []
const addAnnotation = ()=> {
    annoTimes.push(audio.currentTime)
    audio.classList.add('add-anno')
    setTimeout(()=> audio.classList.remove('add-anno'), 400);
    mainProcess.addAnnoToCsv(annoTimes, dirPath, fileName)
}

resetAnnotationsButton.addEventListener('click', ()=> {
    annoTimes.length = 0;
})

const handleKeyup = (event)=> {
    event.preventDefault();
    if (event.which == 32) { addAnnotation() }
}
