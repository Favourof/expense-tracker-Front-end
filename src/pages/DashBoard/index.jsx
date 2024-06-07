
import Navigation from './Component/Navigation';


const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Navigation />
      <div className="flex-grow bg-white-200 pt-20 place-self-start">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

