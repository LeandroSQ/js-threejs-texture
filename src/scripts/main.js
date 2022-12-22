import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	AmbientLight,
	PointLight,
	TextureLoader,
	MeshPhongMaterial,
	PlaneGeometry,
	Mesh,
	Vector2
} from "three";
import { OrbitControls } from "./OrbitControls.js";
import "./utils";
import { GUI } from "dat.gui";

class App {

	viewport = {
		width: window.innerWidth,
		height: window.innerHeight
	};

	constructor() {
		this.attachHooks();
	}

	attachHooks() {
		window.addLoadEventListener(this.init.bind(this));
	}

	init() {
		// Create scene
		this.scene = new Scene();

		// Create camera
		this.camera = new PerspectiveCamera(
			60,
			this.viewport.width / this.viewport.height,
			1,
			5000
		);
		this.camera.position.set(0, 0, 400);
		this.scene.add(this.camera);

		// Create renderer
		this.renderer = new WebGLRenderer();
		this.renderer.setSize(this.viewport.width, this.viewport.height);
		document.body.appendChild(this.renderer.domElement);

		this.initLighting();
		this.initMesh();
		this.initControls();

		this.render();
	}

	initLighting() {
		// Create lighting
		const pointLight = new PointLight(0xffffff, 1.2);
		pointLight.position.set(0, 0, 400);
		this.camera.add(pointLight);
	}

	initGui(material) {
		// Create GUI
		const gui = new GUI();
		gui.add(material, "displacementScale", 0, 50);
		gui.add(material, "aoMapIntensity", 0, 1);
		gui.addColor(material, "specular");
		gui.add(material, "shininess", 0, 1000);

		const normalMapFolder = gui.addFolder("Normal map");
		normalMapFolder.add(material.normalScale, "x", 0, 10, 0.01);
		normalMapFolder.add(material.normalScale, "y", 0, 10, 0.01);
	}

	initMesh() {
		// Load textures
		const textureLoader = new TextureLoader();
		const texture = textureLoader.load("assets/texture.jpg");
		const displacementMap = textureLoader.load("assets/texture-displacement.jpg");
		const normalMap = textureLoader.load("assets/texture-normal.jpg");
		const ambientOcclusionMap = textureLoader.load("assets/texture-ambient-occlusion.jpg");
		const specularMap = textureLoader.load("assets/texture-specular.jpg");

		// Create material
		const material = new MeshPhongMaterial({
			map: texture,
			shininess: 204,

			displacementMap: displacementMap,
			displacementScale: 9,

			normalMap: normalMap,
			normalScale: new Vector2(2.14, 0.82),

			aoMap: ambientOcclusionMap,
			aoMapIntensity: 0.75,

			specularMap: specularMap,
			specular: 0x4a3e0f
		});

		// Create geometry
		const geometry = new PlaneGeometry(235, 400, 50, 50);
		const mesh = new Mesh(geometry, material);
		this.scene.add(mesh);

		this.initGui(material);
	}

	initControls() {
		// Camera controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
	}

	render() {
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render.bind(this));
	}

}

window.app = new App();