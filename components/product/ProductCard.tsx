import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerKg: number;
  stockKg: number;
  catchLocation: string;
  imageUrl: string;
  categoryName: string;
};

export function ProductCard({ name, slug, description, pricePerKg, stockKg, catchLocation, imageUrl, categoryName }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-surface shadow-soft transition hover:-translate-y-1 hover:border-primary/50">
      <Link href={{ pathname: '/product/[slug]', query: { slug } }} className="block overflow-hidden rounded-t-[1.75rem] bg-surface-soft">
        <div className="relative h-52 w-full">
          <Image src={imageUrl} alt={name} fill className="object-cover transition duration-300 group-hover:scale-105" />
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted">
          <span>{categoryName}</span>
          <span>{stockKg > 0 ? 'Fresh' : 'Sold out'}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{name}</h3>
          <p className="mt-2 text-sm leading-6 text-muted line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">₹{pricePerKg}/kg</p>
            <p className="text-xs text-slate-400">{stockKg} kg available</p>
          </div>
          <Button disabled={stockKg === 0}>Add</Button>
        </div>
      </div>
    </article>
  );
}
