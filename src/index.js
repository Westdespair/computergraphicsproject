import * as THREE from 'three';
import { Sun } from '/src/objects/sun.js';
import { Ground } from '/src/objects/ground.js';

const sun_position = document.getElementById('sun_slider');

const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 0.1, 1e6 );
camera.position.z = 5;
camera.position.x = 2;
camera.position.y = 2;

const group = new THREE.Group();

const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
renderer.setSize( canvas.clientWidth, canvas.clientHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const cube_geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cube_material = new THREE.MeshPhongMaterial( { color: 0x8c8c8c, specular: 0xffffff, shininess: 30 } );
const cube = new THREE.Mesh( cube_geometry, cube_material );
cube.castShadow = true;
cube.receiveShadow = true;
//cube.position.x = 4;
cube.position.y = 0.5;
cube.rotation.y = 0.2;
group.add( cube );


const cube2 = new THREE.Mesh( cube_geometry, cube_material );
cube2.castShadow = true;
cube2.receiveShadow = true;
cube2.position.x = 4;
cube2.position.z = 0.5;
cube2.position.y = 0.5;
cube2.rotation.y = 0.2;
group.add( cube2 );

const sun = new Sun(group);
const ground = new Ground(group, new THREE.Vector3(0, 0, 0), 100, 100, 0x262626);

const global_light = new THREE.AmbientLight( 0xffffff, 0.01 );
scene.add( global_light );

scene.add(group);

function animate() {
    requestAnimationFrame( animate );
    render();
};

function render() {
    sun.set_position(sun_position.value);
    renderer.clear();
    renderer.render( scene, camera );
}

animate();
