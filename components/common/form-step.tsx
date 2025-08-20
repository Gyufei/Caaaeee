import { Check } from 'lucide-react';

import React from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

interface FormStepProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const FormStep: React.FC<FormStepProps> = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {/* 步骤圆圈和标签 */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-sm font-medium',
                  index < currentStep && 'bg-main text-white',
                  index === currentStep && 'bg-foreground text-white',
                  index > currentStep && 'bg-[#F5F6F7] text-[#909399]'
                )}
              >
                {index < currentStep ? <Check className="w-3 h-3 text-white" /> : <>{index + 1}</>}
              </div>
              <span
                className={cn(
                  'text-sm font-medium whitespace-nowrap',
                  index < currentStep && 'text-main',
                  index === currentStep && 'text-foreground',
                  index > currentStep && 'text-[#909399]'
                )}
              >
                {step}
              </span>
            </div>
          </div>

          {/* 连接线（除了最后一个步骤） */}
          {index < steps.length - 1 && (
            <div className="flex items-center mx-4">
              <Image
                src={index < currentStep ? '/icons/long-arrow-main.svg' : '/icons/long-arrow.svg'}
                alt="arrow"
                width={65}
                height={1}
                className="h-4 w-[65px]"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// 使用示例：
//
// import { FormStep } from '@/components/common/form-step';
//
// // 在组件中使用
// const MyComponent = () => {
//   const steps = ['Basic Fields', 'Content Body', 'Promotion'];
//   const [currentStep, setCurrentStep] = useState(0);
//
//   return (
//     <div className="p-6">
//       <FormStep
//         steps={steps}
//         currentStep={currentStep}
//         className="mb-8"
//       />
//
//       {/* 其他表单内容 */}
//     </div>
//   );
// };
