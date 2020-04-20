import { Component, OnInit } from '@angular/core';

import { Platform, AlertController, ToastController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseProvider } from './services/database/database';
import { TransferComponent } from './transfer/transfer.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home-outline'
    },
    // {
    //   title: 'Historico',
    //   url: '/history',
    //   icon: 'bar-chart-outline'
    // }
  ];

  constructor(
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
    private databaseProvider: DatabaseProvider,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async restartValues() {

    const alert = await this.alertController.create({
      header: 'Reiniciar Valores',
      message: 'Deseja reiniciar valores?',
      buttons: [
        {
          text: 'Cancelar'
        }, {
          text: 'Confirmar',
          handler: () => {
            this.databaseProvider.resetValues().subscribe(
              (succ) => {
                this.presentToast('Valores reiniciados com sucesso.');
                setTimeout(() => {
                  document.location.reload(true);
                }, 2000);
              },
              (err) => {
                this.presentToast('Ocorreu um erro ao reinicia valores.');
              }
            )
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TransferComponent,
      componentProps: {
        idPlayer: '1',
     }
    });

    modal.onDidDismiss().then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    })
 
    return await modal.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 1700
    });
    toast.present();
  }
}
