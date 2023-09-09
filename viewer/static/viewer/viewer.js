/*
Note : currently, Three and web-ifc libraries are loaded from a bundle created by using rollup in a local npm project. 
To maintain class definitions while still using treeshaking, either
a) var dummy = new Scene()
b) console.log(Scene)
are used in the js fed to the bundler, however this feels hacky 
*/
/*
NB2 : Apparently neither of the above methods works for IfcLoader - Just disabling tree shaking for now
*/

const scene = new Scene();

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};


// Setup camera
const aspect = size.width / size.height;
const camera = new PerspectiveCamera(75, aspect);
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
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({
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
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

//Animation loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

const ifcLoader = new IFCLoader();
ifcLoader.ifcManager.setWasmPath("");

window.addEventListener("load", () => {
  console.log("page loaded")

  ifcLoader.load("/static/viewer/" + model_path, (ifcModel) => scene.add(ifcModel));
});