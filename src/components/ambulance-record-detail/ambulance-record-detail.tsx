import { Component, Host, Prop, h, EventEmitter, State, Event } from '@stencil/core';
import { MealOrdersApiFactory, MealOrder } from '../../api/ambulance-project';

@Component({
  tag: 'ambulance-record-detail',
  styleUrl: 'ambulance-record-detail.css',
  shadow: true,
})
export class AmbulanceRecordDetail {
  @Prop() order: any;
  @Prop() entryId: string;
  @State() entry: MealOrder;
  @Event({ eventName: "editor-closed" }) editorClosed: EventEmitter<string>;
  @State() isValid: boolean;
  @State() errorMessage: string;
  @Prop() apiBase: string;
  @Prop() ambulanceId: string;

  private formElement: HTMLFormElement;

  private async getPacientOrder(): Promise<MealOrder> {
    if (this.entryId === "@new") {
      this.isValid = false;
      this.entry = {
        id: "@new",
        name: "",
        dietaryReq: "",
        medicalNeed: "",
        consumationTime: ""
      };
      return this.entry;
    }
    if (!this.entryId) {
      this.isValid = false;
      return undefined
    }
    try {
      const response
        = await MealOrdersApiFactory(undefined, this.apiBase)
          .getMealOrder(this.ambulanceId, this.entryId)

      if (response.status < 299) {
        this.isValid = true;
        return response.data;
      } else {
        this.errorMessage = `Cannot retrieve patient order: ${response.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot retrieve patient order: ${err.message || "unknown"}`
    }
    return undefined;
  }

  async componentWillLoad() {
    this.entry = await this.getPacientOrder();
  }

  render() {
    if (this.errorMessage) {
      return (
        <Host>
          <div class="error">{this.errorMessage}</div>
        </Host>
      )
    }
    return (
      <Host>
        <div class="container">
          <div class="detail-container">
            {this.entryId !== "@new" ? (
              <h2>Detail objednávky číslo {this.entryId}</h2>
            ) : (
              <h2>Vytvoriť novú objednávku</h2>
            )}
            <form ref={el => this.formElement = el}>
              <md-filled-text-field label="Meno a Priezvisko"
                required value={this.entry?.name}
                oninput={(ev: InputEvent) => {
                  if (this.entry) { this.entry.name = this.handleInputEvent(ev) }
                }}>
                <md-icon slot="leading-icon">person</md-icon>
              </md-filled-text-field>

              <md-filled-text-field label="Stravovacie požiadavky"
                required value={this.entry?.dietaryReq}
                oninput={(ev: InputEvent) => {
                  if (this.entry) { this.entry.dietaryReq = this.handleInputEvent(ev) }
                }}>
                <md-icon slot="leading-icon">restaurant</md-icon>
              </md-filled-text-field>

              <md-filled-text-field label="Diagnóza/odôvodnenie:"
                required value={this.entry?.medicalNeed}
                oninput={(ev: InputEvent) => {
                  if (this.entry) { this.entry.medicalNeed = this.handleInputEvent(ev) }
                }}>
                <md-icon slot="leading-icon">healing</md-icon>
              </md-filled-text-field>

              <md-filled-text-field label="Čas podávania stravy"
                type="time"
                required value={this.entry?.consumationTime ? this.formatTime(this.entry?.consumationTime) : ''}
                oninput={(ev: InputEvent) => {
                  if (this.entry) {
                    const time = this.handleInputEvent(ev);
                    const formattedTime = this.formatConsumationTime(time);
                    this.entry.consumationTime = formattedTime;
                  }
                }}>
                <md-icon slot="leading-icon">watch_later</md-icon>
              </md-filled-text-field>
            </form>

            <md-divider inset></md-divider>
            <div class="actions">
              <md-filled-tonal-button id="delete" disabled={!this.entry || this.entry?.id === "@new"}
                onClick={() => this.deleteEntry()} >
                <md-icon slot="icon">delete</md-icon>
                Zmazať
              </md-filled-tonal-button>
              <span class="stretch-fill"></span>
              <md-outlined-button id="cancel"
                onClick={() => this.editorClosed.emit("cancel")}>
                Zrušiť
              </md-outlined-button>
              <md-filled-button id="confirm" disabled={!this.validateForm}
                onClick={() => this.updateEntry()}>
                <md-icon slot="icon">save</md-icon>
                Uložiť
              </md-filled-button>
            </div>
          </div>
        </div>
      </Host>
    );
  }

  private validateForm(): boolean {
    this.isValid = true;
    for (let i = 0; i < this.formElement.children.length; i++) {
        const element = this.formElement.children[i]
        if ("reportValidity" in element) {
          const valid = (element as HTMLInputElement).reportValidity();
          this.isValid &&= valid;
        }
      }
      return this.isValid;
  }

  private handleInputEvent(ev: InputEvent): string {
    const target = ev.target as HTMLInputElement;
    this.isValid = true;
    const valid = target.reportValidity();
    this.isValid &&= valid;
    return target.value;
  }

  private formatTime(timeString: string): string {
    if (!timeString) return '';
    const date = new Date(timeString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private formatConsumationTime(timeString: string): string {
    try {
      if (timeString.length === 5) {
        const today = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);
        today.setHours(hours, minutes, 0, 0);

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const hour = String(today.getHours()).padStart(2, '0');
        const minute = String(today.getMinutes()).padStart(2, '0');
        const second = String(today.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`;
      }

      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toISOString();
    } catch (error) {
      console.error('Invalid time value:', error);
      return '';
    }
  }

  public async updateEntry() {
    this.isValid = this.validateForm();
    if (this.isValid) {
      try {
        const api = MealOrdersApiFactory(undefined, this.apiBase);
        const response
          = this.entryId === "@new"
            ? await api.createMealOrder(this.ambulanceId, this.entry)
            : await api.updateMealOrder(this.ambulanceId, this.entryId, this.entry);
        if (response.status < 299) {
          this.editorClosed.emit("store")
        } else {
          this.errorMessage = `Cannot store entry: ${response.statusText}`
        }
      } catch (err: any) {
        this.errorMessage = `Cannot store entry: ${err.message || "unknown"}`
      }
    }
  }

  public async deleteEntry() {
    try {
      const response = await MealOrdersApiFactory(undefined, this.apiBase)
        .deleteMealOrder(this.ambulanceId, this.entryId)
      if (response.status < 299) {
        this.editorClosed.emit("delete")
      } else {
        this.errorMessage = `Cannot delete entry: ${response.statusText}`
      }
    } catch (err: any) {
      this.errorMessage = `Cannot delete entry: ${err.message || "unknown"}`
    }
  }
}
