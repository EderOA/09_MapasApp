import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


interface MarcadorConColor {
  color: string;
  marcador?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css'],
  styles:[
    `
    .mapa-container{
      height:100%;
      width:100%;
    }
    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;  
    }
    li{
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef

  mapa! : mapboxgl.Map;
  zoomlevel: number = 15;
  centro: [number, number] = [-99.23681404452685, 19.626740457192103];
  //Arreglo de marcadores
  marcadores: MarcadorConColor[] = [];


  ngAfterViewInit(): void{

    console.log('AfterViewInit', this.divMapa)
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.centro, // starting position [lng, lat]
      zoom: this.zoomlevel, // starting zoom
    });


    //const markerHtml : HTMLElement = document.createElement('div');
    //markerHtml.innerHTML = "Hola mundo";

    //const marker = new mapboxgl.Marker({
      //element: markerHtml
    //})
    //  .setLngLat( this.centro )
    //  .addTo( this.mapa );

    this.leerLocalStorage();

  }
 
  IrMarcador( marcadorParam : mapboxgl.Marker ){
    this.mapa.flyTo({
      center: marcadorParam.getLngLat()
    });
  }

  agregarMarcador(){

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

    //console.log("Agregando marcador");
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat( this.centro)
      .addTo( this.mapa );    
    
    this.marcadores.push({
      color,
      marcador: nuevoMarcador 
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    })

  }

  guardarMarcadoresLocalStorage(){

    const lngLatArr: MarcadorConColor[] = [];
    //const marcadorFake = new mapboxgl.Marker();

    this.marcadores.forEach( m =>{
      const color = m.color;
      const { lng, lat } = m.marcador!.getLngLat();

      lngLatArr.push({
        color: color,
        //marcador: marcadorFake,
        centro : [lng, lat]
      })

      localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

    })
  }

  leerLocalStorage(){
    if ( !localStorage.getItem('marcadores')){
      return;
    }
    const lngLatArr: MarcadorConColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach( m=>{

      const newMarker= new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
      .setLngLat(m.centro! )
      .addTo( this.mapa );

      this.marcadores.push({
        marcador: newMarker,
        color: m.color
      })
      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      })
    })

  }

  borrarMarcador(index : number){
    //console.log("Borrando ", index);
    this.marcadores[index].marcador?.remove();
    this.marcadores.splice(index, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
