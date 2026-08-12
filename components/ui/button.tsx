import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import clsx from 'clsx';

export function Button({ className, ...props }: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return <button className={clsx('btn-primary disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />;
}
