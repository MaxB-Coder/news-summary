import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import './App.css'

import { getNewsData } from './utils/newsDataService';
import Footer from './components/standard_elements/footer';
import Header from './components/standard_elements/header';
import Headlines from './components/pages/Headlines';
import ArticlePage from "./components/pages/ArticlePage";


const App = () => {

  const [newsData, setNewsData] = useState({});
  const [failed, setFailed] = useState(false);

  const getData = async() => {
    const data = await getNewsData();
    if (data instanceof Error) {
      console.error(data.message);
      setNewsData([]);
      setFailed(true);
    } else {
      setNewsData(data);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <main>
        <Header />
        {failed && (
          <p role="alert" className="text-center pt-5 mt-5">
            Couldn&apos;t load today&apos;s headlines. Please try again later.
          </p>
        )}
        <Routes>
          <Route path="/" element={<Headlines newsData={newsData} />} />
          <Route path="/article/:id" element={<ArticlePage newsData={newsData} />} />
        </Routes>
        <Footer />
      </main>
    </>
  );
}



export default App;
