export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === '1';
export const isProduction = process.env.NODE_ENV === 'production' && !isPreview;

const ProdHost = 'https://api.detake.com';
const DevHost = 'https://preview-api.detake.com';

export const ApiHost = isProduction ? ProdHost : DevHost;

export const ApiPath = {
  tags: `${ApiHost}/api/v1/articles/tags`,
  categories: `${ApiHost}/api/v1/articles/categories`,
  contents: `${ApiHost}/api/v1/contents`,
  contentDetail: `${ApiHost}/api/v1/contents/detail`,
  saveContent: `${ApiHost}/api/v1/contents/save`,
  walletSign: `${ApiHost}/api/v1/auth/wallet`,
};
