'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { FormStep } from '@/components/common/form-step';
import Upload from '@/components/common/upload';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  contentBody: z.string().min(1, 'Please enter article content'),
  subTitle: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

type ArticleFormData = z.infer<typeof formSchema>;

export default function CreateArticle() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      country: '',
      city: '',
      twitterUsername: '',
      assetType: 'token-symbol',
      assetValue: '',
      relatedPlatform: 'none',
      fullName: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      articleTitle: '',
      featuredImage: '',
      contentBody: '',
      subTitle: '',
      tags: [],
      categories: [],
    },
  });

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
      const result = await form.trigger(['articleTitle', 'contentBody']);
      if (!result) {
        toast.error('Please fill in all required fields');
      }
      return result;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data: ArticleFormData) => {
    console.log('Form data:', data);
    // 处理表单提交逻辑
  };

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
          <div className="mt-[10px] text-xl leading-[140%] text-[#909399]">Entry ID: dtse-812</div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[400px] !h-12">
                                <SelectValue placeholder="Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-[400px] !h-12">
                                <SelectValue placeholder="City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new-york">New York</SelectItem>
                              <SelectItem value="london">London</SelectItem>
                              <SelectItem value="toronto">Toronto</SelectItem>
                              <SelectItem value="sydney">Sydney</SelectItem>
                            </SelectContent>
                          </Select>
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
                    <p className="text-sm text-[#909399]">
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
                          <Button variant="outline" className="flex items-center gap-2 h-12">
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
                              : 'text-[#909399] hover:text-foreground'
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
                              : 'text-[#909399] hover:text-foreground'
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
                              : 'text-[#909399] hover:text-foreground'
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
                              minWidth={1024}
                              className="border border-dashed p-6 w-[640px]"
                              tipContent={
                                <div className="text-xs text-center text-[#909399]">
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
                    <p className="text-sm text-[#909399]">
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
                      <TagSearchInput
                        values={form.watch('tags') ?? []}
                        onChange={(vals) => form.setValue('tags', vals)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-[#06A17E]">Include</div>
                      <SelectedChips
                        values={form.watch('categories') ?? []}
                        onRemove={(val) => {
                          const next = (form.watch('categories') ?? []).filter((t) => t !== val);
                          form.setValue('categories', next);
                        }}
                      />
                    </div>
                  </div>
                </div>
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
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 px-6 border-main bg-white text-main hover:bg-main/10 hover:text-main/90"
                  >
                    Save & Exit
                  </Button>
                  <Button type="submit" className="h-10 px-6 bg-main text-white hover:bg-main/90">
                    Direct Publish
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
    return <div className="text-sm text-[#909399] h-12 flex items-center">None</div>;

  return (
    <div className="flex flex-wrap gap-2 h-12">
      {values.map((tag) => (
        <button
          type="button"
          key={tag}
          className="px-2 py-1 text-xs bg-[#F5F6F7] text-foreground flex items-center gap-1"
          onClick={() => onRemove(tag)}
        >
          {tag} <span className="text-[#909399]">×</span>
        </button>
      ))}
    </div>
  );
}
