import { defineStore } from 'pinia';
import ksbTechApi from '../../axios';
import { useAuthStore } from './auth';
// /admin/banners

interface BannerFormat {
    preview_image: string,
    featured_image: string
}

export const useBannersStore = defineStore('banners', {

    actions: {
        async getAllBanners() {
            const store = useAuthStore();
            const response = await ksbTechApi.get(`/admin/banners?include=admin`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${store.token}`
                }
            })
            return response
        },
        async deleteBanners(id: any) {
            const store = useAuthStore();
            const response = await ksbTechApi.delete(`/admin/banners/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${store.token}`
                }
            })
            return response
        },
        async getSingleBanner(id: any) {
            const store = useAuthStore();
            const response = await ksbTechApi.get(`/admin/banners/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${store.token}`
                }
            })
            return response
        },
        async toggleBannerActivation(id: any) {
            const store = useAuthStore();
            const response = await ksbTechApi.patch(`/admin/banners/${id}/activation`, "",{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${store.token}`
                }
            })
            return response
        },
        async uploadBanners(data: BannerFormat) {
            const store = useAuthStore();
            var formdata = new FormData();
            formdata.append("preview_image", data.preview_image, "image.webp");
            formdata.append("featured_image", data.featured_image, "intro-to-cloud.jpeg");

            const response = await ksbTechApi.post(`/admin/banners?include=admin`, formdata, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${store.token}`
                }
            })
            return response
        },
    },
});
