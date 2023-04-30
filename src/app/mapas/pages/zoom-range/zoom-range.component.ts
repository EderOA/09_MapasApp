import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css'],
  styles:[
    `
    .mapa-container{
      height:100%;
      width:100%;
    }
    .row{
      background-color: white;
      border-radius: 5px;
      bottom:50px;
      left:50px;
      padding: 10px;
      position:fixed;
      z-index: 999;
      width:400px;
    }

    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef
  
  mapa! : mapboxgl.Map;
  zoomlevel: number = 15;
  centro: [number, number] = [-99.23681404452685, 19.626740457192103];

  constructor(){
  }
  ngOnDestroy(): void {
    this.mapa.off('zoom', ()=>{}); 
    this.mapa.off('zoomend', ()=>{});
    this.mapa.off('move', ()=>{});
  }

  ngAfterViewInit(): void{

    console.log('AfterViewInit', this.divMapa)
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.centro, // starting position [lng, lat]
      zoom: this.zoomlevel, // starting zoom
    });

    this.mapa.on('zoom', (ev)=>{
      this.zoomlevel = this.mapa.getZoom();
    })
    
    this.mapa.on('zoomend', (ev)=>{
      if (this.mapa.getZoom() > 18){
          this.mapa.zoomTo(18);
      }
    })
        
    this.mapa.on('move', ()=>{
      const {lng,lat} = this.mapa.getCenter(); 
      this.centro = [lng, lat];
    })

  }
  
  zoomOut(){
    //console.log('zoomOut', this.divMapa)
    this.mapa.zoomOut();
  }

  
  zoomIn(){
    //console.log('zoomIn', this.divMapa)
    this.mapa.zoomIn();
  }

  cambiarZoom(valor: string){
    this.mapa.zoomTo( Number(valor));
  }




}