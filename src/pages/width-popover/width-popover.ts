import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DrawingProvider } from '../../providers/drawing/drawing';

@Component({
  selector: 'page-width-popover',
  templateUrl: 'width-popover.html',
})
export class WidthPopoverPage {

  constructor(public viewCtrl: ViewController, public drawing: DrawingProvider) {
    this.drawing.changeBrushWidth(50);
  }

  /**
   * Sets new brush width
   * @param width
   */
  setWidth(width) {
    this.drawing.changeBrushWidth(width);
    this.viewCtrl.dismiss();
  }
}
