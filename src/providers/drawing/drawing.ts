import { Injectable } from '@angular/core';
declare let fabric;

@Injectable()
export class DrawingProvider {
  
  public canvas: any;
  public width: number;
  public height: number;
  public brushColor: string = '#ff0000';
  public brushWidth: number = 7;

  public brushColors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00'
  ];

  public brushWidths = [
    {value: 5, label: '5px'},
    {value: 6, label: '6px'},
    {value: 7, label: '7px'},
    {value: 8, label: '8px'},
    {value: 9, label: '9px'},
    {value: 10, label: '10px'},
    {value: 20, label: '20px'},
    {value: 30, label: '30px'},
    {value: 50, label: '50px'},
  ];

  public brushTypes = [
    {value: 'Pencil', label: 'Pencil'},
    {value: 'diamond', label: 'Diamond'},
  ];

  constructor() {
  }

  getAsImage() {
    return this.canvas.toDataURL();
  }

  disableDrawing() {
    this.canvas.isDrawingMode = false;
  }

  enableDrawing() {
    this.canvas.isDrawingMode = true;
  }

  create(width: number, height: number) {
    this.width  = width;
    this.height = height;

    // make sure "drawing-container" value matches your container for drawing
    this.canvas = new fabric.Canvas('drawing-container');

    // prevent drawing objects to be draggable or clickable
    this.canvas.selection = false;
    fabric.Object.prototype.selectable = false;

    // sets canvas height and width
    this.canvas.setHeight(this.height);
    this.canvas.setWidth(this.width);
    // sets canvas height and width
    // *** having both canvas.setHeight and canvas.width prevents errors when saving
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // set size and color of the drawing brush
    this.canvas.freeDrawingBrush.width = this.brushWidth;
    this.canvas.freeDrawingBrush.color = this.brushColor;

    // make sure drawing is enabled
    this.enableDrawing();
  }

  addShape(shapeName) {

    var SVG = SVG || {};

    fabric.loadSVGFromURL("cloud.svg", function(objects, options) {

      var obj = fabric.util.groupSVGElements(objects, options);

      SVG.testObject = obj;  

    });

    if(SVG.testObject) {
      var clone = fabric.util.object.clone(SVG.testObject);
       clone.set({
           left: 100,
           top: 100
       });

       this.canvas.add(clone);
       this.canvas.renderAll();

    }

  }
 
  changeBrushColor(color: string) {
    this.brushColor = color;
    this.canvas.freeDrawingBrush.color = this.brushColor;
  }

  changeBrushWidth(width: number) {
    this.brushWidth = width;
    this.canvas.freeDrawingBrush.width = this.brushWidth;
  }

  changeBrushType(type) {
    if (type === 'hline') {
      this.canvas.freeDrawingBrush = this.getHLinePatternBrush();
    } else if (type === 'vline') {
      this.canvas.freeDrawingBrush = this.getVLinePatternBrush();
    } else if (type === 'square') {
      this.canvas.freeDrawingBrush = this.getSquarePatternBrush();
    } else if (type === 'diamond') {
      this.canvas.freeDrawingBrush = this.getDiamondPatternBrush();
    } else if (type === 'texture') {
      this.canvas.freeDrawingBrush = this.getTexturePatternBrush();
    } else {
      this.canvas.freeDrawingBrush = new fabric[type + 'Brush'](this.canvas);
    }

    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = this.brushColor;
      this.canvas.freeDrawingBrush.width = this.brushWidth;
    }
  }

  addText(text: string) {
    this.disableDrawing();

    let t = new fabric.Text(text, {
      left: (this.width / 3),
      top: 100,
      fontFamily: 'Helvetica',
      fill: this.brushColor,
      selectable: true,

    });
    this.canvas.add(t);
  }


  addImage(imageSrc: string) {

    this.disableDrawing();

    let image = new Image();

    image.setAttribute('crossOrigin', 'anonymous');

    image.onload = () => {
      let imgInstance = new fabric.Image(image, {
        left: 0,
        top: 0,
        selectable: false,
        transparentCorners: false,
        scaleX: this.canvas.width / image.width,
        scaleY: this.canvas.width / (image.height * (image.width / image.height))
      });
      
      this.canvas.add(imgInstance);
      this.canvas.renderAll();
      this.canvas.setActiveObject(imgInstance);
    };
    image.src = imageSrc;

    // make sure the load event fires for cached images too
    if (image.complete || image.complete === undefined) {
      image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      image.src = imageSrc;
    }
  }

  /*addImageUrl(imageSrc: string) {
    this.disableDrawing();

    //var imageSrc = "https://go.projectvaultuk.com/PublicPics/11fea696-ad7c-4d48-ace1-20b0612a79b5/7bc6a3ae-ada5-4bb4-916f-8cae42fdd027/LocationImages/4e2ef81a-04bc-4781-bd11-1abcb8f260cd.jpg?time=-8586335582865684863";

    let image = new Image();

    fabric.Image.fromURL( imageSrc, 
      function (img) {
         this.canvas.add(img);
         this.canvas.renderAll();
         this.canvas.setActiveObject(imgInstance);
      },{ crossOrigin: 'anonymous', ... }
   );

    image.onload = () => {
      let imgInstance = new fabric.Image(image, {
        left: 0,
        top: 0,
        selectable: false,
        transparentCorners: false,
        scaleX: this.canvas.width / image.width,
        scaleY: this.canvas.width / (image.height * (image.width / image.height))
      });
      //this.canvas.add(imgInstance);
      //this.canvas.renderAll();
      //this.canvas.setActiveObject(imgInstance);
    };

    image.src = imageSrc;

    // make sure the load event fires for cached images too
    if (image.complete || image.complete === undefined) {
      image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      image.src = imageSrc;
    }
  }*/

  addBackgroundImage(imageSrc: string) {
    let image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');

    // we need to get real image size and make sure it fits on screen
    image.onload = () => {
      let width   = image.width;
      let height  = image.height;

      let scaleX;
      let scaleY;

      if (width > height) {
        scaleX = this.width / width;
        scaleY = this.height / (this.height * width / this.width);
      } else {
        scaleX = this.width / (this.width * height / this.height);
        scaleY = this.height / height;
      }

      let center = this.canvas.getCenter();
      this.canvas.setBackgroundImage(imageSrc, this.canvas.renderAll.bind(this.canvas), {
        scaleX: scaleX,
        scaleY: scaleY,
        crossOrigin: 'anonymous'
      });
      /*
      ,
        originX: 'center',
        originY: 'center',
        top: center.top,
        left: center.left,
      */
    };
    image.src = imageSrc;

    // make sure the load event fires for cached images too
    if (image.complete || image.complete === undefined) {
      image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      image.src = imageSrc;
    }
  }

  undo() {
    let canvas_objects = this.canvas._objects;
    let last = canvas_objects[canvas_objects.length - 1];
    this.canvas.remove(last);
    this.canvas.renderAll();
  }

  private getHLinePatternBrush() {
    let vLinePatternBrush = new fabric.PatternBrush(this.canvas);
    fabric.PatternBrush.color = this.brushColor;

    vLinePatternBrush.getPatternSrc = function() {
      let patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      let ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    return vLinePatternBrush;
  }

  private getVLinePatternBrush() {
    let hLinePatternBrush = new fabric.PatternBrush(this.canvas);
    fabric.PatternBrush.color = this.brushColor;

    hLinePatternBrush.getPatternSrc = function () {

      let patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      let ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    return hLinePatternBrush;
  }

  private getSquarePatternBrush() {
    let squarePatternBrush = new fabric.PatternBrush(this.canvas);
    fabric.PatternBrush.color = this.brushColor;

    squarePatternBrush.getPatternSrc = function() {
      let squareWidth = 10, squareDistance = 2;

      let patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      let ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    return squarePatternBrush;
  }

  private getDiamondPatternBrush() {
    let diamondPatternBrush = new fabric.PatternBrush(this.canvas);
    fabric.PatternBrush.color = this.brushColor;

    diamondPatternBrush.getPatternSrc = function() {
      let squareWidth = 10, squareDistance = 5;
      let patternCanvas = fabric.document.createElement('canvas');
      let rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      });

      let canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      let ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };

    return diamondPatternBrush;
  }

  private getTexturePatternBrush() {
    let img = new Image();
    img.src = '../assets/imgs/texture.png';

    let texturePatternBrush = new fabric.PatternBrush(this.canvas);
    texturePatternBrush.source = img;

    return texturePatternBrush;
  }
}
