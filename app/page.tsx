import Upload from '@/components/common/upload';

export default function Home() {
  return (
    <div className="flex-1">
      <div className="p-8">
        <div className="text-2xl font-bold">
          <Upload />
        </div>
      </div>
    </div>
  );
}
