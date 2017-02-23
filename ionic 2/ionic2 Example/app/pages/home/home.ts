import {Page} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

public name;

  constructor() {
  	this.name = "SunBlue";
  }
}
