import { useRouter } from '@/i18n/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePrivy } from '@privy-io/react-auth';
import { Check, ChevronsUpDown, InfoIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { z } from 'zod';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useLocale } from 'next-intl';
import Image from 'next/image';

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

// 定义表单验证模式
const formSchema = z.object({
  // step 0
  country: z.string().min(1, 'Please select a country/state'),
  city: z.string().min(1, 'Please select a city'),
  twitterUsername: z.string().min(1, 'Please enter your Twitter username'),
  assetType: z.enum(['token-symbol', 'crypto-ticker', 'contract-address']),
  assetValue: z.string().optional(),
  relatedPlatform: z.enum(['none', 'uniswap', 'pancakeswap', 'sushiswap']),
  fullName: z.string().min(1, 'Please enter your full name'),
  title: z.string().optional(),
  company: z.string().optional(),
  email: z.email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional(),

  // step 1
  articleTitle: z.string().min(1, 'Please enter article title'),
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

type ArticleFormData = z.infer<typeof formSchema>;

export default function CreateArticle({ initFormData }: { initFormData?: ContentDetailData }) {
  const locale = useLocale();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { data: countryCityData, isLoading: isCountryCityLoading } = useCountryCity();
  const { mutateAsync: saveContent, isPending } = useSaveContent();

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

  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 0) {
      const result = await form.trigger(['country', 'city', 'twitterUsername', 'fullName']);
      if (!result) {
        toast.error('Please fill in all required fields');
      }
      return result;
    }

    if (step === 1) {
      const result = await form.trigger(['articleTitle']);
      if (!result) {
        toast.error('Please fill in all required fields');
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
      const message = e instanceof Error ? e.message : 'Submit failed';
      toast.error(message);
    }
  };

  const handleConnectWallet = () => {
    connectWallet();
  };

  function checkImage(image: HTMLImageElement) {
    if (image.width < 1024) {
      toast.error('Image must be at least 1024px width');
      return false;
    }

    if (image.width !== image.height) {
      toast.error('Image must have a 1:1 aspect ratio (square)');
      return false;
    }
    return true;
  }

  return (
    <div className="flex-1 flex-col">
      <div className="flex items-center justify-between px-6 h-14 border-b border-border">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack}>
          <Image src="/icons/arrow-left.svg" alt="arrow-left" width={20} height={20} />
          <span className="text-sm font-medium text-foreground leading-[140%]">Back</span>
        </div>
        <FormStep steps={['Basic Fields', 'Content Body', 'Promotion']} currentStep={currentStep} />
      </div>
      <div className="flex-col">
        <div className="py-8 px-6">
          <div className="text-foreground leading-[140%] text-5xl">Create Article</div>
          {initFormData?.entry_id && (
            <div className="mt-[10px] text-xl leading-[140%] text-muted-foreground">
              Entry ID: {initFormData.entry_id}
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitWithStatus('published'))}>
            {currentStep === 0 && (
              <>
                {/* Location Section */}
                <div className="px-6 py-5 flex flex-col gap-5">
                  <h3 className="text-base font-medium text-foreground">Location</h3>
                  <div className="flex items-start gap-5">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            Country / State
                            <RequiredStart />
                          </FormLabel>
                          <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={countryOpen}
                                className="w-[400px] justify-between !h-12"
                                disabled={isCountryCityLoading}
                              >
                                {field.value ? (
                                  field.value
                                ) : isCountryCityLoading ? (
                                  <span className="text-muted-foreground">Loading...</span>
                                ) : (
                                  <span className="text-muted-foreground">Country</span>
                                )}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                              <Command>
                                <CommandInput placeholder="Search country..." className="h-9" />
                                <CommandList>
                                  <CommandEmpty>No data</CommandEmpty>
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
                            City
                            <RequiredStart />
                          </FormLabel>
                          <Popover open={cityOpen} onOpenChange={setCityOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={cityOpen}
                                className="w-[400px] justify-between !h-12"
                                disabled={isCountryCityLoading || !form.watch('country')}
                              >
                                {field.value ? (
                                  field.value
                                ) : isCountryCityLoading ? (
                                  <span className="text-muted-foreground">Loading...</span>
                                ) : !form.watch('country') ? (
                                  <span className="text-muted-foreground">
                                    Please select a country first
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">City</span>
                                )}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                              <Command>
                                <CommandInput placeholder="Search city..." className="h-9" />
                                <CommandList>
                                  <CommandEmpty>No data</CommandEmpty>
                                  <CommandGroup>
                                    {countryCityData &&
                                      form.watch('country') &&
                                      (countryCityData[form.watch('country')] ?? []).map(
                                        (city, index) => (
                                          <CommandItem
                                            key={index + city}
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
                                        )
                                      )}
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
                <div className="px-6 py-5 flex flex-col gap-5 border-t border-border">
                  <div className="flex items-center gap-[10px]">
                    <h3 className="text-base font-medium text-foreground">Social Media</h3>
                    <p className="text-sm text-muted-foreground">
                      Add handle and hashtags to include in our socialmedia post for your press
                      release.
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="twitterUsername"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                          Twitter Username
                          <RequiredStart />
                        </FormLabel>
                        <div className="flex w-[400px]">
                          <div className="relative">
                            <span className="absolute top-[14px] left-4 text-sm text-foreground leading-[140%]">
                              https://x.com/
                            </span>
                            <FormControl>
                              <Input
                                placeholder="| yourid"
                                className="flex-1 pl-[120px] h-12"
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
                            className="flex items-center gap-2 h-12"
                          >
                            <Image src="/icons/twitter.svg" alt="twitter" width={20} height={20} />
                            Connect
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Related Asset Info Section */}
                <div className="px-6 py-5 flex flex-col gap-5 border-t border-border">
                  <h3 className="text-base font-medium text-foreground">Related Asset Info</h3>
                  <div className="flex items-end gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="w-fit flex gap-1 p-1 bg-[#F5F6F7] rounded-md">
                        <button
                          type="button"
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                            form.watch('assetType') === 'token-symbol'
                              ? 'bg-white text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          onClick={() => form.setValue('assetType', 'token-symbol')}
                        >
                          Token Symbol
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                            form.watch('assetType') === 'crypto-ticker'
                              ? 'bg-white text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          onClick={() => form.setValue('assetType', 'crypto-ticker')}
                        >
                          Crypto Ticker
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                            form.watch('assetType') === 'contract-address'
                              ? 'bg-white text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                          onClick={() => form.setValue('assetType', 'contract-address')}
                        >
                          Contract Address
                        </button>
                      </div>
                      <FormField
                        control={form.control}
                        name="assetValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={`Enter ${form.watch('assetType') === 'token-symbol' ? 'Token Symbol' : form.watch('assetType') === 'crypto-ticker' ? 'Crypto Ticker' : 'Contract Address'}`}
                                className="w-[600px] !h-12"
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
                            Related Platform
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[200px] !h-12">
                                <SelectValue placeholder="Select Platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="uniswap">Uniswap</SelectItem>
                              <SelectItem value="pancakeswap">PancakeSwap</SelectItem>
                              <SelectItem value="sushiswap">SushiSwap</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Section */}
                <div className="px-6 py-5 flex flex-col gap-5 border-t border-border">
                  <h3 className="text-base font-medium text-foreground">Contact</h3>
                  <div className="flex items-start gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            Full Name
                            <RequiredStart />
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" className="w-[400px] !h-12" {...field} />
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
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Title" className="w-[400px] !h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-start gap-5">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            Company
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Company Name"
                              className="w-[400px] !h-12"
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
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              type="email"
                              className="w-[400px] !h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-5">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Phone Number"
                              type="tel"
                              className="w-[400px] !h-12"
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
                <div className="px-6 py-5 flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="articleTitle"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                          Article Title
                          <RequiredStart />
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Title" className="w-[640px] !h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Featured Image */}
                <div className="px-6 py-5 flex flex-col gap-2">
                  <h3 className="text-base font-medium text-foreground">Featured Image</h3>
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormControl>
                          <div className="w-full max-w-[640px]">
                            <Upload
                              value={field.value}
                              onChange={field.onChange}
                              checkFunc={checkImage}
                              className="border border-dashed p-6 w-[640px]"
                              tipContent={
                                <div className="text-xs text-center text-muted-foreground">
                                  <div>Minimal width: 1024px</div>
                                  <div>Recommended size: 1200x720px</div>
                                  <div>Please use 15:9 ratio to avoid cropping</div>
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
                <div className="px-6 py-5 flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-medium text-foreground">Article Content</h3>
                    <p className="text-sm text-muted-foreground">
                      Featured image & Title & Contacts - Will Be Added Automatically
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="contentBody"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormControl>
                          <textarea
                            placeholder="Type in the best bress release ever createa"
                            className="w-[640px] h-[320px] border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none hover:border-[#575657] focus-visible:border-[#06A17E] focus-visible:text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sub Title */}
                <div className="px-6 py-5 mt-[10px] flex flex-col">
                  <FormField
                    control={form.control}
                    name="subTitle"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel className="text-sm text-foreground leading-[140%] capitalize">
                          Sub Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Title" className="w-[640px] !h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tag */}
                <div className="px-6 py-5 flex flex-col gap-2">
                  <div className="flex items-center gap-5">
                    <div>
                      <div className="text-sm text-foreground leading-[140%] mb-2">Tag</div>
                      <TagSearchInput
                        values={form.watch('tags') ?? []}
                        onChange={(vals) => form.setValue('tags', vals)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-[#06A17E]">Include</div>
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
                <div className="px-6 py-5 flex flex-col gap-2">
                  <div className="flex items-center gap-5">
                    <div>
                      <div className="text-sm text-foreground leading-[140%] mb-2">Category</div>
                      <CateSearchInput
                        value={form.watch('category') ?? ''}
                        onChange={(val) => form.setValue('category', val)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-[#06A17E]">Include</div>
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
                <div className="px-6 py-5 flex justify-start border-t border-border">
                  <div className="flex flex-col gap-[30px]">
                    {/* Total Campaign Budget */}
                    <FormField
                      control={form.control}
                      name="totalCampaignBudget"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-foreground leading-[140%]">
                            Total campaign budget
                          </FormLabel>
                          <div className="flex items-center w-[640px] border border-border rounded-xs focus-within:border-primary">
                            <FormControl>
                              <NumberInput
                                placeholder="None"
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
                                      <SelectTrigger className="w-[108px] !h-12 !border-l border-r-0 border-t-0 border-b-0 hover:border-border focus:border-border text-sm">
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
                              <span>Campaign budget optimization</span>
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
                              {field.value ? 'On' : 'Off'}
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
                              Daily campaign budget (optional)
                            </FormLabel>
                            <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">i</span>
                            </div>
                          </div>
                          <div className="flex items-center w-[640px] border border-border rounded-xs focus-within:border-primary">
                            <FormControl>
                              <NumberInput
                                placeholder="150.00"
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
                                      <SelectTrigger className="w-[108px] !h-12 !border-l border-r-0 border-t-0 border-b-0 hover:border-border focus:border-border text-sm">
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
                          <div className="text-foreground text-sm">Payment</div>
                          <div className="text-xs text-muted-foreground">Connected: {address}</div>
                        </div>
                        <div className="flex items-end gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 w-[180px] border-[#E88B00] bg-white text-[#E88B00] hover:bg-[#E88B00]/10 hover:text-[#E88B00]/90"
                          >
                            Pay 100 SOL
                          </Button>
                          <div className="text-xs text-muted-foreground underline decoration-dashed cursor-pointer hover:text-muted-foreground/90">
                            Withdraw
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
                      <span className="text-sm text-foreground">Or</span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>

                    {/* Promote Later Option */}
                    <div className="flex items-center gap-2 mb-[80px]">
                      <span className="text-xl text-foreground">Promote it later in</span>
                      <button
                        type="button"
                        className="text-xl text-[#06A17E] underline hover:text-[#06A17E]/80"
                      >
                        Campaigns
                      </button>
                    </div>
                  </div>

                  {!address && (
                    <div className="flex flex-col gap-6 ml-[100px]">
                      <div className="flex flex-col gap-9">
                        <h3 className="text-sm font-medium text-foreground">Subtotal</h3>
                        <div className="flex flex-col gap-[18px]">
                          <div className="flex justify-between gap-8">
                            <span className="text-sm text-foreground">Promotion Budget</span>
                            <span className="text-sm text-foreground">$20</span>
                          </div>
                          <div className="flex justify-between gap-8">
                            <span className="text-sm text-foreground">Research Auditing Fee</span>
                            <span className="text-sm text-foreground">$5</span>
                          </div>
                          <div className="flex justify-end pt-7 border-t border-border">
                            <span className="text-xl text-foreground">$200</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <h3 className="text-sm text-foreground">Payment</h3>
                        <Button
                          onClick={handleConnectWallet}
                          type="button"
                          variant="outline"
                          className="h-10 px-6 border-[#06A17E] bg-white text-[#06A17E] hover:bg-[#06A17E]/10 hover:text-[#06A17E]/90"
                        >
                          Connect Wallet
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtotal and Payment */}
              </>
            )}

            {/* Form Bottom Buttons */}
            <div className="border-t border-border px-6 py-4 mt-[100px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 h-10 px-6 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={handlePrevStep}
                    >
                      <Image src="/icons/arrow-left.svg" alt="arrow-right" width={16} height={16} />
                      Prev Step
                    </Button>
                  )}
                  {currentStep < 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 h-10 px-6 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={handleNextStep}
                    >
                      Next Step
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

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 px-6 border-primary bg-white text-primary hover:bg-primary/10 hover:text-primary/90"
                    disabled={isPending}
                    onClick={form.handleSubmit(onSubmitWithStatus('draft'))}
                  >
                    {isPending && submitDataStatus === 'draft' ? 'Saving...' : 'Save & Exit'}
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 px-6 bg-primary text-white hover:bg-primary/90"
                    disabled={isPending}
                  >
                    {isPending && submitDataStatus === 'published'
                      ? 'Publishing...'
                      : 'Direct Publish'}
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
  if (values.length === 0)
    return <div className="text-sm text-muted-foreground h-12 flex items-center">None</div>;

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
