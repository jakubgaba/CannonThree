<script>
	import * as THREE from "three";
	import { onMount } from "svelte";
	import { camera, resizeCamera } from "../scripts/resizeCameras.js";
	import { cube } from "../scripts/cube.js";
	import { ArcballControls } from "three/addons/controls/ArcballControls.js";
	import * as dat from "dat.gui";
	import * as CANNON from "cannon-es";
	import CannonDebugger from "cannon-es-debugger";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
	// Scene
	const scene = new THREE.Scene();
	let renderer;

	const geometry = new THREE.SphereGeometry(1);
	const material = new THREE.MeshNormalMaterial();
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
	const boxMaterial = new THREE.MeshNormalMaterial();
	const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
	scene.add(boxMesh);

	const carBody = new CANNON.Body({
		mass: 5,
		position: new CANNON.Vec3(0,6,0),
		shape: new CANNON.Box(new CANNON.Vec3(4,0.5,2)),
	});
	onMount(() => {
		// Canvas
		const canvas = document.querySelector(".draw");
		const gui = new dat.GUI();
		// Renderer
		renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		// Render loop
		const orbitControls = new OrbitControls(camera, canvas);
		// Cannon
		const physicsWorld = new CANNON.World({
			gravity: new CANNON.Vec3(0, -9.82, 0),
		});

		const groundBody = new CANNON.Body({
			type: CANNON.Body.STATIC,
			//infinite geometric plane
			shape: new CANNON.Plane(),
		});

		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		physicsWorld.addBody(groundBody);

		const sphereBody = new CANNON.Body({
			mass: 5,
			shape: new CANNON.Sphere(1),
		});

		const boxBody = new CANNON.Body({
			mass: 5,
			shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
		});

		sphereBody.position.set(0, 7, 0);
		boxBody.position.set(1, 10, 0);

		physicsWorld.addBody(sphereBody);
		physicsWorld.addBody(boxBody);

		const cannonDebugger = new CannonDebugger(scene, physicsWorld, {});

		const animate = () => {
			requestAnimationFrame(animate);
			physicsWorld.fixedStep();
			cannonDebugger.update();
			orbitControls.update();
			boxMesh.position.copy(boxBody.position);
			boxMesh.quaternion.copy(boxBody.quaternion);
			mesh.position.copy(sphereBody.position);
			mesh.quaternion.copy(sphereBody.quaternion);
			renderer.render(scene, camera);
		};

		animate();
	});

	window.addEventListener("resize", () => {
		resizeCamera(renderer);
	});
</script>

<main>
	<canvas class="draw" />
</main>

<style>
	*,
	*::before,
	*::after {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.draw {
		position: fixed;
		left: 0px;
		top: 0px;
		outline: none;
	}
</style>
