import * as THREE from 'three';
import { WeatherState } from '../../types/game';

export class WeatherSystem {
  private scene: THREE.Scene;
  private rainParticles: THREE.Points | null = null;
  private rainCount: number = 1800;
  private rainGeometry: THREE.BufferGeometry | null = null;
  private dirLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private currentWeather: WeatherState = 'sunny';

  constructor(scene: THREE.Scene, dirLight: THREE.DirectionalLight, hemiLight: THREE.HemisphereLight) {
    this.scene = scene;
    this.dirLight = dirLight;
    this.hemiLight = hemiLight;
    this.initRain();
  }

  private initRain() {
    this.rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.rainCount * 3);

    for (let i = 0; i < this.rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;     // X: -30 to 30
      positions[i * 3 + 1] = Math.random() * 25 + 2;      // Y: 2 to 27
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60; // Z: -30 to 30
    }

    this.rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const rainMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.16,
      transparent: true,
      opacity: 0.65,
    });

    this.rainParticles = new THREE.Points(this.rainGeometry, rainMaterial);
    this.rainParticles.visible = false;
    this.scene.add(this.rainParticles);
  }

  public setWeather(weather: WeatherState) {
    this.currentWeather = weather;

    if (weather === 'sunny') {
      this.dirLight.intensity = 1.35;
      this.dirLight.color.setHex(0xfff7ed);
      this.hemiLight.intensity = 0.85;
      this.hemiLight.color.setHex(0xe0f2fe);
      if (this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.color.setHex(0xdbeafe);
        this.scene.fog.near = 45;
        this.scene.fog.far = 110;
      }
      if (this.rainParticles) this.rainParticles.visible = false;
    } else if (weather === 'cloudy') {
      this.dirLight.intensity = 0.95;
      this.dirLight.color.setHex(0xe2e8f0);
      this.hemiLight.intensity = 0.7;
      if (this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.color.setHex(0x94a3b8);
        this.scene.fog.near = 40;
        this.scene.fog.far = 95;
      }
      if (this.rainParticles) this.rainParticles.visible = false;
    } else if (weather === 'rain_light') {
      this.dirLight.intensity = 0.75;
      this.dirLight.color.setHex(0x94a3b8);
      this.hemiLight.intensity = 0.55;
      if (this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.color.setHex(0x64748b);
        this.scene.fog.near = 35;
        this.scene.fog.far = 85;
      }
      if (this.rainParticles) {
        this.rainParticles.visible = true;
        (this.rainParticles.material as THREE.PointsMaterial).opacity = 0.45;
      }
    } else if (weather === 'rain_heavy' || weather === 'rain_torrential') {
      this.dirLight.intensity = 0.45;
      this.dirLight.color.setHex(0x475569);
      this.hemiLight.intensity = 0.4;
      if (this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.color.setHex(0x334155);
        this.scene.fog.near = 28;
        this.scene.fog.far = 70;
      }
      if (this.rainParticles) {
        this.rainParticles.visible = true;
        (this.rainParticles.material as THREE.PointsMaterial).opacity = weather === 'rain_torrential' ? 0.8 : 0.6;
      }
    } else if (weather === 'clearing') {
      this.dirLight.intensity = 1.2;
      this.dirLight.color.setHex(0xfef08a); // warm afternoon sunbeam
      this.hemiLight.intensity = 0.75;
      if (this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.color.setHex(0xcfd8dc);
        this.scene.fog.near = 40;
        this.scene.fog.far = 100;
      }
      if (this.rainParticles) this.rainParticles.visible = false;
    }
  }

  public update(delta: number) {
    if (!this.rainParticles || !this.rainParticles.visible || !this.rainGeometry) return;

    const positions = this.rainGeometry.attributes.position.array as Float32Array;
    const speed = (this.currentWeather === 'rain_torrential' ? 24 : 14) * delta;

    for (let i = 0; i < this.rainCount; i++) {
      const idx = i * 3 + 1;
      positions[idx] -= speed;
      // Slight wind slant
      positions[i * 3] += speed * 0.15;

      // Loop back to top
      if (positions[idx] < 0) {
        positions[idx] = 25;
        positions[i * 3] = (Math.random() - 0.5) * 60;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      }
    }

    this.rainGeometry.attributes.position.needsUpdate = true;
  }
}
