import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CapacitorFlash } from '@capgo/capacitor-flash';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @ViewChild('frequencyCanvas', { static: false }) frequencyCanvas!: ElementRef;
  audioContext: AudioContext;
  analyser: AnalyserNode;
  dataArray: Uint8Array;
  source!: MediaElementAudioSourceNode;
  isPlaying: boolean = false;
  backgroundColor: string = 'white';
  chart: any;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    const ctx = this.frequencyCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({ length: this.analyser.frequencyBinCount }, (_, i) => i.toString()),
        datasets: [{
          label: 'Frequency Data',
          data: this.dataArray,
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: false
          },
          y: {
            beginAtZero: true,
            min: 0, // Définir la valeur minimale de l'axe Y
            max: 256 // Définir la valeur maximale de l'axe Y pour dézoomer
          }
        }
      }
    });
  }

  updateChart() {
    this.analyser.getByteFrequencyData(this.dataArray);
    this.chart.data.datasets[0].data = this.dataArray;
    this.chart.update();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.playAudio(file);
    }
  }

  playAudio(file: File) {
    const audio = new Audio(URL.createObjectURL(file));
    this.source = this.audioContext.createMediaElementSource(audio);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    audio.play();
    this.isPlaying = true;
    this.visualizeMusic();
  }

  visualizeMusic() {
    if (!this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    const average = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;

    if (average > 200) {
      this.backgroundColor = 'purple';
    } else if (average > 150) {
      this.backgroundColor = 'red';
    } else if (average > 100) {
      this.backgroundColor = 'orange';
    } else if (average > 75) {
      this.backgroundColor = 'yellow';
    } else if (average > 50) {
      this.backgroundColor = 'green';
    } else if (average > 25) {
      this.backgroundColor = 'blue';
    } else {
      this.backgroundColor = 'black';
    }

    this.updateChart();
    requestAnimationFrame(() => this.visualizeMusic());
  }

  flashWithMusic() {
    if (!this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    const average = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;

    if (average > 128) {
      CapacitorFlash.switchOn({ intensity: 1 });
    } else {
      CapacitorFlash.switchOff();
    }

    requestAnimationFrame(() => this.flashWithMusic());
  }

  async allumerLampe() {
    await CapacitorFlash.switchOn({ intensity: 1 });
  }

  async eteindreLampe() {
    await CapacitorFlash.switchOff();
  }

  async toggleLampe() {
    let isOn = false; //par défaut la lumière est éteinte

    if (!isOn) {
      await CapacitorFlash.switchOn({ intensity: 1 });
      isOn = true;
    } else {
      await CapacitorFlash.switchOff();
      isOn = false;
    }
  }
}