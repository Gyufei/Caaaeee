import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Fetcher } from '../fetcher';
import { ApiResponse } from '../types/common';

interface ImageUploadResponse {
  url: string;
  filename: string;
}

interface ImageUploadParams {
  image: File;
}

export function useImageUpload(onSuccess?: (data: ImageUploadResponse) => void) {
  const mutation = useMutation({
    mutationFn: async (params: ImageUploadParams): Promise<ApiResponse<ImageUploadResponse>> => {
      const formData = new FormData();
      formData.append('image', params.image);

      const response = await Fetcher<ApiResponse<ImageUploadResponse>>(
        'https://preview-sandbox-api.tadle.com/account/upload',
        {
          method: 'POST',
          body: formData,
          // 不设置 Content-Type，让浏览器自动设置 multipart/form-data
        }
      );

      return response;
    },
    onSuccess: (data: ApiResponse<ImageUploadResponse>) => {
      toast.success('Image upload success');
      onSuccess?.(data.data);
    },
    onError: (error: Error) => {
      let errorMessage = error.message;

      if (errorMessage.length > 60) {
        errorMessage = errorMessage.slice(0, 60) + '...';
      }

      toast.error(errorMessage || 'Image upload failed');
    },
  });

  return {
    ...mutation,
    uploadImage: (file: File) => mutation.mutate({ image: file }),
  };
}
