import { createRoot, Root } from 'react-dom/client';
import { useRef } from 'react';
import { InitDetail } from 'lightgallery/lg-events';
import LG, { GalleryItem } from './index';

const CONTAINER_ID = 'LIGHT_GALLERY_WRAPPER';

let lightGalleryContainer: Root | null = null;

function LightGalleryWrapper(props: { index: number; items: GalleryItem[] }) {
  const lightGalleryRef = useRef<any>(null);

  const handleInit = (detail: InitDetail) => {
    lightGalleryRef.current = detail.instance;
    lightGalleryRef.current?.openGallery(props.index);
  };

  const handleAfterClose = () => {
    lightGalleryRef.current?.destroy();
    lightGalleryContainer?.unmount();
    document.getElementById(CONTAINER_ID)?.remove();
  };

  return <LG items={props.items} onInit={handleInit} onAfterClose={handleAfterClose} />;
}
export default function openLg(index: number, items: GalleryItem[]) {
  const div = document.createElement('div');
  div.id = CONTAINER_ID;
  document.body!.append(div);
  const root = createRoot(div);
  lightGalleryContainer = root;
  root.render(<LightGalleryWrapper index={index} items={items} />);
}
