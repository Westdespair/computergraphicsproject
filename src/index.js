import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const canvas = document.getElementById('canvas');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( { canvas: canvas } );
renderer.setSize( canvas.clientWidth, canvas.clientHeight );
document.body.appendChild( renderer.domElement );

const cube_geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cube_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( cube_geometry, cube_material );
cube.position.x = 4;
scene.add( cube );

const loader = new FontLoader();
let text;
loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
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
    text = new THREE.Mesh( text_geometry, text_material );
    text.position.x = 0; text.position.y = 0; text.position.z = 1;
    scene.add( text );
} );

const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 2, 5, 20 );
scene.add( light );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    text.rotation.x -= 0.01;
    text.rotation.z += 0.008;
    renderer.render( scene, camera );
};

animate();
