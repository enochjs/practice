import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
} from "react";
import LightGallery, { LightGalleryProps } from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgVideo from "lightgallery/plugins/video";
import lgZoom from "lightgallery/plugins/zoom";
import lgFull from "lightgallery/plugins/fullscreen";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgRotate from "lightgallery/plugins/rotate";
import { createPortal } from "react-dom";

type DynamicEl = NonNullable<LightGalleryProps["dynamicEl"]>;
type GalleryItem = DynamicEl[number];

/** 你可能需要不同的渲染视图, 可以传入不同的type去匹配 */
const RenderItem = (item: GalleryItem) => {
  const { src, thumb, subHtml, size, title, responsive } = item;

  /** 处理缩略图显示 */
  const thumbUrl = useMemo(() => {
    if (thumb) return thumb;

    const isOss = src && (src.includes("oss-cn") || src.includes("oss-cloud"));
    return isOss
      ? `${src}?x-oss-process=image/resize,w_288/quality,q_100`
      : src;
  }, [src, thumb]);

  return (
    <div
      data-lg-size={size}
      data-src={src}
      data-thumb={thumb}
      data-title={title}
      data-sub-html={subHtml}
      data-responsive={responsive}
      data-lg-background-color="rgba(0,0,0,0.85)"
      className=" w-24 h-24 rounded-8 overflow-hidden cursor-pointer"
    >
      <img
        className=" w-full h-full object-cover"
        src={thumbUrl}
        alt={subHtml}
      />
    </div>
  );
};

/** 图片预览组件 */
const Lg = forwardRef(
  (
    {
      items,
      children,
      ...restProps
    }: LightGalleryProps & { items?: DynamicEl },
    ref,
  ) => {
    const lightGalleryRef = useRef<any>(null);

    const onInit = useCallback(
      (detail: Parameters<NonNullable<LightGalleryProps["onInit"]>>[0]) => {
        if (detail) {
          lightGalleryRef.current = detail.instance;
        }
      },
      [],
    );

    const getItems = useCallback(() => {
      return items?.map((item, index) => (
        <RenderItem key={item.id || index} {...item} />
      ));
    }, [items]);

    useImperativeHandle(ref, () => lightGalleryRef.current);

    return (
      <LightGallery
        onInit={onInit}
        plugins={[lgZoom, lgThumbnail, lgFull, lgVideo, lgAutoplay, lgRotate]}
        infiniteZoom
        showZoomInOutIcons
        actualSize={false}
        closeOnTap
        mousewheel
        elementClassNames=" flex items-start flex-wrap gap-4"
        {...restProps}
      >
        {children || getItems()}
      </LightGallery>
    );
  },
);

Lg.displayName = "LightGallery";

export default Lg;
