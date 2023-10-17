import { defineStore } from 'pinia';
import { country, countryMgt, all_country } from '../../apiRoute';
import { useNotification } from '@kyvg/vue3-notification';
import ksbTechApi from '../../axios';
import { useAuthStore } from './auth';

export const useCountryStore = defineStore({
  id: 'country',
  state: () => ({
    country: [],
    countryMgt: [],
    currencies: [],
    giftCategories: [],
    dialog: false,
    exchange_rate_to_ngn: '',
    buy_rate:"",
    sell_rate:"",
    loading: false,
    all_country: {},
    page:1,
  }),
  getters: {
    countryNames: (state) => state.country.map((country) => country['name']),
    countries: (state) => state.country,
    giftCardCategories: (state) =>
      state.giftCategories.map((items) => {
        return {
          id: items['id'],
          name: items['name']
        };
      })
  },
  actions: {
    async getCountries() {
      try {
        await ksbTechApi
          .get(country + '?filter[giftcard_activated]=' + 1 + '&do_not_paginate=1', {
            headers: {
              Accept: 'application/json'
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.country = res.data.data.countries;
            }
          );
      } catch (error) {}
    },
    async getCountryMgt(
      page_no: number = 1,
      name: string = '',
      activated: string = '',
      registered: string = ''
    ) {
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            countryMgt +
              '?per_page=' +
              150 +
              '&page=' +
              page_no +
              '&filter[name]=' +
              name +
              '&filter[registration_activated]=' +
              registered +
              '&filter[giftcard_activated]=' +
              activated,
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${store.token}`
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.countryMgt = res.data.data.countries;
              this.loading = false;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getAllCountry(
      page_no: number = 1,
      name: string = '',
      activated: string = '',
      registered: string = ''
    ) {
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .get(
            all_country +
              '?do_not_paginate=1' +
              '&page=' +
              page_no +
              '&filter[name]=' +
              name +
              '&filter[registration_activated]=' +
              registered +
              '&filter[giftcard_activated]=' +
              activated,
            {
              headers: {
                Accept: 'application/json'
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.all_country = res.data.data.countries;
              this.loading = false;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async registrationActivation(id: string) {
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .patch(countryMgt + '/' + id + '/registration', '', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getCountryMgt(1);
              this.loading = false;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async giftcardActivation(id: string, page: number) {
      const store = useAuthStore();
      this.loading = true;
      try {
        await ksbTechApi
          .patch(countryMgt + '/' + id + '/giftcard', '', {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.getCountryMgt(page);
              this.loading = false;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },

    async getCurrency(name: string = '') {
      try {
        this.loading = true;
        await ksbTechApi
          .get('/currencies' + '?do_not_paginate=' + 1, {
            headers: {
              Accept: 'application/json'
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.currencies = res.data.data.currencies;
              this.loading = false;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async updateCurrency(id: string) {
      try {
        const { notify } = useNotification();
        const store = useAuthStore();
        this.loading = true;
        var formData = new FormData();

        formData.append('exchange_rate_to_ngn', this.exchange_rate_to_ngn);
        formData.append('buy_rate', this.buy_rate);
        formData.append('sell_rate', this.sell_rate);
        formData.append('_method', 'PATCH');

        await ksbTechApi
          .post('/admin/currencies' + '/' + id, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${store.token}`
            }
          })
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              notify({
                title: 'Successful',
                text: res.data.message,
                type: 'success'
              });
              this.loading = false;

              this.getCurrency()
              this.dialog = false;
            }
          );
      } catch (error) {
        this.loading = false;
      }
    },
    async getProducts() {
      try {
        await ksbTechApi
          .get(
            '/giftcard-categories' +
              '?include=countries' +
              '&do_not_paginate=1',
            {
              headers: {
                Accept: 'application/json'
              }
            }
          )
          .then(
            (res: {
              data: {
                message: string;
                data: any;
              };
            }) => {
              this.giftCategories = res.data.data.giftcard_categories;
            }
          );
      } catch (error) {}
    }
  }
});
//  + '?do_not_paginate=1'
