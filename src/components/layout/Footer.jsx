import { forwardRef, memo } from 'react';

export const Footer = memo(
  forwardRef(function Footer(props, ref) {
    return (
      <footer
        ref={ref}
        className="bg-gray-50 border-t border-gray-200 py-8"
        {...props}
      >
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gray-500 text-sm text-center">
            Built with ❤️ for weekend adventures
          </p>
          <div className="mt-2 flex justify-center space-x-6 text-sm text-gray-500">
            <span className="cursor-pointer hover:text-gray-700">About</span>
            <span className="cursor-pointer hover:text-gray-700">Privacy</span>
            <span className="cursor-pointer hover:text-gray-700">Contact</span>
          </div>
        </div>
      </footer>
    );
  })
);

export default Footer;
