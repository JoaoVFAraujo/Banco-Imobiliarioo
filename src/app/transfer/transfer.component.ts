import { Component } from '@angular/core';
import { ModalController, AlertController, ToastController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseProvider } from '../services/database/database';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent {

  players = [];
  playersFor = [];
  formPlayer: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private databaseProvider: DatabaseProvider) {

      const idPlayer: string = this.navParams.get('idPlayer');

      this.buscarAllPlayer(idPlayer);

      this.formPlayer = this.fb.group({
        input_de: [1, Validators.required],
        input_para: ['', Validators.required],
        input_valor: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(2)]]
      });

      this.arrayPlayerFor();
  }

  submit(value) {
    const indexUserIn = this.players.findIndex(index => index.ID == value.input_de);
    if (this.players[indexUserIn].VALOR >= +value.input_valor.replace(".", "")) {
      this.transferMoney(value);
    } else {
      this.presentToast('Não pode realizar transição, Negativirá !', 2500);
    }
  }

  async transferMoney(value) {
    const index1 = this.players.findIndex(index => index.ID == value.input_de);
    const index2 = this.players.findIndex(index => index.ID == value.input_para);

    const alert = await this.alertController.create({
      header: 'Transferência',
      message: `${this.players[index1].NOME} você deseja transferir R$ ${value.input_valor} para ${this.players[index2].NOME} ?`,
      buttons: [
        {
          text: 'Cancelar'
        }, {
          text: 'Confirmar',
          handler: () => {
            this.databaseProvider.transferMoney(value).subscribe(
              (succ) => {
                this.presentToast(succ.message, 2000);
                this.modalCtrl.dismiss();
              },
              (err) => {
                this.presentToast(err.message, 2000);
              }
            )
          }
        }
      ]
    });

    await alert.present();
  }

  arrayPlayerFor() {
    this.formPlayer.get('input_de').valueChanges.subscribe(v => {
      this.formPlayer.get('input_para').setValue('');
      const index = this.players.findIndex(elem => elem.ID == v);
      this.playersFor = this.players.slice(0, index).concat(this.players.slice(index + 1, this.players.length));
    });
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: duration ? duration : 1700
    });
    toast.present();
  }

  convertMoney(money: string) {
    if (money.length <= 3) {
      return `R$ ${money.substring(0, 3)}`;
    } else if (money.length <= 4) {
      return `R$ ${money.substring(0, 1)}.${money.substring(1, 4)}`;
    } else if (money.length <= 5) {
      return `R$ ${money.substring(0, 2)}.${money.substring(2, 5)}`;
    } else if (money.length <= 6) {
      return `R$ ${money.substring(0, 3)}.${money.substring(3, 6)}`;
    } else if (money.length <= 7) {
      return `R$ ${money.substring(0, 1)}.${money.substring(1, 4)}.${money.substring(4, 7)}`;
    } else if (money.length <= 8) {
      return `R$ ${money.substring(0, 2)}.${money.substring(2, 5)}.${money.substring(5, 8)}`;
    } else if (money.length <= 9) {
      return `R$ ${money.substring(0, 3)}.${money.substring(3, 6)}.${money.substring(6, 9)}`;
    } else if (money.length <= 10) {
      return `R$ ${money.substring(0, 1)}.${money.substring(1, 4)}.${money.substring(4, 7)}.${money.substring(7, 10)}`;
    } else {
      return `R$ ${money}`;
    }
  }

  buscarAllPlayer(idPlayer) {
    this.databaseProvider.getAllPlayers().subscribe(allPlayers => {
      this.players = allPlayers;
      setTimeout(() => {
        this.formPlayer.get('input_de').setValue(idPlayer);
      }, 100);
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
