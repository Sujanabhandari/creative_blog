import Article from './Components/Article';
import Articles from './Components/Articles';
import './App.css';
import { client } from './main';
import Nav from './Components/Nav';
import { NavLink, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import '../src/styles/main.css'
import Blogs from './Components/Blogs';
import Author from './Components/Author';
import Details from './Components/Details'
import BlogTypes from './Components/BlogTypes';
import BlogTypes_Card from './Components/BlogTypes_Card';

import Categories from './Components/Categories';

function App() {

  const [articles, setArticles] = useState([]);
  const [newArticles, setNewArticles] = useState([]);

  const [query, setQuery] = useState("");
  const [navItems, setNavItems] = useState({});


  useEffect(() => {
    client.getEntries().then(function (entries) {
      setArticles(entries.items);
      setNewArticles(entries.items);
    });

  }, [])

  useEffect(() => {
    const array = [];
    articles.filter(post => {
      if (query === "") {
        //if query is empty
        console.log("empty")
        return setNewArticles(articles)
      } else if (post.fields.name.toLowerCase().includes(query.toLowerCase()) || post.fields.author.toLowerCase().includes(query.toLowerCase())) {
        array.push(post);
        return setNewArticles(array)
      }
    });
  }, [query])

  useEffect(() => {
    const navbarItems = {
      "authors": [],
      "blogTypes": []
    };
    const authors = new Set();
    const blogTypes = new Set();
    articles.forEach(article => {
      authors.add(article.fields.author);
      blogTypes.add(article.fields.blogtype);
    });
    navbarItems.authors = [...authors];
    navbarItems.blogTypes = [...blogTypes];
    setNavItems(navbarItems);
  }, [articles])



  return (
    <div className="App">
      <header className='mb-3'>
        <NavLink to="/" className="link"><h1>Contentful Blog</h1></NavLink>
        <p>Welcome to our blog</p>
        <input placeholder="Search" onChange={event => setQuery(event.target.value)} />
        <Categories navItems={navItems} />
      </header>

      <Routes>
        <Route path='/' element={<Articles articles={newArticles} />} />
        <Route path='articles' element={<Articles articles={newArticles} />} />

        <Route path='articles/:id' element={<Article articles={newArticles} />} />

        <Route path='authors' element={<Author articles={articles} />} />

        <Route path='authors/:author_name' element={<Details articles={articles} />} />

        <Route path='blogtypes' element={<BlogTypes articles={articles} />} />
        <Route path='blogtypes/:type_name' element={<BlogTypes_Card articles={articles} />} />
      </Routes>

    </div>
  );
}

export default App;
