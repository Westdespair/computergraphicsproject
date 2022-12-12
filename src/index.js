import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { Sun } from '/src/objects/sun.js';
import { Ground } from '/src/objects/ground.js';
import { Park } from '/src/objects/park.js';
import { Cube } from '/src/objects/cube.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {BufferGeometry} from "three";


const sun_position = document.getElementById('sun_slider');
const add_cube_btn = document.getElementById('add_cube_btn');
const fov_slider = document.getElementById('fov_slider');
const reset_camera_btn = document.getElementById('reset_camera_btn');
const main_canvas = document.getElementById('main_canvas');
const heatmap_canvas = document.getElementById('heatmap_canvas');
const addButton = document.getElementById("addBtn");





const scene = new THREE.Scene();

// Create renderer
const renderer = new THREE.WebGLRenderer( { canvas: main_canvas, antialias: true } );
renderer.setSize( main_canvas.parentElement.clientWidth, main_canvas.parentElement.clientHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

fov_slider.oninput = function(event) {
    document.getElementById('fov_display').value=event.target.value;
    camera.fov = event.target.value;
    camera.updateProjectionMatrix();
}
const camera = new THREE.PerspectiveCamera( 75, main_canvas.parentElement.clientWidth / main_canvas.parentElement.clientHeight, 0.1, 1e6 )
fov_slider.value = camera.fov; fov_slider.dispatchEvent(new Event('input'));
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

// Create a group to hold all objects
const group = new THREE.Group();

// Mouse drag controls and related raycaster
const control = new TransformControls( camera, renderer.domElement );
control.enabled = false;
control.showY = false; // Disable vertical movement
control.select = function(object) {
    this.attach( object );
    this.enabled = true;
    object.material.transparent=true;
    object.material.opacity=0.5;
    object.material.emissive.set( 0x008800 );
};
control.deselect = function() {
    if( this.object != null ) {
        this.object.material.transparent=false;
        this.object.material.opacity=1;
        this.object.material.emissive.set( 0x000000 );
    }
    this.detach();
    this.enabled = false;
};

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.maxDistance = 100;
orbit.minDistance = 2;
//orbit.maxPolarAngle = Math.PI / 2; Doesn't keep from panning below the ground
reset_camera_btn.onclick = function() { orbit.reset(); }

const stats = new Stats();
stats.dom.style.cssText = "position: fixed; cursor: pointer; opacity: 0.9; z-index: 10000;"; // Fix position on top of main canvas
main_canvas.parentNode.appendChild( stats.dom );


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

main_canvas.onmousedown = function(event) {
    event.preventDefault();
    orbit.enabled = true;
    // possible race condition if dragging not set before this handler runs?
    if (control.dragging) {
        orbit.enabled = false;
        return;
    }
    // If control is enabled, clicking outside the drag handles will disable it
    if ( control.enabled ) {
        control.deselect();
        return;
    }
    // Get mouse position in camera image plane, raycast to find intersecting objects
    mouse.x = ( (event.clientX - renderer.domElement.parentElement.offsetLeft) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = -( (event.clientY - renderer.domElement.parentElement.offsetTop) / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( group.children );
    // Get only meshes
    const intersected_meshes = intersects.filter( function( intersect ) {
        return intersect.object.type === 'Mesh';
    } );
    if ( intersected_meshes.length > 0 ) {
        const object = intersected_meshes[0].object;
        // Avoid selecting the ground or park
        if (object != ground.mesh && object != park.mesh) {
            control.select(object);
        }
    }
};


addButton.onclick = function() {
    const name = (shape.value)

    switch(name) {
        case "Cube":
            add_cube()
        break;

        case "House":
            add_gltf("enebolig1")
        break;

        case "Tree":
            add_gltf("tree")
            break;

        case "Skyscraper":
            add_gltf("skyscraper1")
            break;

        case "Bush":
            add_gltf("bush")
            break;

        case "Playground":
            add_gltf("swingset")
            break;

        case "Picnicbench":
            add_gltf("picnicbench")
            break;

        case "Parkbench":
            add_gltf("parkbench")
            break;

    }



}


function add_cube() {
    // Randomize x, z position and color
    const pos = new THREE.Vector3( Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2 );
    const color = Math.random() * 0xffffff;
    const cube = new Cube(group, pos, new THREE.Vector3(1, 1, 1), color);
}



function add_gltf(object) {
    // Randomize x, z position and color
    const pos = new THREE.Vector3(Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2);
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('res/objects/'+object+'.gltf', (gltf) => {
        const root = gltf.scene;
        gltf.scene.children[0].scale.set(1*gltf.scene.children[0].scale.x,1*gltf.scene.children[0].scale.y, 1*gltf.scene.children[0].scale.z);
        gltf.scene.position.set(pos);
        gltf.scene.children[0].recieveShadow = true;
        gltf.scene.children[0].castShadow = true;
        group.add(gltf.scene.children[0]);
    })
}


// Key events
document.addEventListener('keydown', function(event) {
    if (event.key == "Delete") {
        if (control.enabled) {
            group.remove(control.object);
            control.deselect();
        }
    } else if (event.key == "Escape") {
        control.deselect();
    } else if (event.key == "Shift") {
        control.setTranslationSnap(0.5);
        control.setRotationSnap(THREE.MathUtils.degToRad(15));
    } else if (event.key.toLowerCase() == "r") {
        if (control.mode == "rotate") {
            control.setMode("translate");
            control.showX = true; control.showY = false; control.showZ = true;
        } else {
            control.setMode("rotate");
            control.showX = false; control.showY = true; control.showZ = false;
        }
    }
});

document.addEventListener( 'keyup', function(event) {
    if (event.key == "Shift") {
        control.setTranslationSnap(null);
        control.setRotationSnap(null);
    }
}
);

window.addEventListener( 'resize', function() {
    camera.aspect = main_canvas.parentElement.clientWidth / main_canvas.parentElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( main_canvas.parentElement.clientWidth, main_canvas.parentElement.clientHeight ); 
});

const sun = new Sun(group);
sun.disableHelper();
const ground = new Ground(group, new THREE.Vector3(0, 0, 0), 1000, 1000, 0x262626);
const park = new Park(group, new THREE.Vector3(0, 0.05, 0), 20, 20, 0x00ff00);

const global_light = new THREE.AmbientLight( 0xffffff, 0.02 );
scene.add( global_light );

scene.add( group );
scene.add( control );

function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
};

function render() {
    sun.setPosition(sun_position.value);
    renderer.clear();
    renderer.render( scene, camera );
}

animate();
