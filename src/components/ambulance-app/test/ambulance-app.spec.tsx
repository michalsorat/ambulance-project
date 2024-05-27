import { newSpecPage } from '@stencil/core/testing';
import { AmbulanceApp } from '../ambulance-app';
import { AmbulanceRecordList } from '../../ambulance-record-list/ambulance-record-list';
import { AmbulanceRecordDetail } from '../../ambulance-record-detail/ambulance-record-detail';

describe('ambulance-app', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'navigation', {
      writable: true,
      value: {
        navigate: jest.fn(),
        addEventListener: jest.fn(),
      },
    });
  });

  it('renders the list view by default', async () => {
    const page = await newSpecPage({
      components: [AmbulanceApp, AmbulanceRecordList],
      html: `<ambulance-app ambulance-id="bobulova" base-path="/" api-base="http://test/api"></ambulance-app>`,
    });

    expect(page.root).toBeTruthy();
    const listElement = page.root.shadowRoot.querySelector('ambulance-record-list');
    expect(listElement).not.toBeNull();
  });

  it('navigates to detail view on list item click', async () => {
    const page = await newSpecPage({
      components: [AmbulanceApp, AmbulanceRecordList, AmbulanceRecordDetail],
      html: `<ambulance-app base-path="/" ambulance-id="bobulova" api-base="http://test/api"></ambulance-app>`,
    });

    const ambulanceApp = page.rootInstance as AmbulanceApp;
    console.log('Initial relativePath:', ambulanceApp.relativePath);
    
    // Simulate navigation by directly setting the relativePath
    ambulanceApp.relativePath = 'meal-order-detail/1';
    await page.waitForChanges();
    
    console.log('Updated relativePath:', ambulanceApp.relativePath);

    const detailElement = page.root.shadowRoot.querySelector('ambulance-record-detail');
    console.log('Detail element after click:', detailElement);

    // Check if detailElement exists and has the correct entry-id attribute
    expect(detailElement).not.toBeNull();
    if (detailElement) {
      expect(detailElement.getAttribute('entry-id')).toBe('1');
    }
  });
});
