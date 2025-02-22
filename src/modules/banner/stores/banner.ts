import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { convertToISO, convertToYYYYMMDD } from '@/helpers/date';
import { uid } from 'uid';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { useFirebaseStorage } from 'vuefire';
import useImage from '@/modules/products/composables/useImage';
import BannerAPI from '../api/BannerAPI';

export const useBannerStore = defineStore('banner', () => {
  const id = ref(0);
  const name = ref('');
  const url = ref('');
  const order = ref(0);
  const redirect = ref('');
  const start = ref('');
  const end = ref('');

  const newUrl = ref('');

  const startISO = ref('');
  const endISO = ref('');

  const storage = useFirebaseStorage();
  const { deleteImage } = useImage();

  const create = async () => {
    if (isImageUploaded.value) {
      if (url.value !== '') {
        deleteBannerImage(url.value);
      }
      url.value = newUrl.value;
      newUrl.value = '';
    }

    setStartDate(startISO.value);
    setEndDate(endISO.value);

    const data = {
      name: name.value,
      url: url.value,
      order: order.value,
      redirect: redirect.value,
      start: start.value,
      end: end.value,
    };

    try {
      const { data: resultData } = await BannerAPI.create(data);
      id.value = resultData.id;

      return resultData;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async () => {
    if (isImageUploaded.value) {
      if (url.value !== '') {
        deleteBannerImage(url.value);
      }
      url.value = newUrl.value;
      newUrl.value = '';
    }
    setStartDate(startISO.value);
    setEndDate(endISO.value);

    const data = {
      name: name.value,
      url: url.value,
      order: order.value,
      redirect: redirect.value,
      start: start.value,
      end: end.value,
    };

    try {
      const { data: resultData } = await BannerAPI.update(id.value, data);
      return resultData;
    } catch (error) {
      console.log(error);
    }
  };

  const setStartDate = (startDate: string) => {
    const formattedStart = convertToISO(startDate);
    start.value = formattedStart;
  };

  const setEndDate = (endDate: string) => {
    const formattedEnd = convertToISO(endDate);
    end.value = formattedEnd;
  };

  const saveImage = async (e: any) => {
    if (newUrl.value !== '') await deleteImage(newUrl.value);

    const file = e.target.files[0];
    const filename = uid() + '.jpg';
    const sRef = storageRef(storage, '/banners/' + filename);

    const uploadTask = uploadBytesResumable(sRef, file);

    uploadTask.on(
      'state_changed',
      () => {},
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          newUrl.value = downloadURL;
        });
      },
    );
  };

  const deleteBannerImage = async (imageUrl) => {
    await deleteImage(imageUrl);
  };

  const cleanBanner = () => {
    id.value = 0;
    name.value = '';
    url.value = '';
    order.value = 0;
    redirect.value = '';
    start.value = '';
    end.value = '';

    startISO.value = '';
    endISO.value = '';
  };

  const findBanner = async (bannerId: number) => {
    try {
      const { data } = await BannerAPI.getById(bannerId);

      id.value = data.id;
      name.value = data.name;
      url.value = data.url;
      order.value = data.order;
      redirect.value = data.redirect;
      start.value = data.start;
      end.value = data.end;

      startISO.value = convertToYYYYMMDD(start.value);
      endISO.value = convertToYYYYMMDD(end.value);
    } catch (error) {
      console.log(error);
    }
  };

  const isImageUploaded = computed(() => (newUrl.value ? newUrl.value : null));

  return {
    id,
    name,
    url,
    order,
    redirect,
    start,
    end,

    newUrl,

    // Methods
    create,
    update,
    setStartDate,
    setEndDate,
    saveImage,
    deleteBannerImage,
    cleanBanner,
    findBanner,

    // Getters
    isImageUploaded,
    startISO,
    endISO,
  };
});
