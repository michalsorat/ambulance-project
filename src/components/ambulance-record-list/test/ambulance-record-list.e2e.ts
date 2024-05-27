import { newE2EPage } from '@stencil/core/testing';

describe('ambulance-record-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ambulance-record-list></ambulance-record-list>');

    const element = await page.find('ambulance-record-list');
    expect(element).toHaveClass('hydrated');
  });
});
