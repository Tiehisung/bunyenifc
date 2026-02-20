import React from 'react';
 
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  // const [isFire, setIsFire] = useState(true);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIsFire(!isFire);
  //   }, 4000);
  //   return () => clearInterval(interval);
  // }, [isFire]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`z-10 max-w-lg w-full tracking-tight rounded-xl overflow-hidden p-6 md:p-8 text-center slowTrans `}
      >
        <h1 className="text-center _heading mx-auto w-fit">404 Error</h1>

        <p className="my-2">We Sincerely Apologize</p>
        <p className=" mb-12">We can't find the page you are looking for.</p>

        <div className="flex items-center gap-8 justify-center ">
          <Link to={'/'} className="_secondaryBtn p-2 px-6 rounded-full">
            Home
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
