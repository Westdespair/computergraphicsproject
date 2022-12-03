import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { Sun } from '/src/objects/sun.js';
import { Ground } from '/src/objects/ground.js';
import { Cube } from '/src/objects/cube.js';

const sun_position = document.getElementById('sun_slider');
const add_cube_btn = document.getElementById('add_cube_btn');
const fov_slider = document.getElementById('fov_slider');
const canvas = document.getElementById('canvas');

const scene = new THREE.Scene();

// Create renderer
const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
renderer.setSize( canvas.clientWidth, canvas.clientHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;


fov_slider.oninput = function(event) {
    document.getElementById('fov_display').value=event.target.value;
    camera.fov = event.target.value;
    camera.updateProjectionMatrix();
}
const camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth / canvas.clientHeight, 0.1, 1e6 )
fov_slider.value = camera.fov; fov_slider.dispatchEvent(new Event('input'));
camera.position.set(0, 2, 5);

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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

canvas.onmousedown = function(event) {
    event.preventDefault();
    // possible race condition if dragging not set before this handler runs?
    if (control.dragging) {
        return;
    }
    // If control is enabled, clicking outside the drag handles will disable it
    if ( control.enabled ) {
        control.deselect();
        return;
    }
    // Get mouse position in camera image plane, raycast to find intersecting objects
    mouse.x = ( (event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = -( (event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( group.children );
    // Get only meshes
    const intersected_meshes = intersects.filter( function( intersect ) {
        return intersect.object.type === 'Mesh';
    } );
    if ( intersected_meshes.length > 0 ) {
        const object = intersected_meshes[0].object;
        // Avoid selecting the ground
        if (object != ground.mesh) {
            control.select(object);
        }
    }
};

// Logic to create and destroy cubes
add_cube_btn.onclick = function() {
    // Randomize x, z position and color
    const pos = new THREE.Vector3( Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2 );   
    const color = Math.random() * 0xffffff;
    const cube = new Cube(group, pos, new THREE.Vector3(1, 1, 1), color);
};

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

const sun = new Sun(group);
const ground = new Ground(group, new THREE.Vector3(0, 0, 0), 100, 100, 0x262626);

const global_light = new THREE.AmbientLight( 0xffffff, 0.01 );
scene.add( global_light );

scene.add( group );
scene.add( control );

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
