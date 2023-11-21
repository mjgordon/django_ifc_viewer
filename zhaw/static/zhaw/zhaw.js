var currentExpressId;

function setup() {
    setupUI();
}

function setupUI() {
    
    const buttonLoadModel = document.getElementById("buttonLoadModel")
    buttonLoadModel.addEventListener("mousedown", function(event) {
        var xhr = new XMLHttpRequest();
        var url = "/zhaw/load"
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.addEventListener("load",function() {
            console.log("Load Response")
            reloadData();
        });

        xhr.send(null);
    });

    const buttonUnloadModel = document.getElementById("buttonUnloadModel")

    buttonUnloadModel.addEventListener("mousedown", function(event) {
        var xhr = new XMLHttpRequest();
        var url = "/zhaw/unload"
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.addEventListener("load",function() {
            console.log("Unload response")
        });

        xhr.send(null);
    });

    const editName = document.getElementById("editName")
    editName.addEventListener("keydown", (event) => {
        if (event.which === 13) {
            if (!event.repeat) {
                console.log(editName.value)
                

                if (currentExpressId == null) {
                    return;
                }
                var xhr = new XMLHttpRequest();
                var url = "/zhaw/update_name"
                xhr.open("POST", url, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
            
                xhr.addEventListener("load",function() {
                    reloadData()
                });
            
                xhr.send(JSON.stringify({
                    express_id:currentExpressId,
                    new_name:editName.value
                }));
                
                event.target.value = "";
            }
    
            event.preventDefault(); // Prevents the addition of a new line in the text field
        }
    });

    const selectTypes = document.getElementById('selectTypes')
    selectTypes.onchange=selectCallback

    const changeTypes = document.getElementById('changeTypes')
    changeTypes.onchange=changeTypeCallback

    

}

setup();

function reloadData() {
    var xhr = new XMLHttpRequest();
    var url = "/zhaw/models"
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener("load",function() {
        const models = JSON.parse(this.response)
        updateModelData(models)
        console.log("Model Data Response")
    });

    xhr.send(null);

    var xhr = new XMLHttpRequest();
    var url = "/zhaw/walls"
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener("load",function() {
        const walls = JSON.parse(this.response)
        updateWallData(walls, true)
        console.log("Wall Data Response")
    });

    xhr.send(null);

    
}

function updateModelData(models) {
    const projectLabel = document.getElementById('projectNameLabel')
    const authorLabel = document.getElementById('projectAuthorLabel')

    projectLabel.innerHTML = models[0].fields.project_name
    authorLabel.innerHTML = models[0].fields.author_name
}

function updateWallData(walls, changeSelector) {
    if (changeSelector) {
        let typeSet = new Set()
        for (var n in walls) {
            let wall=walls[n]
            typeSet.add(wall.fields.type_name)
        }
    
        const selectTypes = document.getElementById('selectTypes')
        const changeTypes = document.getElementById('changeTypes')
        var inner = ""
        typeSet.forEach((typeName) => {
            inner += `<option value="${typeName}">${typeName}</option>`
        });
        selectTypes.innerHTML = inner;
        changeTypes.innerHTML = inner;
    }
    
    
    const dataTable = document.getElementById('tableWallsData')
    var textHTML = "<table><tbody>"
    for (var n in walls) {
      var wall = walls[n]
      textHTML += `<tr class='trWallRow' id='trWallRow${wall.fields.express_id}'>`
      textHTML += `
      <td class='tdWallId'>${wall.fields.express_id}</td>
      <td class='tdWallName'>${wall.fields.element_name}</td>
      <td class='tdWallType'>${wall.fields.type_name}</td>`
      textHTML += "</tr>"
    }

    textHTML += "</tbody></table>"
    dataTable.innerHTML = textHTML

    for (var n in walls) {
        let wall = walls[n]
   
        var row = document.getElementById(`trWallRow${wall.fields.express_id}`)
  
        row.onclick = (event) => {
            let express_id = wall.fields.express_id;
            setEditor(express_id)
            console.log(express_id)
        }
      }
}

function selectCallback() {
    const selectTypes = document.getElementById('selectTypes')
    var xhr = new XMLHttpRequest();
    var url = "/zhaw/walls/" + selectTypes.value
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener("load",function() {
        const walls = JSON.parse(this.response)
        updateWallData(walls, false)
        console.log("Wall Filter Response")
    });

    xhr.send(null);

    console.log("Finding : " + selectTypes.value)
}

function changeTypeCallback() {
    if (currentExpressId == null) {
        return;
    }
    const changeTypes = document.getElementById('changeTypes')
    var xhr = new XMLHttpRequest();
    var url = "/zhaw/update_type"
    // + currentExpressId + "/" + changeTypes.value
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener("load",function() {
        reloadData()
    });

    xhr.send(JSON.stringify({
        express_id:currentExpressId,
        new_type:changeTypes.value
    }));
    
}

function setEditor(expressId) {
    const editIdLabel = document.getElementById('editIdLabel')
    editIdLabel.innerHTML = expressId
    currentExpressId = expressId
}
