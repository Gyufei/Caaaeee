import { useRouter } from '@/i18n/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePrivy } from '@privy-io/react-auth';
import { Check, ChevronsUpDown, InfoIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { z } from 'zod';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

// import RichEditor from '@/components/common/editor';
import { FormStep } from '@/components/common/form-step';
import { NumberInput } from '@/components/common/number-input';
import Upload from '@/components/common/upload';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { ContentDetailData } from '@/lib/api/use-content-detail';
import { useCountryCity } from '@/lib/api/use-country-city';
import { type SaveContentPayload, useSaveContent } from '@/lib/api/use-save-content';
import { PayTokens } from '@/lib/config/tokens';
import { cn } from '@/lib/utils';

import { CateSearchInput } from './cate-search-input';
import { TagSearchInput } from './tag-search-input';

// 定义表单验证模式 - 创建函数以支持动态翻译
const createFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    // step 0
    country: z.string().min(1, t('validation.selectCountry')),
    city: z.string().min(1, t('validation.selectCity')),
    twitterUsername: z.string().min(1, t('validation.enterTwitterUsername')),
    assetType: z.enum(['token-symbol', 'crypto-ticker', 'contract-address']),
    assetValue: z.string().optional(),
    relatedPlatform: z.enum(['none', 'uniswap', 'pancakeswap', 'sushiswap']),
    fullName: z.string().min(1, t('validation.enterFullName')),
    title: z.string().optional(),
    company: z.string().optional(),
    email: z.email(t('validation.enterValidEmail')).optional().or(z.literal('')),
    phone: z.string().optional(),

    // step 1
    articleTitle: z.string().min(1, t('validation.enterArticleTitle')),
    featuredImage: z.string().optional(),
    contentBody: z.string().optional(),
    subTitle: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),

    // step 2
    totalCampaignBudget: z.string().optional(),
    totalCampaignBudgetCurrency: z.string(),
    campaignBudgetOptimization: z.boolean(),
    dailyCampaignBudget: z.string().optional(),
    dailyCampaignBudgetCurrency: z.string(),
  });

export default function CreateArticle({ initFormData }: { initFormData?: ContentDetailData }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('ArticleForm');
  const [currentStep, setCurrentStep] = useState(0);
  const { data: countryCityData, isLoading: isCountryCityLoading } = useCountryCity();
  const { mutateAsync: saveContent, isPending } = useSaveContent();

  const formSchema = createFormSchema(t);
  type ArticleFormData = z.infer<typeof formSchema>;

  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const { connectWallet } = usePrivy();
  const { address } = useAccount();

  const [submitDataStatus, setSubmitDataStatus] = useState<'draft' | 'published'>('draft');

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      country: '',
      city: '',
      articleTitle: '',
      subTitle: '',
      contentBody: '',
      category: '',
      tags: [],
      featuredImage: '',
      twitterUsername: '',
      assetType: 'token-symbol',
      assetValue: '',
      relatedPlatform: 'none',
      title: '',
      fullName: '',
      company: '',
      email: '',
      phone: '',
      totalCampaignBudget: '',
      totalCampaignBudgetCurrency: 'SOL',
      campaignBudgetOptimization: false,
      dailyCampaignBudget: '',
      dailyCampaignBudgetCurrency: 'SOL',
    },
  });

  useEffect(() => {
    if (!initFormData) return;

    form.reset({
      country: initFormData.country || '',
      city: initFormData.city || '',
      twitterUsername: '',
      assetType: 'token-symbol',
      assetValue: '',
      relatedPlatform: 'none',
      fullName: initFormData.contact?.full_name || '',
      title: initFormData.contact?.title || '',
      company: initFormData.contact?.company || '',
      email: initFormData.contact?.email || '',
      phone: initFormData.contact?.phone || '',

      articleTitle: initFormData.title || '',
      featuredImage: initFormData.img_url || '',
      contentBody: initFormData.body || '',
      subTitle: initFormData.sub_title || '',
      tags: initFormData.tags?.map((t) => t.name) || [],
      category: initFormData.category?.name || '',

      totalCampaignBudget: '',
      totalCampaignBudgetCurrency: 'SOL',
      campaignBudgetOptimization: false,
      dailyCampaignBudget: '',
      dailyCampaignBudgetCurrency: 'SOL',
    });
  }, [initFormData, form]);

  function handleBack() {
    router.back();
  }

  const cityData = useMemo(() => {
    const country = form.getValues('country');
    if (!countryCityData || !country) return [];

    const cityData = countryCityData?.[country] || [];
    const c = [...new Set(cityData)];
    return c;
  }, [form.watch('country'), countryCityData]);

  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 0) {
      const result = await form.trigger(['country', 'city', 'twitterUsername', 'fullName']);
      if (!result) {
        toast.error(t('messages.fillRequiredFields'));
      }
      return result;
    }

    if (step === 1) {
      const result = await form.trigger(['articleTitle']);
      if (!result) {
        toast.error(t('messages.fillRequiredFields'));
      }
      return result;
    }

    if (step === 2) {
      // Step 2 validation is optional, so we always return true
      return true;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (currentStep < 2 && (await validateStep(currentStep))) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmitWithStatus = (status: 'draft' | 'published') => async (data: ArticleFormData) => {
    try {
      setSubmitDataStatus(status);
      const language = locale === 'us' ? 'en' : 'zh';

      const formPayload: SaveContentPayload = {
        country: data.country,
        city: data.city,
        title: data.articleTitle,
        sub_title: data.subTitle ?? '',
        body: data.contentBody ?? '',
        content_type: 'article',
        business_type: 'News',
        category: data.category ?? '',
        tags: data.tags ?? [],
        language,
        img_url: data.featuredImage ?? '',
        status,
        contact: {
          full_name: data.fullName,
          title: data.title ?? '',
          company: data.company ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
        },
      };

      const payload = initFormData
        ? {
            ...formPayload,
            entry_id: initFormData.entry_id,
          }
        : formPayload;

      const res = await saveContent(payload);

      toast.success(res.msg[locale === 'us' ? 'en' : 'zh']);
      router.push(`/articles`);
    } catch (e) {
      const message = e instanceof Error ? e.message : t('messages.submitFailed');
      toast.error(message);
    }
  };

  const handleConnectWallet = () => {
    connectWallet();
  };

  function checkImage(image: HTMLImageElement) {
    if (image.width < 1024) {
      toast.error(t('messages.imageWidthError'));
      return false;
    }

    return true;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-0 sm:h-14 border-b border-border gap-3 sm:gap-0">
        <div
          className="flex items-center gap-3 cursor-pointer order-1 sm:order-none"
          onClick={handleBack}
        >
          <Image src="/icons/arrow-left.svg" alt="arrow-left" width={20} height={20} />
          <span className="text-sm font-medium text-foreground leading-[140%]">
            {t('navigation.back')}
          </span>
        </div>
        <div className="order-2 sm:order-none w-full sm:w-auto">
          <FormStep
            steps={[
              t('navigation.steps.basicFields'),
              t('navigation.steps.contentBody'),
              t('navigation.steps.promotion'),
            ]}
            currentStep={currentStep}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="py-4 sm:py-8 px-4 sm:px-6">
          <div className="text-foreground leading-[140%] text-2xl sm:text-3xl lg:text-5xl">
            {initFormData?.entry_id ? t('EditArticle') : t('CreateArticle')}
          </div>
          {initFormData?.entry_id && (
            <div className="mt-[10px] text-lg sm:text-xl leading-[140%] text-muted-foreground">
              {t('entryId')} {initFormData.entry_id}
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitWithStatus('published'))} className="flex-1 flex flex-col">
            {currentStep === 0 && (
              <>
                {/* Location Section */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 border-t border-border">
                  <h3 className="text-base font-medium text-foreground">
                    {t('sections.location')}
                  </h3>
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            {t('fields.country')}
                            <RequiredStart />
                          </FormLabel>
                          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={countryOpen}
                                className="w-full justify-between !h-12"
                                disabled={isCountryCityLoading}
                              >
                                {field.value ? (
                                  field.value
                                ) : isCountryCityLoading ? (
                                  <span className="text-muted-foreground">
                                    {t('states.loading')}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    {t('placeholders.country')}
                                  </span>
                                )}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder={t('search.searchCountry')}
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>{t('states.noData')}</CommandEmpty>
                                  <CommandGroup>
                                    {countryCityData &&
                                      Object.keys(countryCityData).map((country) => (
                                        <CommandItem
                                          key={country}
                                          value={country}
                                          onSelect={(currentValue) => {
                                            const next =
                                              currentValue === field.value ? '' : currentValue;
                                            field.onChange(next);
                                            form.setValue('city', '');
                                            setCountryOpen(false);
                                          }}
                                        >
                                          {country}
                                          <Check
                                            className={cn(
                                              'ml-auto',
                                              field.value === country ? 'opacity-100' : 'opacity-0'
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            {t('fields.city')}
                            <RequiredStart />
                          </FormLabel>
                          <Popover open={cityOpen} onOpenChange={setCityOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={cityOpen}
                                className="w-full justify-between !h-12"
                                disabled={isCountryCityLoading || !form.watch('country')}
                              >
                                {field.value ? (
                                  field.value
                                ) : isCountryCityLoading ? (
                                  <span className="text-muted-foreground">
                                    {t('states.loading')}
                                  </span>
                                ) : !form.watch('country') ? (
                                  <span className="text-muted-foreground">
                                    {t('search.selectCountryFirst')}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    {t('placeholders.city')}
                                  </span>
                                )}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder={t('search.searchCity')}
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>{t('states.noData')}</CommandEmpty>
                                  <CommandGroup>
                                    {cityData.map((city) => (
                                      <CommandItem
                                        key={city}
                                        value={city}
                                        onSelect={(currentValue) => {
                                          const next =
                                            currentValue === field.value ? '' : currentValue;
                                          field.onChange(next);
                                          setCityOpen(false);
                                        }}
                                      >
                                        {city}
                                        <Check
                                          className={cn(
                                            'ml-auto',
                                            field.value === city ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-[10px]">
                    <h3 className="text-base font-medium text-foreground">
                      {t('sections.socialMedia')}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t('descriptions.socialMedia')}</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="twitterUsername"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                          {t('fields.twitterUsername')}
                          <RequiredStart />
                        </FormLabel>
                        <div className="flex flex-col sm:flex-row w-full gap-2">
                          <div className="relative flex-1">
                            <span className="absolute top-[14px] left-4 text-sm text-foreground leading-[140%]">
                              {t('descriptions.twitterPrefix')}
                            </span>
                            <FormControl>
                              <Input
                                placeholder={t('placeholders.twitterUsername')}
                                className="w-full pl-[120px] h-12"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            variant="outline"
                            className="flex items-center justify-center gap-2 h-12 w-full sm:w-auto"
                          >
                            <Image src="/icons/twitter.svg" alt="twitter" width={20} height={20} />
                            {t('buttons.connect')}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Related Asset Info Section */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 border-t border-border">
                  <h3 className="text-base font-medium text-foreground">
                    {t('sections.relatedAsset')}
                  </h3>
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="w-full sm:w-fit flex gap-1 p-1 bg-[#F5F6F7] rounded-md">
                        <button
                          type="button"
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors flex-1 sm:flex-none ${
                            form.watch('assetType') === 'token-symbol'
                              ? 'bg-white text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          onClick={() => form.setValue('assetType', 'token-symbol')}
                        >
                          {t('options.assetTypes.tokenSymbol')}
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors flex-1 sm:flex-none ${
                            form.watch('assetType') === 'crypto-ticker'
                              ? 'bg-white text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          onClick={() => form.setValue('assetType', 'crypto-ticker')}
                        >
                          {t('options.assetTypes.cryptoTicker')}
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors flex-1 sm:flex-none ${
                            form.watch('assetType') === 'contract-address'
                              ? 'bg-white text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          onClick={() => form.setValue('assetType', 'contract-address')}
                        >
                          {t('options.assetTypes.contractAddress')}
                        </button>
                      </div>
                      <FormField
                        control={form.control}
                        name="assetValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={
                                  form.watch('assetType') === 'token-symbol'
                                    ? t('placeholders.assetValue.tokenSymbol')
                                    : form.watch('assetType') === 'crypto-ticker'
                                      ? t('placeholders.assetValue.cryptoTicker')
                                      : t('placeholders.assetValue.contractAddress')
                                }
                                className="w-full !h-12"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="relatedPlatform"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            {t('options.relatedPlatform')}
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full !h-12">
                                <SelectValue placeholder={t('options.platforms.selectPlatform')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">{t('options.platforms.none')}</SelectItem>
                              <SelectItem value="uniswap">
                                {t('options.platforms.uniswap')}
                              </SelectItem>
                              <SelectItem value="pancakeswap">
                                {t('options.platforms.pancakeswap')}
                              </SelectItem>
                              <SelectItem value="sushiswap">
                                {t('options.platforms.sushiswap')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Section */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5 border-t border-border">
                  <h3 className="text-base font-medium text-foreground">{t('sections.contact')}</h3>
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            {t('fields.fullName')}
                            <RequiredStart />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('placeholders.fullName')}
                              className="w-full !h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            {t('fields.title')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('placeholders.title')}
                              className="w-full !h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            {t('fields.company')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('placeholders.company')}
                              className="w-full !h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            {t('fields.email')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('placeholders.email')}
                              type="email"
                              className="w-full !h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            {t('fields.phone')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('placeholders.phone')}
                              type="tel"
                              className="w-full !h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                {/* Article Title */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5">
                  <FormField
                    control={form.control}
                    name="articleTitle"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                          {t('fields.articleTitle')}
                          <RequiredStart />
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('placeholders.articleTitle')}
                            className="w-full !h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Featured Image */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-2">
                  <h3 className="text-base font-medium text-foreground">
                    {t('sections.featuredImage')}
                  </h3>
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormControl>
                          <div className="w-full">
                            <Upload
                              value={field.value}
                              onChange={field.onChange}
                              checkFunc={checkImage}
                              className="border border-dashed p-3 sm:p-6 w-full"
                              tipContent={
                                <div className="text-xs text-center text-muted-foreground">
                                  <div>{t('descriptions.imageRequirements.minWidth')}</div>
                                  <div>{t('descriptions.imageRequirements.recommended')}</div>
                                  <div>{t('descriptions.imageRequirements.ratio')}</div>
                                </div>
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Article Content */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-medium text-foreground">
                      {t('sections.articleContent')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('descriptions.articleContent')}
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="contentBody"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormControl>
                          {/* <div className="w-[640px] border border-border rounded-xs">
                            <RichEditor value={field.value ?? '[]'} onChange={field.onChange} />
                          </div> */}
                          <textarea
                            placeholder={t('placeholders.contentBody')}
                            className="w-full h-[200px] sm:h-[320px] border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none hover:border-[#575657] focus-visible:border-[#06A17E] focus-visible:text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sub Title */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 mt-[10px] flex flex-col">
                  <FormField
                    control={form.control}
                    name="subTitle"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                          {t('fields.subTitle')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('placeholders.articleTitle')}
                            className="w-full !h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tag */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-2">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <div>
                      <div className="text-sm text-foreground leading-[140%] mb-2">
                        {t('fields.tag')}
                      </div>
                      <TagSearchInput
                        values={form.watch('tags') ?? []}
                        onChange={(vals) => form.setValue('tags', vals)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-[#06A17E]">{t('fields.include')}</div>
                      <SelectedChips
                        values={form.watch('tags') ?? []}
                        onRemove={(val) => {
                          const next = (form.watch('tags') ?? []).filter((t) => t !== val);
                          form.setValue('tags', next);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-2">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <div>
                      <div className="text-sm text-foreground leading-[140%] mb-2">
                        {t('fields.category')}
                      </div>
                      <CateSearchInput
                        value={form.watch('category') ?? ''}
                        onChange={(val) => form.setValue('category', val)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-[#06A17E]">{t('fields.include')}</div>
                      <SelectedChips
                        values={form.watch('category') ? [form.watch('category')!] : []}
                        onRemove={() => {
                          form.setValue('category', '');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Campaign Budget Settings */}
                <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col lg:flex-row justify-start border-t border-border">
                  <div className="flex flex-col gap-6 sm:gap-[30px]">
                    {/* Total Campaign Budget */}
                    <FormField
                      control={form.control}
                      name="totalCampaignBudget"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%]">
                            {t('fields.totalCampaignBudget')}
                          </FormLabel>
                          <div className="flex items-center w-full border border-border rounded-xs focus-within:border-primary">
                            <FormControl>
                              <NumberInput
                                placeholder={t('placeholders.totalBudget')}
                                className="!h-12 border-none"
                                {...field}
                              />
                            </FormControl>
                            <FormField
                              control={form.control}
                              name="totalCampaignBudgetCurrency"
                              render={({ field: currencyField }) => (
                                <FormItem>
                                  <FormControl>
                                    <Select
                                      onValueChange={currencyField.onChange}
                                      value={currencyField.value}
                                    >
                                      <SelectTrigger className="w-[80px] sm:w-[108px] !h-12 !border-l border-r-0 border-t-0 border-b-0 hover:border-border focus:border-border text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {PayTokens.map((t) => (
                                          <SelectItem key={t.symbol} value={t.symbol}>
                                            <span className="flex items-center gap-1 text-sm">
                                              <Image
                                                src={t.logo}
                                                alt={t.symbol}
                                                width={16}
                                                height={16}
                                              />
                                              {t.symbol}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Campaign Budget Optimization */}
                    <FormField
                      control={form.control}
                      name="campaignBudgetOptimization"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-sm text-foreground leading-[140%]">
                              <span>{t('fields.campaignBudgetOptimization')}</span>
                              <InfoIcon className="w-4 h-4 text-muted-foreground ml-1" />
                            </FormLabel>
                          </div>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <span
                              className={cn(
                                'text-sm',
                                field.value ? 'text-foreground' : 'text-muted-foreground'
                              )}
                            >
                              {field.value ? t('states.on') : t('states.off')}
                            </span>
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Daily Campaign Budget */}
                    <FormField
                      control={form.control}
                      name="dailyCampaignBudget"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <FormLabel className="text-sm text-foreground leading-[140%]">
                              {t('fields.dailyCampaignBudget')}
                            </FormLabel>
                            <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">i</span>
                            </div>
                          </div>
                          <div className="flex items-center w-full border border-border rounded-xs focus-within:border-primary">
                            <FormControl>
                              <NumberInput
                                placeholder={t('placeholders.dailyBudget')}
                                className="!h-12 border-none"
                                {...field}
                              />
                            </FormControl>
                            <FormField
                              control={form.control}
                              name="dailyCampaignBudgetCurrency"
                              render={({ field: currencyField }) => (
                                <FormItem>
                                  <FormControl>
                                    <Select
                                      onValueChange={currencyField.onChange}
                                      value={currencyField.value}
                                    >
                                      <SelectTrigger className="w-[80px] sm:w-[108px] !h-12 !border-l border-r-0 border-t-0 border-b-0 hover:border-border focus:border-border text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {PayTokens.map((t) => (
                                          <SelectItem key={t.symbol} value={t.symbol}>
                                            <span className="flex items-center gap-1 text-sm">
                                              <Image
                                                src={t.logo}
                                                alt={t.symbol}
                                                width={16}
                                                height={16}
                                              />
                                              {t.symbol}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {address && (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="text-foreground text-sm">{t('sections.payment')}</div>
                          <div className="text-xs text-muted-foreground">
                            {t('descriptions.connected')} {address}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 w-full sm:w-[180px] border-[#E88B00] bg-white text-[#E88B00] hover:bg-[#E88B00]/10 hover:text-[#E88B00]/90"
                          >
                            {t('buttons.payAmount')}
                          </Button>
                          <div className="text-xs text-muted-foreground underline decoration-dashed cursor-pointer hover:text-muted-foreground/90 text-center sm:text-left">
                            {t('buttons.withdraw')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Or Separator */}
                    <div
                      className={cn(
                        'flex items-center gap-4',
                        address ? 'mt-[80px]' : 'mt-[150px]'
                      )}
                    >
                      <div className="flex-1 h-px bg-border"></div>
                      <span className="text-sm text-foreground">{t('separators.or')}</span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>

                    {/* Promote Later Option */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-[80px]">
                      <span className="text-xl text-foreground">{t('descriptions.promoteIt')}</span>
                      <button
                        type="button"
                        className="text-xl text-[#06A17E] underline hover:text-[#06A17E]/80"
                      >
                        {t('buttons.promoteInCampaigns')}
                      </button>
                    </div>
                  </div>

                  {!address && (
                    <div className="flex flex-col gap-6 mt-6 lg:mt-0 lg:ml-[100px]">
                      <div className="flex flex-col gap-9">
                        <h3 className="text-sm font-medium text-foreground">
                          {t('sections.subtotal')}
                        </h3>
                        <div className="flex flex-col gap-[18px]">
                          <div className="flex justify-between gap-8">
                            <span className="text-sm text-foreground">
                              {t('costs.promotionBudget')}
                            </span>
                            <span className="text-sm text-foreground">
                              {t('costs.promotionAmount')}
                            </span>
                          </div>
                          <div className="flex justify-between gap-8">
                            <span className="text-sm text-foreground">
                              {t('costs.researchAuditingFee')}
                            </span>
                            <span className="text-sm text-foreground">
                              {t('costs.auditingAmount')}
                            </span>
                          </div>
                          <div className="flex justify-end pt-7 border-t border-border">
                            <span className="text-xl text-foreground">
                              {t('costs.totalAmount')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <h3 className="text-sm text-foreground">{t('sections.payment')}</h3>
                        <Button
                          onClick={handleConnectWallet}
                          type="button"
                          variant="outline"
                          className="h-10 px-4 sm:px-6 w-full border-[#06A17E] bg-white text-[#06A17E] hover:bg-[#06A17E]/10 hover:text-[#06A17E]/90"
                        >
                          {t('buttons.connectWallet')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtotal and Payment */}
              </>
            )}

            {/* Form Bottom Buttons */}
            <div className="border-t border-border px-4 sm:px-6 py-4 mt-auto">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center justify-center gap-2 h-10 px-4 sm:px-6 w-full sm:w-auto border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={handlePrevStep}
                    >
                      <Image src="/icons/arrow-left.svg" alt="arrow-right" width={16} height={16} />
                      {t('buttons.prevStep')}
                    </Button>
                  )}
                  {currentStep < 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center justify-center gap-2 h-10 px-4 sm:px-6 w-full sm:w-auto border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={handleNextStep}
                    >
                      {t('buttons.nextStep')}
                      <Image
                        src="/icons/arrow-left.svg"
                        alt="arrow-right"
                        className="rotate-180"
                        width={16}
                        height={16}
                      />
                    </Button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'h-10 px-4 sm:px-6 w-full sm:w-auto border-primary bg-white text-primary hover:bg-primary/10 hover:text-primary/90',
                      currentStep > 0 ? 'block' : 'hidden'
                    )}
                    disabled={isPending}
                    onClick={form.handleSubmit(onSubmitWithStatus('draft'))}
                  >
                    {isPending && submitDataStatus === 'draft'
                      ? t('buttons.saving')
                      : t('buttons.saveExit')}
                  </Button>
                  <Button
                    type="submit"
                    className={cn(
                      'h-10 px-4 sm:px-6 w-full sm:w-auto bg-primary text-white hover:bg-primary/90',
                      currentStep > 0 ? 'block' : 'hidden'
                    )}
                    disabled={isPending}
                  >
                    {isPending && submitDataStatus === 'published'
                      ? t('buttons.publishing')
                      : t('buttons.directPublish')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

function RequiredStart() {
  return <span className="text-destructive">*</span>;
}

type SelectedChipsProps = {
  values: string[];
  onRemove: (val: string) => void;
};

function SelectedChips({ values, onRemove }: SelectedChipsProps) {
  const t = useTranslations('ArticleForm');

  if (values.length === 0)
    return (
      <div className="text-sm text-muted-foreground h-12 flex items-center">{t('states.none')}</div>
    );

  return (
    <div className="flex flex-wrap gap-[10px]">
      {values.map((tag) => (
        <button
          type="button"
          key={tag}
          className="p-[10px] text-xs bg-[#F5F6F7] text-foreground flex items-center gap-1"
          onClick={() => onRemove(tag)}
        >
          {tag}
          <X className="w-4 h-4 cursor-pointer" />
        </button>
      ))}
    </div>
  );
}
