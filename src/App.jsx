import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Markup from "./components/js/markup";

// Images
import spaceBg from "./components/img/space.jpg";
import myImageBg from "./components/img/avatar-min.png";
import moonBg from "./components/img/moon.jpg";
import normalizeBg from "./components/img/normal.jpg";
import sunBg from "./components/img/sun.png";

export default class App extends Component {
    componentDidMount() {
        let scene = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        let renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        camera.position.set(10, 10, 10);

        const controls = new OrbitControls(camera, renderer.domElement);

        const Torus = new THREE.Mesh(
            new THREE.TorusGeometry(10, 2, 32, 100),
            new THREE.MeshStandardMaterial({
                color: 0xff0057,
            })
        );
        Torus.position.x = 5;
        scene.add(Torus);

        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);

        // const pointLightHelper = new THREE.PointLightHelper(pointLight);
        // const grid = new THREE.GridHelper(200, 50);
        // scene.add(pointLightHelper, grid);

        /**
         * Generates Stars at random position.
         */
        function generateStars() {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 24, 24),
                new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                })
            );

            const [x, y, z] = Array(3)
                .fill()
                .map(() => THREE.MathUtils.randFloatSpread(150));

            sphere.position.set(x, y, z);
            scene.add(sphere);
        }

        Array(400).fill().forEach(generateStars);

        const spaceTexture = new THREE.TextureLoader().load(spaceBg);
        scene.background = spaceTexture;

        // My image
        const myImage = new THREE.TextureLoader().load(myImageBg);
        const boxImage = new THREE.Mesh(
            new THREE.BoxGeometry(6, 6, 6),
            new THREE.MeshBasicMaterial({ map: myImage, transparent: true })
        );
        boxImage.rotation.x = Math.PI / 3;
        boxImage.rotation.y = Math.PI / 4;
        boxImage.rotation.z = -Math.PI / 8;
        boxImage.position.x = 5;
        scene.add(boxImage);

        // Moon
        const moonTexture = new THREE.TextureLoader().load(moonBg);
        const normalTexture = new THREE.TextureLoader().load(normalizeBg);
        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(5, 32, 32),
            new THREE.MeshStandardMaterial({
                map: moonTexture,
                normalMap: normalTexture,
            })
        );
        moon.position.z = 30;
        moon.position.setX(-20);
        scene.add(moon);

        // Sun
        const sunTexture = new THREE.TextureLoader().load(sunBg);
        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(15, 64, 64),
            new THREE.MeshBasicMaterial({ map: sunTexture })
        );
        sun.position.z = 60;
        sun.position.x = 28;
        scene.add(sun);

        document.body.onscroll = () => {
            console.log("hi");
            const top = document.body.getBoundingClientRect().top;
            // moon.rotation.x += 0.05;
            moon.rotation.y += 0.075;
            // moon.rotation.z += 0.05;

            boxImage.rotation.y = top * 0.001 + Math.PI / 4;
            boxImage.rotation.z = top * 0.001 - Math.PI / 8;

            camera.position.x = top * -0.002 + 10;
            camera.position.y = top * -0.002 + 10;
            camera.position.z = top * -0.01 + 10;

            console.log(camera.position.x);
        };

        function animate() {
            requestAnimationFrame(animate);
            Torus.rotation.x += 0.01;
            Torus.rotation.y += 0.005;
            Torus.rotation.z += 0.01;
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;

            renderer.setSize(window.innerWidth, window.innerHeight);

            camera.updateProjectionMatrix();
        });
    }
    render() {
        return (
            <>
                <canvas></canvas>
                <Markup />
            </>
        );
    }
}
