import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DrawingProvider } from '../../providers/drawing/drawing';

@Component({
  selector: 'page-brush-type-popover',
  templateUrl: 'brush-type-popover.html',
})
export class BrushTypePopoverPage {

  constructor(public viewCtrl: ViewController, public drawing: DrawingProvider) {
  }

  /**
   * Sets new brush type
   * @param type
   */
  setType(type) {
    this.drawing.changeBrushType(type);
    this.viewCtrl.dismiss();
  }
}
