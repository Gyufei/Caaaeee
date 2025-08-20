import { Check, Search } from 'lucide-react';

import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';

import { type Tag, useArticlesTags } from '@/lib/api/use-articles-tags';

type TagInputProps = {
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
};

export function TagSearchInput({ values, onChange, placeholder = 'Search...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useArticlesTags();

  const suggestions = useMemo(() => {
    const allTags: Tag[] = data?.data ?? [];
    const keyword = inputValue.trim().toLowerCase();
    const base = keyword ? allTags.filter((t) => t.name.toLowerCase().includes(keyword)) : allTags;
    // 不再过滤已选中的项，选中后继续展示，并在右侧显示对勾
    return base;
  }, [data?.data, inputValue]);

  function handleSelect(tagName: string) {
    // 点击切换选中/取消选中
    if (values.includes(tagName)) {
      onChange(values.filter((v) => v !== tagName));
    } else {
      onChange([...values, tagName]);
    }
    setOpen(true);
  }

  return (
    <div className="relative text-sm w-[400px]">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#909399]">
        <Search className="w-5 h-5" />
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="pl-10 pr-4 h-12 py-[14px] rounded-none focus:outline-none"
            aria-autocomplete="list"
          />
        </PopoverAnchor>
        <PopoverContent
          className="p-0 w-[400px]"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div id="tag-suggestions" role="listbox" className="max-h-64 overflow-auto">
            {isLoading && <div className="px-3 py-2 text-sm text-[#909399]">Loading...</div>}
            {!isLoading && suggestions.length === 0 && (
              <div className="px-3 py-2 text-sm text-[#909399]">
                {inputValue.trim() ? 'No results' : 'Type to search'}
              </div>
            )}
            {!isLoading && suggestions.length > 0 && (
              <ul className="py-1">
                {suggestions.map((t) => {
                  const isSelected = values.includes(t.name);
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        className={`w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${isSelected ? '' : ''}`}
                        onClick={() => handleSelect(t.name)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{t.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#06A17E]" />}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {/* {inputValue.trim() && !values.includes(inputValue.trim()) && (
              <div className="border-t">
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm text-[#06A17E] hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelect(inputValue.trim())}
                >
                  Create &quot;{inputValue.trim()}&quot;
                </button>
              </div>
            )} */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
