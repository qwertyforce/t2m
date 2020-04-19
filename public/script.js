// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area");

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

function handleFiles(files) {
  progressBar.value=0;
  files = [files[0]]
    const myNode = document.getElementById("preview");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  // initializeProgress(files.length)
  // files.forEach(uploadFile)
  files.forEach(previewFile)
  uploadFile(files)
}

function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    var para = document.createElement("p");
    var node = document.createTextNode(file.name);
    para.appendChild(node);
    document.getElementById('preview').appendChild(para)
  }
}

function uploadFile(files) {
  var serv='http://localhost:8082/'
  var url = serv+'upload'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function(e) {
    progressBar.value =e.loaded * 100.0 / e.total;
    // updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
    console.log(e.loaded * 100.0 / e.total)
  })

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.response)
      alert(xhr.response)
      console.log("Done")
      // updateProgress(i, 100) // <- Add this
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      alert("Something bad happened. Try again");// Error. Inform the user
    }
  })
  for (var file of files){
   formData.append('data', file)
  }
  xhr.send(formData)
}