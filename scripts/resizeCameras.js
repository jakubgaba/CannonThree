import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const aspect = {
    width: window.innerWidth,
    height: window.innerHeight
}

function resizeCamera(renderer) {
    return (renderer instanceof THREE.WebGLRenderer)
        ? (aspect.width = window.innerWidth,
           aspect.height = window.innerHeight, 

           camera.aspect = aspect.width / aspect.height,
           camera.updateProjectionMatrix(),

           renderer.setSize(aspect.width, aspect.height),
           renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)),
           true) 
        : (console.error("Invalid renderer provided to resizeCamera."), false);
}
export { camera, resizeCamera };
