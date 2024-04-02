import { Component, Host, State, h } from '@stencil/core';

@Component({
  tag: 'ambulance-app',
  styleUrl: 'ambulance-app.css',
  shadow: true,
})
export class AmbulanceApp {
  @State() orders: any[] = [];

  async componentWillLoad() {
    this.orders = await this.getPacientOrders();
  }

  private async getPacientOrders() {
    return await Promise.resolve([
      {
        name: 'František Buksanto',
        orderId: 'RE560FNZJ',
        dietaryRequirements: 'bezlepková',
        medicalNeed: 'celiakia',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        estimatedServiceTime: new Date(Date.now() + 65 * 60 * 1000).toISOString(),
      },
      {
        name: 'Bc. August Cézar',
        orderId: 'XT720GHIK',
        dietaryRequirements: 'nízkosodíková',
        medicalNeed: 'hypertenzia',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        estimatedServiceTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
      {
        name: 'Ing. Ferdinand Trety',
        orderId: 'QD330YUKI',
        dietaryRequirements: 'mäsová s obmedzeným obsahom soli',
        medicalNeed: 'Bolesti hrdla',
        timestamp: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
        estimatedServiceTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      }
    ]);
  }

  render() {
    return (
      <Host>
      <div class="container">
        <md-list class="centered-list">
          {this.orders.map((patient) => (
            <md-list-item>
              <md-icon slot="start">person</md-icon>
              <div slot="headline" class="patient-name">{patient.name}</div>
              <div slot="supporting-text">
                <div class="patient-order-info">Objednávka: {patient.orderId}</div>
                <div class="dietary-requirements">Stravovacie požiadavky: {patient.dietaryRequirements}</div>
                <div class="medical-need">Medicínska potreba: {patient.medicalNeed}</div>
                <div class="timestamp">Čas záznamu: {new Date(patient.timestamp).toLocaleString()}</div>
                <div class="estimated-service-time">Predpokladaný čas služby: {new Date(patient.estimatedServiceTime).toLocaleString()}</div>
                <md-filled-tonal-button id="delete"
                   onClick={() => this.cancelOrder(patient.orderId)} >
                  <md-icon slot="icon">delete</md-icon>
                  Zmazať
                </md-filled-tonal-button>
              </div> 
            </md-list-item>
          ))}
        </md-list>
        <md-filled-icon-button class="add-button"
          onClick={() => this.addNewOrder()}>
          <md-icon>add</md-icon>
         </md-filled-icon-button>
      </div>
    </Host>
    );
  }

  cancelOrder(orderId: string) {
    this.orders = this.orders.filter(order => order.orderId !== orderId);
  }

  addNewOrder() {
    console.log("not implemented yet");
  }

}
