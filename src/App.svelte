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
	const mass = 1;
	const axisWidth = 5;
	const wheelShape = new CANNON.Sphere(1);
	const wheelMaterial = new CANNON.Material("wheel");
	const down = new CANNON.Vec3(0, -1, 0);
	const carBody = new CANNON.Body({
		mass: 5,
		position: new CANNON.Vec3(0, 6, 0),
		shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2)),
	});
	const vehicle = new CANNON.RigidVehicle({
		chassisBody: carBody,
	});

	const wheelBody1 = new CANNON.Body({
		mass,
		material: wheelMaterial,
	});

	wheelBody1.addShape(wheelShape);
	wheelBody1.angularDamping = 0.4;
	vehicle.addWheel({
		body: wheelBody1,
		position: new CANNON.Vec3(-2, 0, axisWidth / 2),
		axis: new CANNON.Vec3(0, 0, 1),
		direction: down,
	});

	const wheelBody2 = new CANNON.Body({
		mass,
		material: wheelMaterial,
	});

	wheelBody2.addShape(wheelShape);
	wheelBody2.angularDamping = 0.4;
	vehicle.addWheel({
		body: wheelBody2,
		position: new CANNON.Vec3(-2, 0, -axisWidth / 2),
		axis: new CANNON.Vec3(0, 0, 1),
		direction: down,
	});

	const wheelBody3 = new CANNON.Body({
		mass,
		material: wheelMaterial,
	});

	wheelBody3.addShape(wheelShape);
	wheelBody3.angularDamping = 0.4;
	vehicle.addWheel({
		body: wheelBody3,
		position: new CANNON.Vec3(2, 0, -axisWidth / 2),
		axis: new CANNON.Vec3(0, 0, 1),
		direction: down,
	});

	const wheelBody4 = new CANNON.Body({
		mass,
		material: wheelMaterial,
	});

	wheelBody4.addShape(wheelShape);
	wheelBody4.angularDamping = 0.4;
	vehicle.addWheel({
		body: wheelBody4,
		position: new CANNON.Vec3(2, 0, axisWidth / 2),
		axis: new CANNON.Vec3(0, 0, 1),
		direction: down,
	});

	//car
	document.addEventListener("keydown", (event) => {
		const maxSteerVal = Math.PI / 8;
		const maxForce = 10;

		switch (event.key) {
			case "w":
			case "ArrowUp":
				vehicle.setWheelForce(maxForce, 0);
				vehicle.setWheelForce(maxForce, 1);
				break;
			case "s":
			case "ArrowDown":
				vehicle.setWheelForce(-maxForce / 2, 0);
				vehicle.setWheelForce(-maxForce / 2, 1);
				break;

			case "a":
			case "ArrowLeft":
				vehicle.setSteeringValue(maxSteerVal, 0);
				vehicle.setSteeringValue(maxSteerVal, 1);
				break;

			case "d":
			case "ArrowRight":
				vehicle.setSteeringValue(-maxSteerVal, 0);
				vehicle.setSteeringValue(-maxSteerVal, 1);
				break;
		}
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
		vehicle.addToWorld(physicsWorld);

		const cannonDebugger = new CannonDebugger(scene, physicsWorld, {});

		const animate = () => {
			requestAnimationFrame(animate);
			physicsWorld.fixedStep();
			cannonDebugger.update();
			orbitControls.update();

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
