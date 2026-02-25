import { useNavigate } from 'react-router-dom';
 
import { useEffect } from 'react';

import { Link } from 'react-router-dom';
import { staticImages } from '@/assets/images';
import { scrollToElement } from '@/lib/dom';
import BackBtn from '@/components/buttons/BackBtn';
 

const NotAuthorizedPage = () => {
  const navigate = useNavigate();

  const handleContactUs = () => {
    navigate('/about-us', { replace: true });
    scrollToElement('contact-us');
  };
  // Automatically redirect user after a short delay
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="z-10 max-w-lg w-full tracking-tight rounded-xl overflow-hidden p-6 md:p-8 text-center slowTrans">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={staticImages.baloons}
            alt="logo"
            width={300}
            height={150}
            className="mx-auto"
          />
        </div>

        {/* Main Content */}
        <h1 className="text-center _heading mx-auto w-fit">403 Unauthorized</h1>

        <p className="my-2">We Sincerely Apologize</p>
        <p className="mb-12">You are not authorized to access this page.</p>

        {/* Action Buttons */}
        <div className="flex items-center gap-8 justify-center mb-8">
          <Link to={'/'} className="_secondaryBtn p-2 px-6 rounded-full">
            Home
          </Link>
          <BackBtn
            label="Return"
            className="_primaryBtn px-6 py-2 transition duration-200"
          />
        </div>

        {/* Footer */}
        <footer className="border-t pt-6 text-sm text-bodyText/70">
          <p className="mb-2">For enquiry or complaints</p>
          <div
            role="button"
            onClick={handleContactUs}
            className="primaryLink cursor-pointer hover:underline"
          >
            Contact us
          </div>
        </footer>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;
