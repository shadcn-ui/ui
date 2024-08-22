import { Skeleton } from '@/registry/default/ui/skeleton';

export default function SkeletonWrapper() {
  return (
    <div className="flex flex-col text-start space-x-2 space-y-3">
      <Skeleton>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        felis tellus, efficitur id convallis a, viverra eget libero. Nam magna
        erat, fringilla sed commodo sed, aliquet nec magna.
      </Skeleton>
      <Skeleton loading={false}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
        felis tellus, efficitur id convallis a, viverra
      </Skeleton>
    </div>
  );
}
