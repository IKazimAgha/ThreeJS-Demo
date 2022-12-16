

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    110,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
)

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

camera.position.set(0, 2, 5);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00FF00
})

const box = new THREE.Mesh(boxGeometry, boxMaterial)

scene.add(box)

function animate(time) {
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)