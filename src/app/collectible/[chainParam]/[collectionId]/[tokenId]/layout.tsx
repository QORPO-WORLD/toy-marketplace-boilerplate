import { Flex, cn } from '$ui';
import { BannerImage } from '../../../../_landing/Hero/BannerImage';
import Sidebar from './_layout/Sidebar';

const CollectableLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <Flex
    //   className={cn(
    //     '@container/collectibleViewContainer',
    //     'mx-auto my-12 h-fit min-h-screen w-full max-w-[1200px] flex-col gap-12',
    //   )}
    // >
    //   <Flex
    //     className={cn(
    //       '@4xl/collectibleViewContainer:gap-8 gap-6',
    //       '@4xl/collectibleViewContainer:flex-row flex-col sm:px-4',
    //     )}
    //   >
    //     <Sidebar />
    //     <Flex className="flex-1 flex-col">{children}</Flex>
    //   </Flex>
    // </Flex>
    <>{children}</>
  );
};

export default CollectableLayout;
