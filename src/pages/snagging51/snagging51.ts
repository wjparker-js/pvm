import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { normalizeURL } from 'ionic-angular';
import * as Constants from '../../providers/constants';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

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
	
	public ImgUrl:any;
	public thumbbase64:any;

	private lastImage: string = null;
  private loading: Loading;
	private currentImage: string;
	private postImage: string;


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
        private loadingCtrl: LoadingController, 
        private http: Http, 
        private _sanitizer: DomSanitizer
		) {}

      ionViewWillEnter() {

				this.currentImage = null;
				this.postImage    = null;

        var snagData = JSON.parse(localStorage.getItem('userSystemData'));

        this.pid     = localStorage.getItem('CurrentProjectID');
        this.api     = snagData[0].apiKey;
				this.cid     = localStorage.getItem('CurrentProjectClientID');
        this.uid     = snagData[0].SystemUserID;		
        this.snagid  = this.navParams.get('snagid');

        console.log("Snag ID:",this.snagid);

        var url = Constants.apiUrl+"api/defects/"+this.api+"/"+this.pid+"/"+this.snagid;

        this.http.get(url).map(res => res.json()).subscribe(data => {
              this._sanitizer.bypassSecurityTrustStyle(data);
              this.defect1s = data;          
							console.log(this.defect1s);
							if(this.defect1s[0].thumbbase64 !== null || this.defect1s[0].thumbbase64 !== ""){
								this.ImgUrl = this._sanitizer.bypassSecurityTrustUrl("data:Image/*;base64,"+this.defect1s[0].thumbbase64);
							} else {
								this.ImgUrl = null;
							}							
          },
          err => {
              console.log("Get Data Oops!");
          }
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
					saveToPhotoAlbum: true,
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
				var url = "http://79.174.171.22/iupload51.php";
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
		
}