import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, ViewController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { normalizeURL } from 'ionic-angular';
import { Http } from '@angular/http';
import { ImgEditPagePostPost } from '../imgeditpostpost/imgeditpostpost';
import { ImgViewPage } from '../imgview/imgview';

import * as Constants from '../../providers/constants';

declare var cordova: any;

@IonicPage()

@Component({
  selector: 'page-snagging52',
  templateUrl: 'snagging52.html',
})

export class Snagging52Page {

	public pid: string = "";
	public uid: string = "";
	public cid: string = "";
	public api: string = "";
	public snagid: string;

	public details: string;
	public approval:  any;
	public defect1s:  any;
	public defect1snotes:  any;
	public defect1snotesid:  any;	
	public ImgUrl:any;
	public postUrl: any;

	public thumbbase64:any;
	public hasNotes: any;
	public lastImage: string = null;
  	public loading: Loading;
	public currentImage: string;

	public postImage: string;
	public locationImg: any;
	public image: any;
	public updata: any;

	frmData = {details: ""};


	constructor(
		private navCtrl: NavController, 
		private navParams: NavParams,
		private camera: Camera,
		private transfer: FileTransfer,
		private file: File,
		private filePath: FilePath,
		private actionSheetCtrl: ActionSheetController, 
		private toastCtrl: ToastController, 
		private platform: Platform,
		public viewCtrl: ViewController,
		private loadingCtrl: LoadingController, 
		private http: Http, 
		private _sanitizer: DomSanitizer
	) 
	{this.currentImage = "data:image/jpeg;base64," +  "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";	}


	public ionViewWillEnter() {

		var snagData = JSON.parse(localStorage.getItem('userSystemData'));
				
		this.pid          = localStorage.getItem('CurrentProjectID');
		this.api          = snagData[0].apiKey;
		this.cid          = localStorage.getItem('CurrentProjectClientID');
		this.uid          = snagData[0].SystemUserID;
		this.snagid       = this.navParams.get('snagid');
		this.postImage    = null;

		//this.openlocimg();

		var url = Constants.apiUrl+"api/defects/"+this.api+"/"+this.pid+"/nosearch/"+this.snagid;

	      this.http.get(url).map(res => res.json()).subscribe(data => {
	        this._sanitizer.bypassSecurityTrustStyle(data);
			this.defect1s = data;         
			
			this.defect1snotesid = 	this.defect1s[0].OrderId;

			console.log("Hello Main Defects Details: ",this.defect1s);

			this.image   = Constants.publicUploadPath+this.cid+"/"+this.pid+"/LocationImages/"+this.defect1snotesid+".jpg";
			this.ImgUrl  = Constants.publicUploadPath+this.cid+"/"+this.pid+"/dfx/"+this.defect1snotesid+"/"+this.defect1snotesid+".jpg";
			this.postUrl = Constants.publicUploadPath+this.cid+"/"+this.pid+"/dfx/"+this.defect1snotesid+"/"+this.defect1snotesid+"post.jpg";
			
			localStorage.setItem('image', this.image);
			localStorage.setItem('preimage', this.ImgUrl);
			localStorage.setItem('postimage', this.postUrl);

			var urldefectsnotes = Constants.apiUrl+"api/defectsnotes/"+this.api+"/"+this.cid+"/"+this.defect1snotesid;

		    this.http.get(urldefectsnotes).map(res => res.json()).subscribe(data => {
		        this._sanitizer.bypassSecurityTrustStyle(data);
				this.defect1snotes = data;          
				console.log("Defect Notes: ",this.defect1snotes);
				if(this.defect1snotes.length > 0){
				if(this.defect1snotes[0].Note !== null){
					this.hasNotes = "hasNotes";
				} }									
		    }, err => {
		        console.log("Get Data Oops!");
		    }
			); 			

	    }, err => {console.log("Oops! - getting defect image");}
	  ); 
	}


	openlocimg(){

		var theLocation                     = localStorage.getItem('location');
		var locationmapImageData            = JSON.parse(localStorage.getItem('userSystemData'));
		var locationmapImageSystemProjectID = localStorage.getItem('CurrentProjectID');
		var locationmapImageApiKey          = locationmapImageData[0].apiKey;
		var locationmapImageUserID          = locationmapImageData[0].SystemUserID;

		var locurl = Constants.apiUrl+"api/locationmapimage/"+locationmapImageApiKey+"/"+locationmapImageSystemProjectID+"/"+locationmapImageUserID+"/"+theLocation;

		this.http.get(locurl).map(res => res.json()).subscribe(data => {
		    this._sanitizer.bypassSecurityTrustStyle(data);
			this.locationImg = data; 			

			console.log("Main Location Image: ",this.locationImg);

			if(this.locationImg["0"].locationimage !== null){
				console.log("Getting sanitized location image.");
				this.image = "data:image/jpeg;base64," +  this.hexToBase64(this.locationImg["0"].locationimage);	
				console.log("Storing sanitized image locally.");		
				localStorage.setItem('locationimage', this.image); 
			} else {
				console.log("Getting default location image.");
				this.image = "data:image/jpeg;base64," +  "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";	
				console.log("Storing default location image locally.");
				localStorage.setItem('locationimage', this.image); 
			}	
		    },
		    err => {
		        console.log("Oops! - Error getting location image");
		    }); 
	}


	hexToBase64(str) {
		return btoa(String.fromCharCode.apply(null,
			str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
		);
	}			  
	
	
	viewloc(){this.navCtrl.push(ImgViewPage,{imgtype:"location"});}

	viewpre(){this.navCtrl.push(ImgViewPage,{imgtype:"preimage"});}

	viewpost(){this.navCtrl.push(ImgViewPage,{imgtype:"postimage"});}


	presentActionSheet() {
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
					localStorage.setItem('postpostimage', image);
					this.currentImage = localStorage.getItem('postpostimage');
				}
			)
			.catch(() => {})
			;
		} else {
			console.log("In addimage");
			this.navCtrl.push(ImgEditPagePostPost, {callback:this.myCallbackFunction});
		}
	}


	myCallbackFunction = (_params) => {
		return new Promise((resolve, reject) => {
			this.currentImage = _params;
			resolve();	
		}); 	
		
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
			(image) => resolve( 'data:image/jpg;base64,' + image),
			() => reject()
		);
		});
	}

	sendUploadData(){

		var upurl = "https://pvmobile.online/iuploadnofile52.php";

		const formData = new FormData();
		
		formData.append('snagid', this.snagid);
		formData.append('orderid', this.defect1snotesid);
		formData.append('details', this.details);
		formData.append('approval', this.approval);
		formData.append('pid', this.pid);
		formData.append('uid', this.uid);
		formData.append('cid', this.cid);
		formData.append('api', this.api);	
		formData.append('postimg', this.currentImage);

	    this.http.post(upurl,formData).map(res => res.json()).subscribe(data => {
	        this.updata = data;
			console.log(data);
	    },err => {console.log("Oops!")}); 

		this.dismiss();

	}


	presentToast(text) {
		let toast = this.toastCtrl.create({
			message: text,
			duration: 3000,
			position: 'top'
		});
		toast.present();
	}
	

	dismiss() {
		this.viewCtrl.dismiss('') ;
	} 

			 
}






























































































































	/*
		takePicture(sourceType) {

			var options = {
				quality: 80,
				sourceType: sourceType,
				saveToPhotoAlbum: false,
				correctOrientation: true,
				allowEdit : true,
			};
			
			this.camera.getPicture(options).then((imagePath) => {

				if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {        
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
					var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
					var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
					var correctFilename = this.createFileName();
					this.currentImage = normalizeURL(correctPath + currentName);
					console.log(correctPath);
					console.log(currentName);
					console.log(correctFilename);	
					console.log(this.currentImage);
					this.copyFileToLocalDir(correctPath, currentName, correctFilename);  
					this.file.readAsDataURL(correctPath, currentName).then((imageDataUrl) => {
					this.currentImage = imageDataUrl;
					console.log(this.currentImage);
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
			console.log("in fun");
			console.log(namePath);
			console.log(currentName);
			console.log(newFileName);
			console.log(cordova.file.dataDirectory);
			this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
				this.lastImage = newFileName;
			}, error => {
				this.presentToast('Error while storing file.');
			});
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
			console.log("in post upload");
			// Destination URL
			var url = "https://pvmobile.online/iupload51.php";
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
					"pid": this.pid,
					"uid": this.uid,
					"cid": this.cid,
					"api": this.api,
					"son": this.snagid,
					"det": this.details
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
	*/
