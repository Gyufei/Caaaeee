'use client';

import { toast } from 'sonner';

import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { useImageUpload } from '@/lib/api/use-image-upload';
import { cn } from '@/lib/utils';

// 上传状态类型
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

interface UploadProps {
  value?: string;
  onChange?: (url?: string) => void;
  minWidth?: number;
  className?: string;
  tipContent: React.ReactNode;
}

export default function Upload({ value, onChange, minWidth, className, tipContent }: UploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState<string | undefined>(value);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 使用图片上传hook
  const { uploadImage, isPending, isError } = useImageUpload((data) => {
    setImgUrl(data.url);
    setStatus('done');
    setProgress(100);
    onChange?.(data.url);
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 校验最小宽度
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();

        img.onload = () => {
          // 检查图片尺寸
          if (minWidth && img.width < minWidth) {
            toast.error(`Image must be at least ${minWidth}px width`);
            return;
          }

          // 验证通过，上传图片到服务器
          uploadImage(file);
        };

        img.onerror = () => {
          toast.error('Failed to load image. Please try again.');
        };

        img.src = reader.result as string;
      };
      reader.onerror = () => {
        toast.error('Failed to read file. Please try again.');
      };

      reader.readAsDataURL(file);
    } catch {
      toast.error('Failed to read image file');
      e.target.value = '';
      return;
    }

    setStatus('uploading');
    setProgress(0);

    // 模拟上传进度
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setProgress(percent);
      if (percent >= 90) {
        clearInterval(interval);
      }
    }, 100);
  };

  // 监听上传状态变化
  React.useEffect(() => {
    if (isPending) {
      setStatus('uploading');
    } else if (imgUrl && !isPending) {
      setStatus('done');
      setProgress(100);
    } else if (isError) {
      setStatus('error');
      setProgress(0);
    }
  }, [isPending, imgUrl, isError]);

  // 监听value prop变化
  useEffect(() => {
    setImgUrl(value);
    if (value) {
      setStatus('done');
      setProgress(100);
    } else {
      setStatus('idle');
      setProgress(0);
    }
  }, [value]);

  const handleClick = () => {
    if (status === 'uploading' || isPending) return;
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgUrl(undefined);
    setStatus('idle');
    setProgress(0);
    onChange?.(undefined);
  };

  const handleReplace = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center border border-border rounded-xs cursor-pointer transition-all h-[210px]',
        status === 'uploading' || isPending ? 'opacity-80' : '',
        'group',
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={status === 'uploading' || isPending}
      />
      {/* 未上传 */}
      {!imgUrl && status !== 'uploading' && !isPending && (
        <div className={cn('flex flex-col items-center justify-center select-none gap-2')}>
          <Image src="/icons/upload.svg" alt="upload" width={48} height={48} />
          <div className="mt-2 text-sm text-[#3D3D3D]">Click To Upload</div>
          {tipContent}
        </div>
      )}
      {/* 上传中 */}
      {(status === 'uploading' || isPending) && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-400">Uploading... {progress}%</div>
        </div>
      )}
      {/* 上传错误 */}
      {status === 'error' && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="text-red-500 text-sm mb-2">Upload failed</div>
          <button
            className="px-3 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90"
            onClick={handleClick}
          >
            Try Again
          </button>
        </div>
      )}
      {/* 已上传 */}
      {imgUrl && status !== 'uploading' && !isPending && (
        <div className="w-full h-full relative">
          {/* 图片展示 */}
          <Image
            src={imgUrl}
            alt="uploaded"
            fill
            unoptimized
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
          {/* hover 浮层 */}
          {hovered && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 rounded-lg">
              <button
                className="px-3 py-1 bg-white/90 text-primary rounded text-xs font-medium hover:bg-white"
                onClick={handleReplace}
              >
                Replace
              </button>
              <button
                className="px-3 py-1 bg-red-500/90 text-white rounded text-xs font-medium hover:bg-red-600"
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
