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
var controls;
var renderer;
var camera;
var threeCanvas;

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

function setup() {
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
  
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
  
  //Creates the orbit controls (to navigate the scene)
  controls = new OrbitControls(camera, threeCanvas);
  controls.enableDamping = true;
  controls.target.set(-2, 0, 0);
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
  console.log("page loaded")

  ifcLoader.load("/static/viewer/" + model_path, (ifcModel) => {
    scene.add(ifcModel);
    ifcModels.push(ifcModel);
  });
});

window.onmousemove = (event) => highlight(event, preselectMat, preselectModel);

window.ondblclick = (event) => highlight(event, selectMat, selectModel);

threeCanvas.ondblclick = pick;


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


function pick(event) {
  const found = cast(event)[0];
  if (found) {
    const index = found.faceIndex;
    const geometry = found.object.geometry;
    const ifc = ifcLoader.ifcManager;
    const id = ifc.getExpressId(geometry, index);
    console.log(id);
  }
}


function highlight(event, material, model) {
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
  } else {
    // Removes previous highlight
    ifc.removeSubset(model.id, material);
  }
}


const preselectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff88ff,
  depthTest: false,
});


const selectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff00ff,
  depthTest: false,
});