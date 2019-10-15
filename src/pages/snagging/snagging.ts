import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Constants from '../../providers/constants';
import { IonicPage, NavController, AlertController, NavParams, ViewController, ActionSheetController, ToastController, Platform, LoadingController, Loading, Img } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { normalizeURL } from 'ionic-angular';
import { Http } from '@angular/http';

import { ImgEditPage } from '../imgedit/imgedit';
import { ImgEditPagePre } from '../imgeditpre/imgeditpre';
import { LocationmapPage } from '../locationmap/locationmap';
import { DisciplinePage } from '../discipline/discipline';
import { EffectsPage } from '../effects/effects';
import { ReasonsPage } from '../reasons/reasons';
import { SubtypesPage } from '../subtypes/subtypes';
import { QrcodePage } from '../qrcode/qrcode';


declare var cordova: any;

@IonicPage()

@Component({
  selector: 'page-snagging',
  templateUrl: 'snagging.html',
})

export class SnaggingPage {

	public name: string = "";
	public updata: string = null;
	public image: string = null;
	public currentImage:  string = null ;
	public locationImg:  string = null;
	public discipline: string = "";
	public reason: string = "";
	public effect: string = "";
	public defecttype: string = "";
	public pid: string = "";
	public uid: string = "";
	public cid: string = "";
	public api: string = "";
	public lastImage: string = null;
    public loading: Loading;
	public imageUrl: any;
	public snagid: string;

	frmData = {reference:"", details: ""};

  	constructor(
		public alertCtrl: AlertController,
		public navCtrl: NavController, 
		public navParams: NavParams,
		public camera: Camera,
		public transfer: FileTransfer,
		public file: File,
		public filePath: FilePath,
		public actionSheetCtrl: ActionSheetController, 
		public toastCtrl: ToastController, 
		public platform: Platform,
		public viewCtrl: ViewController,
		private _sanitizer: DomSanitizer, 
		public loadingCtrl: LoadingController,
		public http: Http
	) {this.currentImage = null;}


	ionViewWillEnter() {	

		var snagData = JSON.parse(localStorage.getItem('userSystemData'));

		this.pid     = localStorage.getItem('CurrentProjectID');
    	this.api     = snagData[0].apiKey;
    	this.cid     = localStorage.getItem('CurrentProjectClientID');
		this.uid     = snagData[0].SystemUserID;		
		this.snagid  = this.navParams.get('snagid');

	}

	public presentActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Select Image Source',
			buttons: [
				{
					text: 'Load from Library',
					handler: () => {
						this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
					}
				},
				{
					text: 'Use Camera',
					handler: () => {
						this.takePicture(this.camera.PictureSourceType.CAMERA);
					}
				},
				{
					text: 'Cancel',
					role: 'cancel'
				}
			]
		});
		actionSheet.present();
	}

	private addimage(action){
		if(action === "add"){
			this.takePicture(true)
			.then(
				(image: string) => {
					localStorage.setItem('preimage', image);
					this.currentImage = localStorage.getItem('preimage');
				}
			)
			.catch(() => {})
			;
		} else {
			this.navCtrl.push(ImgEditPagePre, {callback:this.myCallbackFunction8});
		}
	}


	private takePicture(from_camera) {

		return new Promise((resolve, reject) => {

		let options = {
			quality           : 50,
			allowEdit         : true,
			saveToPhotoAlbum  : true,
			cameraDirection   : 0,
			correctOrientation: true,
			targetWidth       : 800,
			targetHeight      : 1200,
			sourceType        : from_camera ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
			destinationType   : this.camera.DestinationType.DATA_URL,
			encodingType      : this.camera.EncodingType.JPEG
		};

		this.camera.getPicture(options).then(
			(image) => resolve( 'data:image/png;base64,' + image),
			() => reject()
		);
		});
	}


	private createFileName() {
		var d = new Date(),
		n = d.getTime(),
		newFileName =  n + ".jpg";
		return newFileName;
	}  

	private copyFileToLocalDir(namePath, currentName, newFileName) {
		console.log("cordova.file.dataDirectory: ",cordova.file.dataDirectory);
		this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
			this.lastImage = newFileName;
		}, error => {
			this.presentToast('Error while storing file.');
		});
	}
	
	private presentToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}
	
	public pathForImage(img) {
		if (img === null) {
			return '';
		} else {
			console.log(cordova.file.dataDirectory + img);
			return cordova.file.dataDirectory + img;
		}
	}

	public sendUploadData(){

		var upurl = "https://pvmobile.online/iuploadnofile.php";

		//var headers = {'Content-Type' : 'multipart/form-data'};

		const formData = new FormData();
		
        formData.append('limg', this.image);
		formData.append('pimg', this.currentImage);
		formData.append('reference', this.frmData.reference);
		formData.append('location', this.name);
		formData.append('discipline', this.discipline);
		formData.append('details', this.frmData.details);
		formData.append('pid', this.pid);
		formData.append('uid', this.uid);
		formData.append('cid', this.cid);
		formData.append('api', this.api);
		formData.append('effect', this.effect);
		formData.append('reason', this.reason);
		formData.append('defecttype', this.defecttype);		

	    this.http.post(upurl,formData).map(res => res.json()).subscribe(data => {
	        this.updata = data;
			console.log(data);
	    },err => {console.log("Oops!")}); 

	this.dismiss();

	}
/*
	public uploadImage() {
		// Destination URL
		//var url = "https://pvmobile.online/iupload.php";
		var url = "https://pvmobile.online/iuploadnofile.php";
	
		// File for Upload
		var targetPath = this.pathForImage(this.lastImage);
	
		// File name only
		var filename = ""; //this.lastImage;
	
		var options = {
			fileKey: "file",
			fileName: filename,
			chunkedMode: false,
			mimeType: "multipart/form-data",
			params : {
				"reference": this.frmData.reference,
				"location": this.name,
				"discipline": this.discipline,
				"details": this.frmData.details,
				"pid": this.pid,
				"uid": this.uid,
				"cid": this.cid,
				"api": this.api,
				"effect": this.effect,
				"reason": this.reason,
				"defecttype": this.defecttype,
				//"limg": this.image,
				//"pimg": this.currentImage
			}
		};
	
		const fileTransfer: FileTransferObject = this.transfer.create();
	
		this.loading = this.loadingCtrl.create({
			content: 'Uploading...',
		});
		
		this.loading.present();
	
		// Use the FileTransfer to upload the image
		fileTransfer.upload(targetPath, url, options).then(data => {
			this.loading.dismissAll()
			this.presentToast('Image succesful uploaded.');
		}, err => {
			this.loading.dismissAll()
			this.presentToast('Error while uploading file.');
		});
	}

*/
	public openlocimg(){

		var theLocation                     = localStorage.getItem('location');
		var locationmapImageData            = JSON.parse(localStorage.getItem('userSystemData'));
		var locationmapImageSystemProjectID = localStorage.getItem('CurrentProjectID');
		var locationmapImageApiKey          = locationmapImageData[0].apiKey;
		var locationmapImageUserID          = locationmapImageData[0].SystemUserID;

		var url = Constants.apiUrl+"api/locationmapimage/"+locationmapImageApiKey+"/"+locationmapImageSystemProjectID+"/"+locationmapImageUserID+"/"+theLocation;

		this.http.get(url).map(res => res.json()).subscribe(data => {
		    this._sanitizer.bypassSecurityTrustStyle(data);
			this.locationImg = data; 
			
			if(this.locationImg["0"].locationimage !== null){
				this.image = "data:image/jpeg;base64," +  this.hexToBase64(this.locationImg["0"].locationimage);			
				localStorage.setItem('locationimage', this.image); 
			} else {
				this.image = "data:image/jpeg;base64," +  "iVBORw0KGgoAAAANSUhEUgAAAMYAAABiCAIAAACEdDvyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAbNSURBVHhe7Z3pleowDIVfXRQ09VANzVDMPMWWNy2JwxHEw7nfL5BlSZZvwMM2/34BCAWSAsFAUiAYSAoEA0mBYCApEAwkBYKBpEAwkBQIBpICwUBSIBhICgQDSYFgICkQDCQFgoGkQDCQFAjmKyX1fNx/fn7uT74LPsqspB4//4jbn9im5/22FXtBtX+pS2/jD0uKlfPz4PuVZylWjbwbSIr4RkldByRFQFKRQFJErKS2c/EtH2Q2bref+8Oc8aQnJ9+RRoc423gfpxyWBLU6r9iZ8vLcpNOtxuRIkKv0NLAS9wEp/XaH6FfU5RELLRw1pDK2tUM2IwXkMT/cSwRKqt+ADb69tVMspymid+TgvV764S55alw3wNQ8ZrGT5bEC7qWK0ZOdPHYkZQUkx7razizSTDQkkzNtTvT3bietbc5wRdRWJMfqKeO9SJSkyroHudfLr59XPIed3Dy5kzQuL5o2hQ0Jthr7rIudL6/sC9HM5CksNlaXuoA1eYmXqf52msmG8NzeZHaoze0isvFofVMEScrsxYZavLHyCaz0ZsMSynu+vOI6dny251aZLSAbEiWxvaaDNITKlGeKiYaRy1Fds0p/jRhJeXUSokk7nntwlGGaZcvIYufL8xfq2QcsJ2firvm4P2rx2SDiaaPbNHfgNCGS4nLs0aFJu54jdCSlI2QhTRsX7DdBFDtfXr2vfXcbULCcnImOeWdnDxpiBMymIRib8iFqIJ+oDhY4w/slNTRp17NQzziKodN+90Wx8+UR3kJ3G1CwnJyJjtlc1FxDeCoFHY7nQ4rq42F08yzrPUqxP/n0J2mj05YtI4qdL6/e176efcByciY6ZmNR2XPz3W1IcqO/7Jr6tr/zxhOhmzaS5c5SdiJLPpYtI2PMl+fl9+0DlpMz0TE7UlGO0i/fPyiPyNHMVkQRIym/UrllfF97Pu/pipL+jOzghuNKqGKny/MXetCAjOXkTHTMaqGTDSn39+sjcl6jFWEESapUSh79o3Ox9gtotuqYzwo5eF1yFya3K1nZlKiufL+SB/piS9LZ8vRCPfuA5eRMdMxKUux42BB269he4TSe+8rkoRVEej094p32c5KyKKtq68yr4ZtmN+tg51jcapz+lMleQj2tqBSmJrK2a7Y8a+6GZx+wnJyJjpnL7Bc625D6wm0m3WbGvslWdL6iwS8RJylCvHO39UBcIoXBUbkZozm/WnF+fMu0S8zbrpnynLmufcByciZ6NWpJERMNyRNlPHroyfNk59TbncZR/kVmJQXWRiqs4Wj3fUBSX4GvG/th751AUl8BC0c/j2atfVJRkNS3wNoh6FiUKUclOnux00eApL4H+Tm9dOh+PD92iGIgKRAMJAWCgaRAMJAUCAaSAsFAUiAYSAoEA0mBYCApEAwkBYKBpP4cH/+0ykk+Lan67qbzmdTP9au9zypZd7cSkNRIv5HhHxg79dkgSOpNXCkpqy2fltTi8rGApEZyP+pP46jdh6QOgaRGWFIPvqH23+uX+vj9+Ol7FpNkr+/TO3OQOuEF0/ZsSasevovhfAMvJWcf/imj6cIv4hpJpX7km6I3Zr/61ovvCLFf+gpJG0hehPENmMrczhynTnjBtD1b5n4SrbtQmht/WvOo8Ou4UFK1Y30n9R4Ur0Ef9QIfOhv9xDef2gum7dmSaObyEfEhQM3eubGJ0LlW4UpJtf42Eag9sJqdMAQZLKkTqb1g2s5Bae7gyyE7T3aUi9FCW41rJVUbVw3OuKUSvQsvSIrmS8pmn0ktyy5o+6ynvxYvwipcLal61XHvxLiWTUf27br+kqQUnOxUarUsRttnPT2/vZE1uFxSxcT7I8Z391Up6AVJ+TtzKrUXTNtnPf3y/JE1WEBSxZisYnx3X3naFZKSqb1g2j7r6fntjazBEpIq20dbZHfWVIne81BJnUrtBdP2WU8/uxdhFdaQVNuk/PJLN+62VivKMvkc78yJ1GwRrmwdknhpld3JbsVci1UkVVuY0Huw2cYXh7J17LizDSZ+JZUTqZuRPb3XkLy02q5CbqnNmGuxjqTq9UeM491A+pOfb1phyjYkRycPs1NJYz51X33xu/GL5L2zl9ayt9Xsx1yLhSS1bQtfheph5tyPobETpdl5uJqSFPHa77DxG4FZaH2SM5Iiuv9k5Mdci09LCnw9kBQIBpICwUBSIBhICgQDSYFgICkQDCQFgoGkQDCQFAgGkgLBQFIgGEgKBANJgWAgKRAMJAWCgaRAMJAUCAaSAsFAUiAYSAoEA0mBYCApEAwkBYKBpEAwkBQIBpICwUBSIBhICgQDSYFQfn//A0vimayUJFIvAAAAAElFTkSuQmCC";	
				localStorage.setItem('locationimage', this.image); 
			}	
		    },
		    err => {
		        console.log("Oops!");
		    }); 
	}

	hexToBase64(str) {
		return btoa(String.fromCharCode.apply(null,
			str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
		);
	}

	editloc(){
		this.navCtrl.push(ImgEditPage, {callback:this.myCallbackFunction6});	
	}

	takepre(){
		localStorage.setItem('preimage', '');
		this.navCtrl.push(ImgEditPagePre, {callback:this.myCallbackFunction7});	
	}

	editpre(){
		this.navCtrl.push(ImgEditPagePre, {callback:this.myCallbackFunction8});	
	}

	ionViewDidLoad() {
	}

	ionSelected() {;
	}

	openGetQRCode(){
		this.navCtrl.push(QrcodePage, {callback:this.myCallbackFunction1});
	}

	openList(){		
		this.navCtrl.push(LocationmapPage, {callback:this.myCallbackFunction1});
	}

	openDList(selecteddefect){		
		this.navCtrl.push(DisciplinePage, {selecteddefect,callback:this.myCallbackFunction2});
	}

	openRList(){		
		this.navCtrl.push(ReasonsPage, {callback:this.myCallbackFunction3});
	}

	openEList(){		
		this.navCtrl.push(EffectsPage, {callback:this.myCallbackFunction4});
	}

	openDTList(){		
		this.navCtrl.push(SubtypesPage, {callback:this.myCallbackFunction5});
	}


	myCallbackFunction1 = (_params) => {
	 return new Promise((resolve, reject) => {
		 this.name = _params;		 
	     resolve();
	 });
	}

	myCallbackFunction2 = (_params) => {
	 return new Promise((resolve, reject) => {
	     this.discipline = _params;
	     resolve();
	 });
	}

	myCallbackFunction3 = (_params) => {
		return new Promise((resolve, reject) => {
				this.reason = _params;
				resolve();
		});
	 }

	 myCallbackFunction4 = (_params) => {
		return new Promise((resolve, reject) => {
				this.effect = _params;
				resolve();
		});
	 }

	 myCallbackFunction5 = (_params) => {
		return new Promise((resolve, reject) => {
				this.defecttype = _params;
				resolve();
		});
	 }

	 myCallbackFunction6 = (_params) => {
		return new Promise((resolve, reject) => {
			this.image = _params;
			resolve();
			//this.image = localStorage.getItem('locationimage');
			console.log("In 6");
		}); 
	 }

	 myCallbackFunction7 = (_params) => {
		return new Promise((resolve, reject) => {	
			resolve();			
		});		
	 }

	 myCallbackFunction8 = (_params) => {
		return new Promise((resolve, reject) => {
			//this.image = _params;
			this.currentImage = _params;
			resolve();
			console.log("In 8");	
			console.log(this.currentImage);		
		}); 	
		
	 }

	 dismiss() {
		this.viewCtrl.dismiss('') ;
	 } 
	 
}
