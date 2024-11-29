import { ref, computed, inject } from 'vue';
import { uid } from 'uid';
import { useFirebaseStorage } from 'vuefire';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { useProductStore } from '@/modules/admin/stores/product';

const productStore = useProductStore();

export default function useImage() {
  const storage = useFirebaseStorage();
  const images = ref([]);
  const toast = inject('toast');

  const onFileChange = (e: any) => {
    const files = e.target.files;

    if (productStore.gallery.length >= 5) {
      toast.open({
        message: 'Máximo de imágenes alcanzado',
        type: 'error',
      });
      return;
    }

    for (let i = 0; i < e.target.files.length; i++) {
      const file = files[i];
      const filename = uid() + '.jpg';
      const sRef = storageRef(storage, '/products/' + filename);

      const uploadTask = uploadBytesResumable(sRef, file);

      uploadTask.on(
        'state_changed',
        () => {},
        (error) => console.log(error),
        () => {
          // Upload is complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const image = {};
            image.order = productStore.gallery.length + 1;
            image.url = downloadURL;

            productStore.gallery.push(image);
          });
        },
      );
    }
  };

  const updateOrder = (imagesOrder) => {
    productStore.gallery = imagesOrder;
  };

  const deleteImage = async (imageUrl) => {
    const imageRef = storageRef(storage, imageUrl);
    await deleteObject(imageRef);

    const newImages = productStore.gallery.filter((img) => img.url !== imageUrl);
    console.log(newImages);
    productStore.gallery = newImages;
  };

  const deleteImageAll = () => {
    productStore.gallery.forEach(async (image) => {
      const imageRef = storageRef(storage, image.url);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.log(error);
      }
    });
    productStore.gallery = [];
  };

  return {
    images,

    //Methods
    onFileChange,
    updateOrder,
    deleteImage,
    deleteImageAll,
  };
}
