import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { QrcodePage } from '../qrcode/qrcode';
import { LocationmapPage } from '../locationmap/locationmap';
import { DisciplinePage } from '../discipline/discipline';
import { EffectsPage } from '../effects/effects';
import { ReasonsPage } from '../reasons/reasons';
import { SubtypesPage } from '../subtypes/subtypes';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { normalizeURL } from 'ionic-angular';

declare var cordova: any;

@IonicPage()

@Component({
  selector: 'page-snagging',
  templateUrl: 'snagging.html',
})

export class SnaggingPage {

	public name: string = "";
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
	public currentImage: string;

	public snagid: string;

	frmData = {reference:"", details: ""};

  constructor(
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
	public loadingCtrl: LoadingController
	) {}


	ionViewWillEnter() {

		this.currentImage = null;

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

  	public takePicture(sourceType) {

		console.log("in takePicture");

		var options = {
			quality: 80,
			sourceType: sourceType,
			saveToPhotoAlbum: false,
			correctOrientation: true,
			allowEdit : true,
		};
		
		this.camera.getPicture(options).then((imagePath) => {

			console.log("in getPicture"); 

			if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) { 
				console.log("in using library");       
				this.filePath.resolveNativePath(imagePath)
					.then(filePath => {
						let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
						let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
						var correctFilename = this.createFileName();
						this.currentImage = normalizeURL(correctPath + currentName);
						this.copyFileToLocalDir(correctPath, currentName, correctFilename);
						this.file.readAsDataURL(correctPath, currentName).then((imageDataUrl) => {
							this.currentImage = imageDataUrl;
						})
					});
			} else {
				console.log("in using camera");
				var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
				var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
				var correctFilename = this.createFileName();
				this.currentImage = normalizeURL(correctPath + currentName);
				console.log("correctPath: ",correctPath);
				console.log("currentName: ",currentName);
				console.log("correctFilename: ",correctFilename);	
				console.log("this.currentImage: ",this.currentImage);
				this.copyFileToLocalDir(correctPath, currentName, correctFilename);  
				console.log("doing readAsDataURL");
				this.file.readAsDataURL(correctPath, currentName).then((imageDataUrl) => {
				this.currentImage = imageDataUrl;
				console.log("this.currentImage: ",this.currentImage);
				})
			}
		}, (err) => {
			this.presentToast('Error while selecting image.');
		});
	}  

	private createFileName() {
		var d = new Date(),
		n = d.getTime(),
		newFileName =  n + ".jpg";
		return newFileName;
	}  

	private copyFileToLocalDir(namePath, currentName, newFileName) {
		console.log("in copyFileToLocalDir");
		console.log("namePath: ",namePath);
		console.log("currentName: ",currentName);
		console.log("newFileName: ",newFileName);
		console.log("cordova.file.dataDirectory: ",cordova.file.dataDirectory);
		this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
			this.lastImage = newFileName;
			console.log("this.lastImage: ",this.lastImage);
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

	public uploadImage() {
		console.log("in pre upload");
		// Destination URL
		var url = "https://pvmobile.online/iupload.php";
		console.log(url);
	
		// File for Upload
		var targetPath = this.pathForImage(this.lastImage);
	
		// File name only
		var filename = this.lastImage;
	
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
				"defecttype": this.defecttype
			}
		};

		console.log(options);
	
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

	ionViewDidLoad() {
	console.log('ionViewDidLoad SnaggingPage');	
	}

	ionSelected() {
	  console.log("Page has been selected");
	}

	openGetQRCode(){
		this.navCtrl.push(QrcodePage, {callback:this.myCallbackFunction1});
	}

	openList(){		
		this.navCtrl.push(LocationmapPage, {callback:this.myCallbackFunction1});
	}

	openDList(selecteddefect){		
		console.log(selecteddefect);
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
	     console.log(this.name);
	 });
	}

	myCallbackFunction2 = (_params) => {
	 return new Promise((resolve, reject) => {
	     this.discipline = _params;
	     resolve();
	     console.log(this.discipline);
	 });
	}

	myCallbackFunction3 = (_params) => {
		return new Promise((resolve, reject) => {
				this.reason = _params;
				resolve();
				console.log(this.reason);
		});
	 }

	 myCallbackFunction4 = (_params) => {
		return new Promise((resolve, reject) => {
				this.effect = _params;
				resolve();
				console.log(this.effect);
		});
	 }

	 myCallbackFunction5 = (_params) => {
		return new Promise((resolve, reject) => {
				this.defecttype = _params;
				resolve();
				console.log(this.defecttype);
		});
	 }

	 dismiss() {
		this.viewCtrl.dismiss('') ;
	 } 

	 
}
