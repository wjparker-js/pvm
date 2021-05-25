import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, Content, NavController, NavParams, ViewController, PopoverController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { DrawingProvider } from '../../providers/drawing/drawing';
import { ColorsPopoverPage } from '../colors-popover/colors-popover';
import { WidthPopoverPage } from '../width-popover/width-popover';
import { BrushTypePopoverPage } from '../brush-type-popover/brush-type-popover';
import { QueryEncoder } from '@angular/http';

@Component({
  selector: 'page-imgedit',
  templateUrl: 'imgedit.html'
})

export class ImgEditPage {

  @ViewChild(Content) content: Content;

  public drawingEnabled: boolean = true;
  imgwidth:any;
  imgheight:any;
  callback: any;
  noedit:any;
  source:any;

  constructor(
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController, 
    public viewCtrl: ViewController,
    public platform: Platform,
    public camera: Camera,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public drawing: DrawingProvider
  ) {}

  ionViewDidLoad() {

    this.callback  = this.navParams.get("callback");    
    this.source    = this.navParams.get("source");

    let dimensions = this.content.getContentDimensions();
    let width      = dimensions.contentWidth;
    let height     = dimensions.scrollHeight;

    if(this.platform.is('ios')) {
      height -= 44; // size of header
      height -= 44; // size of footer
    } else {
      height -= 56; // size of header
      height -= 56; // size of footer
    }

    this.imgheight = height;
    this.imgwidth  = width;
    this.drawing.create(width, height);   
console.log(this.source);
    this.drawingEnabled = true;
    var imageToView = localStorage.getItem(this.source);    
    this.drawing.addImage(imageToView);
    this.drawing.enableDrawing();
  }

  save() {
    localStorage.setItem(this.source, this.drawing.getAsImage()); 
    this.dismiss();
  }

  ok() {
    this.drawingEnabled = true;
    this.drawing.enableDrawing();
  }

  openColorsPopover(event) {
    let popover = this.popoverCtrl.create(ColorsPopoverPage);
    popover.present({
      ev: event
    });
  }

  openWidthsPopover(event) {
    let popover = this.popoverCtrl.create(WidthPopoverPage);
    popover.present({
      ev: event
    });
  }

  openTypesPopover(event) {
    let popover = this.popoverCtrl.create(BrushTypePopoverPage);
    popover.present({
      ev: event
    });
  }

  addText() {
    let alert = this.alertCtrl.create({
      title: 'Add text',
      inputs: [
        {
          name: 'text',
          placeholder: 'Your text here'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'OK',
          handler: (data) => {
            if (data.text === "")
              return false;

            // when adding text we need to disable drawing so that is possible
            // to manage text on screen
            this.drawingEnabled = false;
            this.drawing.addText(data.text);
          }
        }
      ]
    });

    alert.present();
  }

  addImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add photo',
      buttons: [
        {
          text: 'Take picture',
          icon: 'camera',
          handler: () => {
            this.takePicture(true)
              .then(
                (image: string) => {
                  this.drawingEnabled = false;
                  this.drawing.addImage(image);
                  //canvas.setActiveObject(canvas.item(0));
                  //image.scaleToHeight(300);
                  //image.scaleToWifth(300);
                }
              )
              .catch(() => {})
            ;
          }
        },{
          text: 'Select from gallery',
          icon: 'image',
          handler: () => {
            this.takePicture(false)
              .then(
                (image: string) => {
                  this.drawingEnabled = false;
                  this.drawing.addImage(image);
                }
              )
              .catch(() => {})
            ;
          }
        },{
          text: 'Cancel',
          icon: 'close',
          handler: () => {}
        }
      ]
    });

    actionSheet.present();
  }

  addBackground() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add background',
      buttons: [
        {
          text: 'Take picture',
          icon: 'camera',
          handler: () => {
            this.takePicture(true)
              .then(
                (image: string) => {
                  this.drawing.addBackgroundImage(image);
                }
              ).catch(() => {})
            ;
          }
        },{
          text: 'Select from gallery',
          icon: 'image',
          handler: () => {
            this.takePicture(false)
              .then(
                (image: string) => {
                  this.drawing.addBackgroundImage(image);
                }
              )
              .catch(() => {})
            ;
          }
        },{
          text: 'Cancel',
          icon: 'close',
          handler: () => {}
        }
      ]
    });

    actionSheet.present();
  }

  undo() {
    this.drawing.undo();
  }

  ionViewWillLeave() {
		this.callback(this.drawing.getAsImage()).then(()=>{});
	}

  dismiss() {
		this.viewCtrl.dismiss('') ;
	} 
	 
  private takePicture(from_camera) {

    return new Promise((resolve, reject) => {

      // define camera options
      let options = {
        quality           : 50,
        allowEdit         : false,
        saveToPhotoAlbum  : false,
        cameraDirection   : 0,
        correctOrientation: true,
        targetWidth       : 1200,
        targetHeight      : 800,
        sourceType        : from_camera ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType   : this.camera.DestinationType.DATA_URL,
        encodingType      : this.camera.EncodingType.JPEG
      };

      this.camera.getPicture(options).then(
        (image) => resolve('data:image/jpeg;base64,' + image),
        () => reject()
      );
    });
  }
}
