import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransferComponent } from '../transfer/transfer.component';
import { DatabaseProvider } from '../services/database/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  {

  players = [];

  constructor(
    public modalController: ModalController,
    private databaseProvider: DatabaseProvider) {

      this.buscarPlayers();
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

  async presentModal(idPlayer?) {
    const modal = await this.modalController.create({
      component: TransferComponent,
      componentProps: {
        idPlayer: idPlayer ? idPlayer : '1',
     }
    });

    modal.onDidDismiss().then(() => {
      this.buscarPlayers();
    })
 
    return await modal.present();
  }

  doRefresh(event) {

    setTimeout(() => {
      this.buscarPlayers();
      event.target.complete();
    }, 500);
  }

  buscarPlayers() {
    this.databaseProvider.getPlayers().subscribe(players => {
      this.players = players;
    });
  }

}
