const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;

// renderer.setClearColor(0xFFEA00);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
)

const orbit = new THREE.OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('./assests/space.jpeg')
// const cubeTexture = new THREE.CubeTextureLoader();
// scene.background = cubeTexture.load([
//     './assests/nebula.jpg',
//     './assests/nebula.jpg',
//     './assests/space1.jpg',
//     './assests/space1.jpg',
//     './assests/space1.jpg',
//     './assests/space1.jpg',
// ])

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({ 
    // color: 0x00FF00,
    // map: textureLoader.load('./assests/space.jpeg')
 });

const box2MultiMaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load('./assests/space.jpeg')}),
    new THREE.MeshBasicMaterial({map: textureLoader.load('./assests/space.jpeg')}),
    new THREE.MeshBasicMaterial({map: textureLoader.load('./assests/space1.jpg')}),
    new THREE.MeshBasicMaterial({map: textureLoader.load('./assests/space.jpeg')}),
    new THREE.MeshBasicMaterial({map: textureLoader.load('./assests/space1.jpg')}),
    new THREE.MeshBasicMaterial({map: textureLoader.load('./assests/space.jpeg')}),
]

const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10)
// box2.material.map = textureLoader.load('./assests/space1.jpg')

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00FF00
})
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)


const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper)

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000FF,
    wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 0, 0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight)

// const directionLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionLight);
// directionLight.position.set(-30, 50, 0);
// directionLight.castShadow = true;
// directionLight.shadow.camera.bottom = -12;

// const dlHelper = new THREE.DirectionalLightHelper(directionLight, 5);
// scene.add(dlHelper);

// const dlShadowHelper = new THREE.CameraHelper(directionLight.shadow.camera);
// scene.add(dlShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const slHelper = new THREE.SpotLightHelper(spotLight);
scene.add(slHelper);

scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
}

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e)
})

gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e
})

gui.addColor(options, 'speed', 0, 0.1);
gui.addColor(options, 'angle', 0, 2);
gui.addColor(options, 'penumbra', 0, 1);
gui.addColor(options, 'intensity', 0, 1);

// const vShader = `
//     void main(){
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `;

// const fShader = `
//     void main(){
//         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//     }
// `

const sphere2geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
})
const sphere2 = new THREE.Mesh(sphere2geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e){
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1;    
})

const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;

function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    slHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

    for(let i = 0; i < intersects.length; i++){
        if(intersects[i].object.id === sphereId){
            intersects[i].object.material.color.set(0xFF0000);
        }
    }

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)