import { newSpecPage } from '@stencil/core/testing';
import { AmbulanceRecordList } from '../ambulance-record-list';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MealOrder } from '../../../api/ambulance-project';

describe('ambulance-record-list', () => {
  const sampleEntries: MealOrder[] = [
    {
      id: "entry-1",
      name: "Michal Sorát",
      dietaryReq: "Vegetarian",
      medicalNeed: "Diabetes",
      consumationTime: "18:30"
    }, {
      id: "entry-2",
      name: "Michal Junior",
      dietaryReq: "Gluten-Free",
      medicalNeed: "High-temperature",
      consumationTime: "18:30"
    }];

  let mock: MockAdapter;

  beforeAll(() => { mock = new MockAdapter(axios); });
  afterEach(() => { mock.reset(); });

  it('renders sample entries', async () => {
    mock.onGet().reply(200, sampleEntries);

    const page = await newSpecPage({
      components: [AmbulanceRecordList],
      html: `<ambulance-record-list ambulance-id="bobulova" api-base="http://test/api"></ambulance-record-list>`,
    });

    const recordList = page.rootInstance as AmbulanceRecordList;
    const expectedOrders = recordList?.orders?.length;

    const items = page.root.shadowRoot.querySelectorAll("md-list-item");
    expect(expectedOrders).toEqual(sampleEntries.length);
    expect(items.length).toEqual(expectedOrders);
  });

  it('renders error message on network issues', async () => {
    mock.onGet().networkError();
    const page = await newSpecPage({
      components: [AmbulanceRecordList],
      html: `<ambulance-record-list ambulance-id="bobulova" api-base="http://test/api"></ambulance-record-list>`,
    });

    const recordList = page.rootInstance as AmbulanceRecordList;
    const expectedOrders = recordList?.orders?.length;

    const errorMessage =  page.root.shadowRoot.querySelectorAll(".error");
    const items = page.root.shadowRoot.querySelectorAll("md-list-item");

    expect(errorMessage.length).toBeGreaterThanOrEqual(1)
    expect(expectedOrders).toEqual(0);
    expect(items.length).toEqual(expectedOrders);
  });
});
