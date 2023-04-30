import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';



@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.css'],
  styles:[
    `
    #mapa{
      height:100%;
      width:100%;
    }
    `
  ]
})
export class FullscreenComponent implements OnInit {

  ngOnInit(): void{

    
  
    const map = new mapboxgl.Map({
      container: 'mapa', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-99.23681404452685, 19.626740457192103], // starting position [lng, lat]
      zoom: 15, // starting zoom
    });
  }
}
