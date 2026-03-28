import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => {
  const uploadTaskOnMock = vi.fn();

  return {
    toastOpenMock: vi.fn(),
    storageRefMock: vi.fn((storage, path) => ({ storage, fullPath: path })),
    getDownloadURLMock: vi.fn(async () => 'https://cdn.test/image.jpg'),
    deleteObjectMock: vi.fn(async () => {}),
    uploadTaskOnMock,
    uploadBytesResumableMock: vi.fn((refObj) => ({
      snapshot: { ref: refObj },
      on: (...args: unknown[]) => uploadTaskOnMock(...args),
    })),
    productStoreMock: {
      gallery: [] as Array<{ order: number; url: string }>,
    },
  };
});

vi.mock('uid', () => ({
  uid: () => 'fixed-image-id',
}));

vi.mock('vuefire', () => ({
  useFirebaseStorage: () => ({ app: 'fake-storage' }),
}));

vi.mock('firebase/storage', () => ({
  ref: mocked.storageRefMock,
  uploadBytesResumable: mocked.uploadBytesResumableMock,
  getDownloadURL: mocked.getDownloadURLMock,
  deleteObject: mocked.deleteObjectMock,
}));

vi.mock('@/modules/product/stores/product', () => ({
  useProductStore: () => mocked.productStoreMock,
}));

vi.mock('@/modules/product/api/ProductGalleryAPI', () => ({
  default: {
    findByProductId: vi.fn(async () => ({
      data: [{ url: '/products/existing-a.jpg' }, { url: '/products/existing-b.jpg' }],
    })),
  },
}));

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue');

  return {
    ...actual,
    inject: vi.fn(() => ({
      open: mocked.toastOpenMock,
    })),
  };
});

import useImage from '@/modules/products/composables/useImage';

describe('useImage composable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked.productStoreMock.gallery = [];
  });

  it('onFileChange sube imagen y agrega url al gallery', async () => {
    const { onFileChange } = useImage();
    const event = {
      target: {
        files: [new File(['content'], 'card.jpg', { type: 'image/jpeg' })],
      },
    };

    onFileChange(event);
    const onCallArgs = mocked.uploadTaskOnMock.mock.calls[0];
    const complete = onCallArgs[3] as () => void;
    complete();

    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mocked.storageRefMock).toHaveBeenCalledWith(
      expect.anything(),
      '/products/fixed-image-id.jpg',
    );
    expect(mocked.uploadBytesResumableMock).toHaveBeenCalledTimes(1);
    expect(mocked.getDownloadURLMock).toHaveBeenCalledTimes(1);
    expect(mocked.productStoreMock.gallery).toEqual([
      { order: 1, url: 'https://cdn.test/image.jpg' },
    ]);
  });

  it('onFileChange bloquea cuando ya hay 5 imágenes', () => {
    mocked.productStoreMock.gallery = Array.from({ length: 5 }, (_, index) => ({
      order: index + 1,
      url: `https://cdn.test/${index + 1}.jpg`,
    }));

    const { onFileChange } = useImage();
    const event = {
      target: {
        files: [new File(['content'], 'card.jpg', { type: 'image/jpeg' })],
      },
    };

    onFileChange(event);

    expect(mocked.toastOpenMock).toHaveBeenCalledWith({
      message: 'Máximo de imágenes alcanzado',
      type: 'error',
    });
    expect(mocked.uploadBytesResumableMock).not.toHaveBeenCalled();
  });

  it('updateOrder reemplaza el orden de galería', () => {
    const { updateOrder } = useImage();
    const nextOrder = [
      { order: 1, url: 'https://cdn.test/z.jpg' },
      { order: 2, url: 'https://cdn.test/a.jpg' },
    ];

    updateOrder(nextOrder as any);

    expect(mocked.productStoreMock.gallery).toEqual(nextOrder);
  });

  it('deleteImage elimina del storage y de la galería local', async () => {
    mocked.productStoreMock.gallery = [
      { order: 1, url: '/products/one.jpg' },
      { order: 2, url: '/products/two.jpg' },
    ];
    const { deleteImage } = useImage();

    await deleteImage('/products/one.jpg');

    expect(mocked.deleteObjectMock).toHaveBeenCalledTimes(1);
    expect(mocked.productStoreMock.gallery).toEqual([{ order: 2, url: '/products/two.jpg' }]);
  });

  it('deleteImageAll elimina todas las imágenes del storage', async () => {
    mocked.productStoreMock.gallery = [
      { order: 1, url: '/products/one.jpg' },
      { order: 2, url: '/products/two.jpg' },
    ];
    const { deleteImageAll } = useImage();

    deleteImageAll();
    await Promise.resolve();

    expect(mocked.deleteObjectMock).toHaveBeenCalledTimes(2);
    expect(mocked.productStoreMock.gallery).toEqual([]);
  });
});
