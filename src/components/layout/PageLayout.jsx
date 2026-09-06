import { forwardRef } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export const PageLayout = forwardRef(function PageLayout(
  { children, className = '', ...props },
  ref
) {
  return (
    <div ref={ref} className="min-h-screen flex flex-col bg-surface" {...props}>
      <Header />
      <main
        id="main-content"
        className={`flex-1 pt-16 ${className || ''}`}
        role="main"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
});

export default PageLayout;
