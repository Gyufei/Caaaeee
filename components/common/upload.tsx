'use client';

import { toast } from 'sonner';

import React, { useRef, useState } from 'react';

import NextImage from 'next/image';

import { cn } from '@/lib/utils';

// 上传状态类型
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

interface UploadProps {
  uploadFn?: (file: File, onProgress: (percent: number) => void) => Promise<string>;
  value?: string;
  onChange?: (url?: string) => void;
  minWidth?: number;
  className?: string;
  tipContent: React.ReactNode;
}

export default function Upload({
  uploadFn,
  value,
  onChange,
  minWidth,
  className,
  tipContent,
}: UploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState<string | undefined>(value);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 默认上传函数（模拟，需替换为真实 S2 上传）
  const defaultUploadFn = async (file: File, onProgress: (percent: number) => void) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        let percent = 0;
        const interval = setInterval(() => {
          percent += 10;
          onProgress(percent);
          if (percent >= 100) {
            clearInterval(interval);
            resolve(reader.result as string);
          }
        }, 50);
      };
      reader.readAsDataURL(file);
    });
  };

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
            toast.error(`Image must be at least ${minWidth} width`);
            return;
          }

          // 检查宽高比是否为 1:1
          if (img.width !== img.height) {
            toast.error('Image must have a 1:1 aspect ratio (square)');
            return;
          }

          // 验证通过，上传图片到服务器
          // uploadImage(file);
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
    try {
      const url = await (uploadFn || defaultUploadFn)(file, setProgress);
      setImgUrl(url);
      setStatus('done');
      onChange?.(url);
    } catch {
      setStatus('error');
      setProgress(0);
    }
  };

  const handleClick = () => {
    if (status === 'uploading') return;
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
        'relative flex flex-col items-center justify-center border border-border rounded-xs cursor-pointer transition-all',
        status === 'uploading' ? 'opacity-80' : '',
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
        disabled={status === 'uploading'}
      />
      {/* 未上传 */}
      {!imgUrl && status !== 'uploading' && (
        <div className={cn('flex flex-col items-center justify-center select-none gap-2')}>
          <NextImage src="/icons/upload.svg" alt="upload" width={48} height={48} />
          <div className="mt-2 text-sm text-[#3D3D3D]">Click To Upload</div>
          {tipContent}
        </div>
      )}
      {/* 上传中 */}
      {status === 'uploading' && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="mt-2 text-xs text-gray-400">Uploading... {progress}%</div>
        </div>
      )}
      {/* 已上传 */}
      {imgUrl && status !== 'uploading' && (
        <div className="w-full h-full relative">
          {/* 图片展示 */}
          <NextImage
            src={imgUrl}
            alt="uploaded"
            fill
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
          {/* hover 浮层 */}
          {hovered && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 rounded-lg">
              <button
                className="px-3 py-1 bg-white/90 text-primary rounded text-xs font-medium hover:bg-white"
                onClick={handleReplace}
              >
                重新上传
              </button>
              <button
                className="px-3 py-1 bg-red-500/90 text-white rounded text-xs font-medium hover:bg-red-600"
                onClick={handleRemove}
              >
                删除图片
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
