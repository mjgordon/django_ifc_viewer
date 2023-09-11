/*
Note : currently, Three and web-ifc libraries are loaded from a bundle created by using rollup in a local npm project. 
To maintain class definitions while still using treeshaking, either
a) var dummy = new Scene()
b) console.log(Scene)
are used in the js fed to the bundler, however this feels hacky 
*/
/*
NB2 : Apparently neither of the above methods works for IfcLoader - Just disabling tree shaking for now.
However with the built-in three loader the filesize isn't overlarge anyway
*/

const scene = new Scene();
var threeCanvas;
var camera;
var controls;
var renderer;


const ifcLoader = new IFCLoader();
const ifc = ifcLoader.ifcManager;
const ifcModels = [];
//ifcLoader.ifcManager.setWasmPath(""); // The default path correctly looks in the static directory 

const raycaster = new Raycaster();
raycaster.firstHitOnly = true;
const mouse = new Vector2();

// Reference to the previous selection
let preselectModel = { id: -1 };

const selectModel = { id: -1 };

var mouseOverUI = false;

var selectedExpressId = -1;

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function setup() {
  // Setup camera
  const aspect = size.width / size.height;
  camera = new PerspectiveCamera(75, aspect);
  camera.position.z = 15;
  camera.position.y = 13;
  camera.position.x = 8;
  
  
  // Setup lights
  const lightColor = 0xffffff;
  
  const ambientLight = new AmbientLight(lightColor, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new DirectionalLight(lightColor, 1);
  directionalLight.position.set(0, 10, 0);
  directionalLight.target.position.set(-5, 0, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);
  
  
  // Setup renderer
  threeCanvas = document.getElementById("three-canvas");
  renderer = new WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
  });
  
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  //Creates grids and axes in the scene
  const grid = new GridHelper(50, 30);
  scene.add(grid);
  
  const axes = new AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  scene.add(axes);

  scene.background = new Color(0x333333);
  
  //Creates the orbit controls (to navigate the scene)
  controls = new OrbitControls(camera, threeCanvas);
  controls.enableDamping = true;
  controls.target.set(-2, 0, 0);

  // Setup mouseover
  const uiDiv = document.getElementById("uiRight")
  uiDiv.addEventListener("mouseleave", function(event) {
    mouseOverUI = false;
  }, false);

  uiDiv.addEventListener("mouseover", function(event) {
    mouseOverUI = true;
  }, false);
  
  const textAreaAnnotate = document.getElementById("annotationTextArea")
  const buttonAnnotate = document.getElementById("annotationButton")
  buttonAnnotate.addEventListener("mousedown", function(event) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/viewer/annotate", true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener("load",function() {
      setAnnotationList()
    });
    
    xhr.send(JSON.stringify({
      org_url:org_url,
      model_url:model_url,
      user_name:"",
      express_id:selectedExpressId,
      text: textAreaAnnotate.value
    }));
  });
}

setup();



//Animation loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

// === CALLBACKS ===

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});


window.addEventListener("load", () => {
  ifcLoader.load("/static/viewer/" + model_path, (ifcModel) => {
    scene.add(ifcModel);
    ifcModels.push(ifcModel);
  });

  setAnnotationList()
});


window.onmousemove = (event) => highlight(event, preselectMat, preselectModel);


//threeCanvas.onclick = pick;
window.onclick = (event) => {
  let hightlightReturn = highlight(event, selectMat, selectModel);
  if (hightlightReturn) {
    let [modelId, expressId] = hightlightReturn;
    selectedExpressId = expressId;
    const props = ifc.getItemProperties(modelId, expressId);
    //console.log(props);

    let tagElementType = document.getElementById("tagElementType")
    let tagElementId = document.getElementById("tagElementId")

    let displayName = props.Name.value.substring(0, props.Name.value.lastIndexOf(":"))

    tagElementType.innerHTML = displayName;
    tagElementId.innerHTML = expressId;    

    let annotationTextArea = document.getElementById("annotationTextArea")
    let annotationButton = document.getElementById("annotationButton")

    annotationTextArea.disabled = false;
    annotationButton.disabled = false;
  }
}


// === OTHER FUNCTIONS ===

function cast(event) {
  // Computes the position of the mouse on the screen
  const bounds = threeCanvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  mouse.y = -(y1 / y2) * 2 + 1;

  // Places it on the camera pointing to the mouse
  raycaster.setFromCamera(mouse, camera);

  // Casts a ray
  return raycaster.intersectObjects(ifcModels);
}


function highlight(event, material, model) {
  if (mouseOverUI) {
    return null;
  }
  const found = cast(event)[0];
  if (found) {
    // Gets model ID
    model.id = found.object.modelID;

    // Gets Express ID
    const index = found.faceIndex;
    const geometry = found.object.geometry;
    const id = ifc.getExpressId(geometry, index);

    // Creates subset
    ifcLoader.ifcManager.createSubset({
      modelID: model.id,
      ids: [id],
      material: material,
      scene: scene,
      removePrevious: true,
    });

    return [model.id, id]
  } 
  else {
    // Removes previous highlight
    ifc.removeSubset(model.id, material);
    return null;
  }
  
}


function setAnnotationList() {
  var xhr = new XMLHttpRequest();
  var url = "/viewer/get_annotations?"
  url += `org_url=${org_url}&model_url=${model_url}`
  xhr.open("GET", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.addEventListener("load",function() {
    const tableAnnotations = document.getElementById('tableAnnotationsData')
    
    // This can be generated cleaner
    var textHTML = "<table><tbody>"
    const annotations = JSON.parse(this.response)
    for (var n in annotations) {
      var annotation = annotations[n]
      textHTML += "<tr class='trAnnotationRow'>"
      textHTML += `
      <td class='tdAnnotationsUser'></td>
      <td class='tdAnnotationsTime'>${annotation.fields.datetime.substring(0,10)}</td>
      <td class='tdAnnotationsText'>${annotation.fields.text}</td>`
      textHTML += "</tr>"
    }

    textHTML += "</tbody></table>"
    tableAnnotations.innerHTML = textHTML
  });
    
  xhr.send(null);
}


const preselectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.4,
  color: 0xF96D4E,
  depthTest: false,
});


const selectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xF55D3E,
  depthTest: false,
});