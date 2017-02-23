import {Page} from 'ionic-angular';
import {AboutPage} from '../about/about';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  
  paginaAbout = AboutPage;


  greeter;
  suma = 3;

  constructor() {
    this.greeter = 'Ir al menu';
    console.log('hola');
  }


add(x:number, y:number) {
     this.suma += x + y;
}


  
}
