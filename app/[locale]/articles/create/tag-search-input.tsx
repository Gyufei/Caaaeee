import { Check, Search } from 'lucide-react';

import { useMemo, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';

import { Input } from '@/components/ui/input';

import { type Tag, useArticlesTags } from '@/lib/api/use-articles-tags';

type TagInputProps = {
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
};

export function TagSearchInput({ values, onChange, placeholder = 'Search...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data, isLoading } = useArticlesTags();

  const ref = useOnclickOutside(() => {
    setShowSuggestions(false);
  });

  const suggestions = useMemo(() => {
    const allTags: Tag[] = data?.data ?? [];
    const keyword = inputValue.trim().toLowerCase();

    if (keyword) {
      // 当有搜索关键词时，显示匹配的选项 + 已选中的选项
      const matchedTags = allTags.filter((t) => t.name.toLowerCase().includes(keyword));
      const selectedTags = allTags.filter((t) => values.includes(t.name));

      // 合并匹配的标签和已选中的标签，去重
      const combined = [...matchedTags];
      selectedTags.forEach((tag) => {
        if (!combined.find((t) => t.id === tag.id)) {
          combined.push(tag);
        }
      });

      return combined;
    } else {
      // 没有搜索关键词时，显示所有选项
      return allTags;
    }
  }, [data?.data, inputValue, values]);

  // 当输入框获得焦点时显示选项

  function handleSelect(tagName: string) {
    // 点击切换选中/取消选中
    if (values.includes(tagName)) {
      onChange(values.filter((v) => v !== tagName));
    } else {
      onChange([...values, tagName]);
    }
  }

  return (
    <div className="relative text-sm w-[400px]" ref={ref}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="w-5 h-5" />
      </span>
      <Input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onClick={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className="pl-10 pr-4 h-12 py-[14px] rounded-xs focus:outline-none"
        aria-autocomplete="list"
      />

      {/* 绝对定位的弹出框 */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 bg-popover text-popover-foreground border shadow-md mt-1">
          <div id="tag-suggestions" role="listbox" className="max-h-64 overflow-auto">
            {isLoading && <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>}
            {!isLoading && suggestions.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {inputValue.trim() ? 'No results' : 'Start typing to search'}
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
        </div>
      )}
    </div>
  );
}
