import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as Constants from '../../providers/constants';
import { IonicPage, NavController, ViewController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { normalizeURL } from 'ionic-angular';
import { Http } from '@angular/http';

import { ImgViewPage } from '../imgview/imgview';

declare var cordova: any;

@IonicPage()

@Component({
  selector: 'page-snagging51',
  templateUrl: 'snagging51.html',
})

export class Snagging51Page {

	private pid: string = "";
	private uid: string = "";
	private cid: string = "";
	private api: string = "";
	private snagid: string;
	private details: string;
	private defect1s:  any;
	private defect1snotes:  any;
	private defect1snotesid:  any;
	
	public ImgUrl:any;
	public thumbbase64:any;
	public hasNotes: any;

	private lastImage: string = null;
  	private loading: Loading;
	private currentImage: string;
	private postImage: string;
	private locationImg: any;
	private image: any;


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
	) {}



	ionViewWillEnter() {

	var snagData = JSON.parse(localStorage.getItem('userSystemData'));
			
	this.pid          = localStorage.getItem('CurrentProjectID');
	this.api          = snagData[0].apiKey;
	this.cid          = localStorage.getItem('CurrentProjectClientID');
	this.uid          = snagData[0].SystemUserID;		
	this.snagid       = this.navParams.get('snagid');
	this.currentImage = null;
	this.postImage    = null;
	
	this.openlocimg();

	var url = Constants.apiUrl+"api/defects/"+this.api+"/"+this.pid+"/nosearch/"+this.snagid;

    this.http.get(url).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
		this.defect1s = data;          

		console.log("Main Defects Details: ",this.defect1s);

		if(this.defect1s[0].thumbbase64 !== null || this.defect1s[0].thumbbase64 !== ""){
			console.log("TB64 getting sanitized ImgUrl.");
			this.ImgUrl = "data:image/jpeg;base64," + this.defect1s[0].thumbbase64;
			console.log("Storing ImgUrl locally.");
			localStorage.setItem('preimage', this.ImgUrl);
		} else {
			console.log("No TB64 so default ImgUrl.");
			this.ImgUrl = "data:image/jpeg;base64," +  "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";	
			localStorage.setItem('preimage', this.ImgUrl); 
		}						



		this.defect1snotesid = 	this.defect1s[0].OrderId;

		console.log("Main Defects Notes: ",this.defect1snotesid);

	    }, err => {console.log("Oops! - getting defect image");}
	); 


	var urldefectsnotes = Constants.apiUrl+"api/defectsnotes/"+this.api+"/"+this.cid+"/"+this.defect1snotesid;

    this.http.get(urldefectsnotes).map(res => res.json()).subscribe(data => {
        this._sanitizer.bypassSecurityTrustStyle(data);
		this.defect1snotes = data;          
		console.log(this.defect1snotes);
		if(this.defect1snotes[0].Note !== null){
			this.hasNotes = "hasNotes";
		} 									
    },
    err => {
        console.log("Get Data Oops!");
    }
	); 

	}

	  viewloc(){
		this.navCtrl.push(ImgViewPage,{imgtype:"location"});	
	  }

	  viewpre(){
		this.navCtrl.push(ImgViewPage,{imgtype:"preimage"});	
	  }

	  public openlocimg(){
		//console.log("openloc fired");
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
		
			dismiss() {
				this.viewCtrl.dismiss('') ;
			 } 



			 
		}