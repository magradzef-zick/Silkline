import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductGallery } from './ProductGallery';

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}));

describe('ProductGallery', () => {
  it('renders the first image with the product name as alt text', () => {
    render(<ProductGallery images={['/img1.jpg']} name="Test Dress" />);
    expect(screen.getByRole('img', { name: 'Test Dress' })).toBeInTheDocument();
  });

  it('falls back to the placeholder when images array is empty', () => {
    render(<ProductGallery images={[]} name="Test Dress" />);
    const img = screen.getByRole('img', { name: 'Test Dress' });
    expect(img.getAttribute('src')).toContain('placeholder');
  });

  it('renders thumbnail buttons when more than one image is provided', () => {
    render(<ProductGallery images={['/img1.jpg', '/img2.jpg']} name="Test Dress" />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('switches the main image when a thumbnail is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={['/img1.jpg', '/img2.jpg']} name="Test Dress" />);
    const thumbnails = screen.getAllByRole('button');
    await user.click(thumbnails[1]);
    // getAllByRole('img') — index 0 is main image, others are thumbnail images
    const mainImg = screen.getAllByRole('img')[0];
    expect(mainImg.getAttribute('src')).toBe('/img2.jpg');
  });
});
