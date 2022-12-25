import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const myTexture = textureLoader.load('static/qt.jpg')

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    map: myTexture
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 1000)
camera.position.set(15, 16, 12)
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer()

renderer.setClearColor(0x000000, 1.0);
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true


document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
const clock = new THREE.Clock()

function animate(){
    const elapsedTime = clock.getElapsedTime()
    mesh.position.y = Math.sin(elapsedTime) * 1
    requestAnimationFrame(animate)
    mesh.rotateX(30*0.0003)
    renderer.render(scene, camera)
}

animate()