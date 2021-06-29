import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, Content, NavController, NavParams, ViewController, PopoverController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { DrawingProvider } from '../../providers/drawing/drawing';
import { ColorsPopoverPage } from '../colors-popover/colors-popover';
import { WidthPopoverPage } from '../width-popover/width-popover';
import { BrushTypePopoverPage } from '../brush-type-popover/brush-type-popover';

@Component({
  selector: 'page-imgeditpost',
  templateUrl: 'imgeditpost.html'
})
export class ImgEditPagePost {
  @ViewChild(Content) content: Content;
  public drawingEnabled: boolean = true;
  imgwidth:any;
  imgheight:any;
  selectedImage:string;
  callback: any;

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
  ) {
  }

  /**
   * Make sure you are calling create method inside of "ionViewDidLoad"
   */
  ionViewDidLoad() {

    this.selectedImage  = this.navParams.get('image');
		this.callback       = this.navParams.get("callback");

    // we are here taking full screen for drawing, change this logic if you need something else
    let dimensions = this.content.getContentDimensions();
    let width   = dimensions.contentWidth;
    let height  = dimensions.scrollHeight;

    if(this.platform.is('ios')) {
      height -= 44; // size of header
      height -= 44; // size of footer
    } else {
      height -= 56; // size of header
      height -= 56; // size of footer
    }
    this.imgheight = height;
    this.imgwidth = width;
    //console.log("Width: ",this,imgwidth);
    //console.log("Height: ",this,imgheight);
    this.drawing.create(width, height);
    
    this.drawingEnabled = false;
    var imageToView = localStorage.getItem('postimage');
    this.drawing.addImage(imageToView);

    this.drawingEnabled = true;
    this.drawing.enableDrawing();
  }

  /**
   * In this method you can do something with your drawing
   */
  save() {

    // drawing variable is base64 image
    localStorage.setItem('postimage', this.drawing.getAsImage()); 
    this.dismiss();
  }

  /**
   * Switch back to drawing
   */
  ok() {
    //this.drawing.addShape("cloud");
    this.drawingEnabled = true;
    this.drawing.enableDrawing();
  }

  /**
   * Displays list of colors
   * @param event
   */
  openColorsPopover(event) {
    let popover = this.popoverCtrl.create(ColorsPopoverPage);
    popover.present({
      ev: event
    });
  }

  /**
   * Displays list of brush widths
   * @param event
   */
  openWidthsPopover(event) {
    let popover = this.popoverCtrl.create(WidthPopoverPage);
    popover.present({
      ev: event
    });
  }

  /**
   * Displays list of brush types
   * @param event
   */
  openTypesPopover(event) {
    let popover = this.popoverCtrl.create(BrushTypePopoverPage);
    popover.present({
      ev: event
    });
  }

  /**
   * Adds text
   */
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
            //this.ok();
            //this.drawingEnabled = true;        
            //this.drawing.enableDrawing();
          }
        }
      ]
    });

    alert.present();
  }


  /**
   * Adds image to canvas
   */
  addImageURL() {
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
                  this.drawing.canvas.setActiveObject(this.drawing.canvas.item(0));
                  this.drawing.canvas.image.scaleToHeight(50);
                  this.drawing.canvas.image.scaleToWifth(50);
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



  /**
   * Adds image to canvas
   */
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

  /**
   * Adds background to canvas
   */
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

  /**
   * Undo last change
   */
  undo() {
    this.drawing.undo();
  }

  ionViewWillLeave() {
		this.callback(this.drawing.getAsImage()).then(()=>{});
  }
  
  dismiss() {
		this.viewCtrl.dismiss('') ;
	 } 
	 

  /**
   * Takes image from camera or photo gallery
   * @param from_camera
   */
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
