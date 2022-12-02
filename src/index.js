import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const canvas = document.getElementById('canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( { canvas: canvas } );
renderer.setSize( canvas.clientWidth, canvas.clientHeight );

const cube_geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cube_material = new THREE.MeshPhongMaterial( { color: 0x00ff00, specular: 0xffffff } );
const cube = new THREE.Mesh( cube_geometry, cube_material );
cube.position.x = 4;
scene.add( cube );

const loader = new FontLoader();
const textgroup = new THREE.Group();

loader.load( 'res/fonts/helvetiker_regular.typeface.json', function ( font ) {
    const text_geometry = new TextGeometry( '! You are winner !', {
        font: font,
        size: 0.3,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    } );

    const text_material = new THREE.MeshPhongMaterial( { color: 0xff00ff, specular: 0xffffff } );
    const text = new THREE.Mesh( text_geometry, text_material );
    text_geometry.computeBoundingBox();
    text.position.x -= text_geometry.boundingBox.max.x / 2;
    textgroup.add( text );
} );
scene.add(textgroup);

const light = new THREE.PointLight( 0xffffff, 2, 100 );
light.position.set( 2, 5, 20 );
scene.add( light );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );
    render();
};

function render() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    textgroup.rotation.x -= 0.01;
    textgroup.rotation.z += 0.008;

    renderer.clear();
    renderer.render( scene, camera );
}

animate();
