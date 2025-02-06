import { defineStore } from 'pinia';
import { ref } from 'vue';
import CampaignAPI from '../api/CampaignAPI';
import type { Campaign } from '../interfaces/campaign.interface';
import type { Product } from '@/modules/product/interfaces/product.interface';
import CampaignProductCard from '../components/CampaignProductCard.vue';
import { convertToISO, convertToYYYYMMDD } from '@/helpers/date';
import CampaignProductAPI from '../api/CampaignProductAPI';

const initialValues = {
  id: null,
  name: '',
  from: '',
  to: '',
  campaign_type_id: 0,
};

export const useCampaignStore = defineStore('campaign', () => {
  const campaigns = ref([]);
  const campaign = ref<Campaign>(initialValues);
  const campaignProducts = ref([]);

  const startISO = ref('');
  const endISO = ref('');

  const createCampaign = async () => {
    setStartDate(startISO.value);
    setEndDate(endISO.value);
    const { id, ...data } = campaign.value;
    try {
      const { data: resultData } = await CampaignAPI.create(data);
      campaign.value.id = resultData.id;
      campaignProducts.value.forEach(async (campaignProduct) => {
        const campaignProductData = {
          campaign_id: campaign.value.id,
          product_id: campaignProduct.product.id,
          campaign_price: campaignProduct.campaign_price,
        };
        await CampaignProductAPI.create(campaignProductData);
        return { msg: 'Campaña creada correctamente' };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getCampaignsAll = async () => {
    const { data } = await CampaignAPI.getAll();
    campaigns.value = data;
  };

  const addProduct = async (product: Product) => {
    if (campaign.value !== null && campaign.value.id) {
      if (productExist(product)) return;
      const campaignProductData = {
        campaign_id: campaign.value.id,
        product_id: product.id,
        campaign_price: product.price,
      };
      const { data } = await CampaignProductAPI.create(campaignProductData);

      campaignProducts.value.push({
        id: data.id,
        campaign_price: data.campaign_price,
        campaign_id: data.campaign_id,
        product: product,
      });
    } else {
      const campaignProductData = {
        id: null,
        campaign_price: product.price,
        campaign_id: campaign.value ? campaign.value.id : null,
        product: product,
      };

      if (!productExist(product)) {
        campaignProducts.value.push(campaignProductData);
      }
    }
  };

  const productExist = (product) => {
    let exist = false;
    campaignProducts.value.forEach((campaignProduct) => {
      if (campaignProduct.product.id === product.id) {
        exist = true;
      }
    });

    return exist;
  };

  const editProductPrice = async (campaign_price, product_id) => {
    let id = null;

    campaignProducts.value.map((campaignProduct) => {
      if (
        campaignProduct.product.id === product_id &&
        campaignProduct.campaign_price !== campaign_price
      ) {
        campaignProduct.campaign_price = campaign_price;
        id = campaignProduct.id;
        return campaignProduct;
      } else {
        return campaignProduct;
      }
    });

    if (campaign.value !== null && campaign.value.id) {
      const campaignProductData = {
        campaign_id: campaign.value.id,
        product_id,
        campaign_price,
      };

      await CampaignProductAPI.update(id, campaignProductData);
    }
  };

  const setStartDate = (startDate: string) => {
    const formattedStart = convertToISO(startDate);
    campaign.value.from = formattedStart;
  };

  const setEndDate = (endDate: string) => {
    const formattedEnd = convertToISO(endDate);
    campaign.value.to = formattedEnd;
  };

  const cleanCampaign = () => {
    campaign.value.id = null;
    campaign.value.name = '';
    campaign.value.from = '';
    campaign.value.to = '';
    campaign.value.campaign_type_id = 0;
    campaignProducts.value = [];

    startISO.value = '';
    endISO.value = '';
  };

  const findCampaign = async (id) => {
    try {
      const { data } = await CampaignAPI.getById(id);
      campaign.value = data;

      startISO.value = convertToYYYYMMDD(campaign.value.from);
      endISO.value = convertToYYYYMMDD(campaign.value.to);

      const { data: productsData } = await CampaignProductAPI.getByCampaignId(id);
      campaignProducts.value = productsData;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (camProduct) => {
    if (campaign.value.id !== null) {
      await CampaignProductAPI.delete(camProduct.id);
    }

    campaignProducts.value = campaignProducts.value.filter(
      (campaignProduct) => campaignProduct.product.id !== camProduct.product.id,
    );
  };

  const updateCampaign = async () => {
    setStartDate(startISO.value);
    setEndDate(endISO.value);

    const { id, ...data } = campaign.value;

    try {
      const { data: resultData } = await CampaignAPI.update(id, data);
      return resultData;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCampaign = async (id: number) => {
    try {
      await CampaignProductAPI.deleteByCampaignId(id);
      await CampaignAPI.delete(id);

      campaigns.value = campaigns.value.filter((campaign) => campaign.id !== id);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    campaigns,
    campaign,
    campaignProducts,
    startISO,
    endISO,

    // Getters

    // Methods
    getCampaignsAll,
    addProduct,
    editProductPrice,
    createCampaign,
    cleanCampaign,
    findCampaign,
    deleteProduct,
    updateCampaign,
    deleteCampaign,
  };
});
