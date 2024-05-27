import { newE2EPage } from '@stencil/core/testing';

describe('ambulance-record-detail', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ambulance-record-detail></ambulance-record-detail>');

    const element = await page.find('ambulance-record-detail');
    expect(element).toHaveClass('hydrated');
  });
});
