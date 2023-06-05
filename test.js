import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

class Object{
    constructor(model, anim_channels, anim_mixer, pos, rot, scale)
    {
        this.model = model;
        this.anim_channels = anim_channels;
        this.anim_mixer = anim_mixer;

        this.pos = pos;
        this.rot = rot;
        this.scale = scale;
    }
}

class Application{
    
    constructor()
    {
        this.SceneInit();
        this.CameraInit();
        this.LightInit();
        this.RendererInit();
        this.ObjectsInit();
    }

    SceneInit()
    {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xdddddd);
    }

    CameraInit()
    {
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 5000);
        this.camera.position.set( 12, 8, 4 );
        this.camera.lookAt(this.scene.position);
    }

    LightInit()
    {
        this.main_light = new THREE.DirectionalLight( 0xffff00, 0.6 );
        this.main_light.position.set( 15, 10, 14 );
        this.main_light.target.position.set(0, 0, 0);
        this.main_light.castShadow = true;
        this.scene.add(this.main_light);
        this.scene.add(this.main_light.target);

        this.amb_light = new THREE.AmbientLight( 0xaaaaff );
        this.scene.add(this.amb_light);
    }

    RendererInit()
    {
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }

    ObjectsInit()
    {
        this.clock = new THREE.Clock();
        this.objects = new Map();
        let p1 = this.ObjectInit('mascot1', 'static/mascot.gltf', [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], 1.5);
        let p2 = this.ObjectInit('mascot2', 'static/mascot.gltf', [2.0, 2.0, -1.7], [0.01, 0.0, 0.0], 1.5);

        Promise.all([p1,p2]).then( () => {
            this.RenderScene();
            this.objects.forEach( obj => {
                for (let i = 0 ; i < obj.anim_channels.length ; ++i)
                {
                    obj.anim_mixer.clipAction(obj.anim_channels[i]).play();
                } 
            });
            this.Animate();
        });
    }

    RenderScene()
    {
        this.scene.add( this.objects.get('mascot1').model );
        this.scene.add( this.objects.get('mascot2').model );
        this.renderer.render( this.scene, this.camera );
    }

    ObjectInit(obj_name, url, pos, rot, scale)
    {
        return this.LoadModel(url).then( result => {
            this.objects.set(obj_name, new Object(result.scene.children[0],
                                       result.animations,
                                       new THREE.AnimationMixer(result.scene.children[0]),
                                       pos, rot, scale));
        });
    }

    LoadModel(url)
    {
        return new Promise( resolve => {
            new GLTFLoader().load(url, resolve);
        });
    }

    Animate()
    {
        requestAnimationFrame( ()=>this.Animate() );  //https://stackoverflow.com/questions/28908999/use-requestanimationframe-in-a-class
        const delta = this.clock.getDelta();

        this.objects.forEach( obj => {
            for (let i = 0 ; i < obj.anim_channels.length ; ++i)
            {
                obj.anim_mixer.update(delta);
            }

            // obj.model.rotateX(obj.rot[0]);
            // obj.model.rotateY(obj.rot[1]);
            // obj.model.rotateZ(obj.rot[2]);

            obj.model.translateX(obj.pos[0]);
            obj.model.translateY(obj.pos[1]);
            obj.model.translateZ(obj.pos[2]);
            
            // obj.model.scale =obj.scale);
        });

        this.renderer.render( this.scene, this.camera );
    }
}

var app = new Application();