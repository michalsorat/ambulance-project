import { newSpecPage } from '@stencil/core/testing';
import { AmbulanceApp } from '../ambulance-app';

describe('ambulance-app', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AmbulanceApp],
      html: `<ambulance-app></ambulance-app>`,
    });
    const app = page.rootInstance as AmbulanceApp;
    const expectedOrders = app?.orders?.length

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(items.length).toEqual(expectedOrders);
  });
});
