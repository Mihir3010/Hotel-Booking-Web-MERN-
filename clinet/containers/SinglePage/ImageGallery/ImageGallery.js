import React from 'react';
import ImageGallery from 'react-image-gallery';
import ImageGalleryWrapper from './ImageGallery.style';

const images = [
  {
    original: '/images/post-image-1.jpg',
    thumbnail: '/images/post-image-1.jpg',
  },
  {
    original: '/images/1.webp',
    thumbnail: '/images/1.webp',
  },
  {
    original: '/images/7.jpg',
    thumbnail: '/images/7.jpg',
  },
  {
    original: '/images/3.jpg',
    thumbnail: '/images/3.jpg',
  },
  {
    original: '/images/4.webp',
    thumbnail: '/images/4.webp',
  },
  {
    original: '/images/5.webp',
    thumbnail: '/images/5.webp',
  },
  {
    original: '/images/6.jpg',
    thumbnail: '/images/6.jpg',
  },
];

const PostImageGallery = () => {
  return (
    <ImageGalleryWrapper>
      <ImageGallery
        items={images}
        showPlayButton={false}
        showFullscreenButton={false}
        showIndex={true}
        lazyLoad={true}
        slideDuration={550}
      />
    </ImageGalleryWrapper>
  );
};

export default PostImageGallery;
