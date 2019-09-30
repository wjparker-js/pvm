import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DrawingProvider } from '../../providers/drawing/drawing';

@Component({
  selector: 'page-colors-popover',
  templateUrl: 'colors-popover.html',
})
export class ColorsPopoverPage {

  constructor(public viewCtrl: ViewController, public drawing: DrawingProvider) {
  }

  /**
   * Sets new brush color
   * @param color
   */
  setColor(color) {
    this.drawing.changeBrushColor(color);
    this.viewCtrl.dismiss();
  }
}
