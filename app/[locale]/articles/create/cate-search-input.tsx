import { Check, Search } from 'lucide-react';

import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';

import { type Category, useArticlesCates } from '@/lib/api/use-articles-cates';

type CateInputProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

export function CateSearchInput({ value, onChange, placeholder = 'Search...' }: CateInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { data, isLoading } = useArticlesCates();

  const suggestions = useMemo(() => {
    const allCates: Category[] = data?.data ?? [];
    const keyword = inputValue.trim().toLowerCase();

    if (keyword) {
      const matched = allCates.filter((c) => c.name.toLowerCase().includes(keyword));
      const selected = allCates.filter((c) => value === c.name);

      const combined = [...matched];
      selected.forEach((cate) => {
        if (!combined.find((c) => c.id === cate.id)) {
          combined.push(cate);
        }
      });

      return combined;
    } else {
      return allCates;
    }
  }, [data?.data, inputValue, value]);

  const showSuggestions = isFocused;

  function handleSelect(cateName: string) {
    onChange(cateName);
    setInputValue('');
    setIsFocused(false);
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    if (inputValue.trim() === '') {
      setIsFocused(false);
    }
  }

  return (
    <div className="relative text-sm w-[400px]">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="w-5 h-5" />
      </span>
      <Input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="pl-10 pr-4 h-12 py-[14px] rounded-xs focus:outline-none"
        aria-autocomplete="list"
      />

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 bg-popover text-popover-foreground border shadow-md mt-1">
          <div id="cate-suggestions" role="listbox" className="max-h-64 overflow-auto">
            {isLoading && <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>}
            {!isLoading && suggestions.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {inputValue.trim() ? 'No results' : 'Start typing to search'}
              </div>
            )}
            {!isLoading && suggestions.length > 0 && (
              <ul className="py-1">
                {suggestions.map((c) => {
                  const isSelected = value === c.name;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        className={`w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${isSelected ? '' : ''}`}
                        onClick={() => handleSelect(c.name)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{c.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#06A17E]" />}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


