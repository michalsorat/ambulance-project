import { newSpecPage } from '@stencil/core/testing';
import { AmbulanceRecordDetail } from '../ambulance-record-detail';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MealOrder } from '../../../api/ambulance-project';

describe('ambulance-record-detail', () => {
  const sampleEntry: MealOrder = {
    id: "1",
    name: "Test User",
    dietaryReq: "Vegetarian",
    medicalNeed: "Diabetes",
    consumationTime: "2024-05-26T18:30:00.000Z"
  };

  let mock: MockAdapter;
  const validAmbulanceId = 'Trnava-onkologia';

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('renders new entry form', async () => {
    const page = await newSpecPage({
      components: [AmbulanceRecordDetail],
      html: `<ambulance-record-detail ambulance-id="${validAmbulanceId}" entry-id="@new" api-base="http://test/api"></ambulance-record-detail>`,
    });

    expect(page.root.shadowRoot.querySelector('h2').textContent).toBe('Vytvoriť novú objednávku');
  });

  it('renders existing entry details', async () => {
    mock.onGet(`http://test/api/meal-orders/${validAmbulanceId}/records/1`).reply(200, sampleEntry);

    const page = await newSpecPage({
      components: [AmbulanceRecordDetail],
      html: `<ambulance-record-detail ambulance-id="${validAmbulanceId}" entry-id="1" api-base="http://test/api"></ambulance-record-detail>`,
    });

    await page.waitForChanges();

    const recordDetail = page.rootInstance as AmbulanceRecordDetail;
    console.log('Record Detail Entry:', recordDetail.entry);
    console.log('Error Message:', recordDetail.errorMessage);
    expect(recordDetail.entry).toEqual(sampleEntry);

    const patientName = page.root.shadowRoot.querySelector('md-filled-text-field[label="Meno a Priezvisko"]');
    expect(patientName).not.toBeNull();
    expect(patientName.getAttribute('value')).toEqual(sampleEntry.name);
  });

  it('renders error message on network issues', async () => {
    mock.onGet(`http://test/api/meal-orders/${validAmbulanceId}/records/existing-entry-id`).networkError();

    const page = await newSpecPage({
      components: [AmbulanceRecordDetail],
      html: `<ambulance-record-detail ambulance-id="${validAmbulanceId}" entry-id="existing-entry-id" api-base="http://test/api"></ambulance-record-detail>`,
    });

    await page.waitForChanges();

    const recordDetail = page.rootInstance as AmbulanceRecordDetail;
    console.log('Error Message:', recordDetail.errorMessage);
    expect(recordDetail.errorMessage).toBeDefined();
    expect(page.root.shadowRoot.querySelector('.error').textContent).toContain('Cannot retrieve patient order');
  });

  it('creates a new entry successfully', async () => {
    mock.onPost(`http://test/api/meal-orders/${validAmbulanceId}/records`).reply(201, sampleEntry);

    const page = await newSpecPage({
      components: [AmbulanceRecordDetail],
      html: `<ambulance-record-detail ambulance-id="${validAmbulanceId}" entry-id="@new" api-base="http://test/api"></ambulance-record-detail>`,
    });

    const recordDetail = page.rootInstance as AmbulanceRecordDetail;
    recordDetail.entry = sampleEntry;
    await recordDetail.updateEntry();
    console.log('Error Message:', recordDetail.errorMessage);
    expect(recordDetail.errorMessage).toBeUndefined();
  });

  it('updates an existing entry successfully', async () => {
    mock.onGet(`http://test/api/meal-orders/${validAmbulanceId}/records/1`).reply(200, sampleEntry);
    mock.onPut(`http://test/api/meal-orders/${validAmbulanceId}/records/1`).reply(200, sampleEntry);

    const page = await newSpecPage({
      components: [AmbulanceRecordDetail],
      html: `<ambulance-record-detail ambulance-id="${validAmbulanceId}" entry-id="1" api-base="http://test/api"></ambulance-record-detail>`,
    });

    await page.waitForChanges();

    const recordDetail = page.rootInstance as AmbulanceRecordDetail;
    recordDetail.entry = sampleEntry;
    await recordDetail.updateEntry();
    console.log('Error Message:', recordDetail.errorMessage);
    expect(recordDetail.errorMessage).toBeUndefined();
  });

  it('handles deletion of an entry successfully', async () => {
    mock.onGet(`http://test/api/meal-orders/${validAmbulanceId}/records/1`).reply(200, sampleEntry);
    mock.onDelete(`http://test/api/meal-orders/${validAmbulanceId}/records/1`).reply(204);

    const page = await newSpecPage({
      components: [AmbulanceRecordDetail],
      html: `<ambulance-record-detail ambulance-id="${validAmbulanceId}" entry-id="1" api-base="http://test/api"></ambulance-record-detail>`,
    });

    await page.waitForChanges();

    const recordDetail = page.rootInstance as AmbulanceRecordDetail;
    await recordDetail.deleteEntry();
    console.log('Error Message:', recordDetail.errorMessage);
    expect(recordDetail.errorMessage).toBeUndefined();
  });

  it('renders error message when deletion fails', async () => {
    mock.onGet(`http://test/api/meal-orders/${validAmbulanceId}/records/1`).reply(200, sampleEntry);
    mock.onDelete(`http://test/api/meal-orders/${validAmbulanceId}/records/1`).networkError();

    const page = await newSpecPage({
      components: [AmbulanceRecordDetail],
      html: `<ambulance-record-detail ambulance-id="${validAmbulanceId}" entry-id="1" api-base="http://test/api"></ambulance-record-detail>`,
    });

    await page.waitForChanges();

    const recordDetail = page.rootInstance as AmbulanceRecordDetail;
    await recordDetail.deleteEntry();
    console.log('Error Message:', recordDetail.errorMessage);
    expect(recordDetail.errorMessage).toContain('Cannot delete entry');
  });
});