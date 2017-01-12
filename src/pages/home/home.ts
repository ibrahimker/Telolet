import { Component, ChangeDetectorRef} from '@angular/core';

import { NavController, AlertController, Platform} from 'ionic-angular';

import {NativeAudio} from 'ionic-native';

// import { Platform } from 'ionic/ionic';

declare var SpeechRecognition: any;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	recognition: any;
	recorded: any;
	showBus:any;

	constructor(public navCtrl: NavController, public platform: Platform, private chRef: ChangeDetectorRef, public alertCtrl: AlertController) {
		this.platform = platform;
		this.alertCtrl = alertCtrl;
		this.chRef=chRef;

		this.recorded="";
		this.showBus=false;
	}

	SpeechToText() {
		this.recorded="";
		this.chRef.detectChanges();
		this.platform.ready().then((readySource) => {
			this.recognition = new SpeechRecognition(); 
			this.recognition.lang = 'id-ID';
			this.recognition.onnomatch = (event => {
				this.presentAlert('no match');
			});
			this.recognition.onerror = (event => {
				this.recorded="Error Happens, Please Try Again";
				this.chRef.detectChanges();
			});
			this.recognition.onresult = (event => {
				if (event.results.length > 0) {
					this.recorded="You say " + event.results[0][0].transcript;
					this.chRef.detectChanges();
					if(event.results[0][0].transcript.toLowerCase() == "om telolet om"){
						setTimeout(() => {
							NativeAudio.preloadSimple('uniqueId1', 'assets/sound/telolet.mp3').then(event => {
								NativeAudio.play('uniqueId1').then(event => {
									this.recorded="Enjoy your telolet";
									this.showBus=true;
									this.chRef.detectChanges();
								}, event => {
									console.log('fail play' + event)
								});  
							}, event => {
								NativeAudio.play('uniqueId1').then(event => {
									this.recorded="Enjoy your telolet";
									this.chRef.detectChanges();
								}, event => {
									console.log('fail play' + event)
								});
							});
							setTimeout(() => {
								this.recorded="";
								this.showBus=false;
								this.chRef.detectChanges();
							},3000);
						},1000);
					}
				}
			});     
			this.recognition.start();
		});
	}

	doPrompt(){
		this.presentAlert('om telolet om');
	}

	presentAlert(text) {
		let alert = this.alertCtrl.create({
			title: 'Alert',
			subTitle: text,
			buttons: ['Dismiss']
		});
		alert.present();
	}

}
