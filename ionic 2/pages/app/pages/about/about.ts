import {Page, NavController} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/about/about.html',
})

export class AboutPage {
   constructor(public nav: NavController) {
   		alert('hello');
   }
}
