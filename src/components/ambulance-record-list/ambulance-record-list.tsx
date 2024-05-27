import { Component, Host, State, Event, EventEmitter, Prop, h } from '@stencil/core';
import { MealOrdersApiFactory, MealOrder } from '../../api/ambulance-project';

@Component({
  tag: 'ambulance-record-list',
  styleUrl: 'ambulance-record-list.css',
  shadow: true,
})
export class AmbulanceRecordList {
  @State() orders: any[] = [];
  @State() selectedOrder: any = null;
  @Event({ eventName: "entry-clicked" }) entryClicked: EventEmitter<string>;
  @State() errorMessage: string;
  @Prop() apiBase: string;
  @Prop() ambulanceId: string;

  async componentWillLoad() {
    this.orders = await this.getPacientOrders();
  }

  private async getPacientOrders(): Promise<MealOrder[]> {
    try {
      const response = await
        MealOrdersApiFactory(undefined, this.apiBase).
          getMealOrders(this.ambulanceId)
      if (response.status < 299) {
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve patient meal orders: ${response.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve patient meal orders: ${err.message || "unknown"}`
    }
    return [];
  }

  render() {
    return (
      <Host>
        <div class="container">
          <div class="centered-list">
            <h2>Zoznam objednávok</h2>
            {this.errorMessage
            ? <div class="error">{this.errorMessage}</div>
            :
            <md-list>
              {this.orders.map((patient) => (
                <md-list-item onClick={() => this.entryClicked.emit(patient.id)}>
                  <md-icon slot="start">person</md-icon>
                  <div slot="headline" class="patient-name">{patient.name}</div>
                  <div slot="supporting-text">
                    <div class="patient-order-info">Číslo objednávky: {patient.id}</div>
                    <div class="dietary-requirements">Stravovacie požiadavky: {patient.dietaryReq}</div>
                    <div class="medical-need">Medicínska potreba: {patient.medicalNeed}</div>
                    <div class="estimated-service-time">Čas vydania stravy: {patient.consumationTime}</div>
                  </div>
                </md-list-item>
              ))}
            </md-list>
            }
            <md-divider inset></md-divider>
            <div class="actions">
              <md-filled-button id="confirm"
                onclick={() => this.entryClicked.emit("@new")}>
                <md-icon slot="icon">add</md-icon>
                Vytvoriť novú
              </md-filled-button>
            </div>
          </div>
        </div>
      </Host>
    );
  }

  selectOrder(order: any) {
    this.selectedOrder = order;
  }

  deselectOrder() {
    this.selectedOrder = null;
  }

  cancelOrder(event: Event, orderId: string) {
    event.stopPropagation();
    this.orders = this.orders.filter(order => order.orderId !== orderId);
    if (this.selectedOrder && this.selectedOrder.orderId === orderId) {
      this.selectedOrder = null;
    }
  }

  addNewOrder() {
    console.log("not implemented yet");
  }

}
