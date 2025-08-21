import { Input } from '../ui/input';

interface NumberInputProps extends Omit<React.ComponentProps<typeof Input>, 'type' | 'onChange'> {
  onChange?: (value: string) => void;
  decimalPlaces?: number;
}

function NumberInput({ onChange, decimalPlaces = 18, ...props }: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      onChange?.('');
      return;
    }

    // 只允许数字和小数点
    const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);
    if (regex.test(value)) {
      if (value.includes('.')) {
        const [integerPart, decimalPart] = value.split('.');
        const integerPartStr = Number(integerPart).toString();

        return onChange?.(integerPartStr + '.' + decimalPart);
      }

      onChange?.(value);
    }
  };

  return (
    <Input type="text" inputMode="decimal" pattern="[0-9\.]*" onChange={handleChange} {...props} />
  );
}

export { NumberInput };
