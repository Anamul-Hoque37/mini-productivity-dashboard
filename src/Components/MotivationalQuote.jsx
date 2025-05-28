import React, { useEffect, useState } from 'react';

const MotivationalQuote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      const res = await fetch('https://api.quotable.io/random');
      const data = await res.json();
      setQuote(data.content);
      setAuthor(data.author);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote('Unable to fetch quote. Please try again.');
      setAuthor('');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">🌟 Daily Motivation</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="text-xl font-medium italic text-gray-800 dark:text-white">
            “{quote}”
          </p>
          <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-2">
            — {author}
          </p>
        </>
      )}
    </div>
  );
};

export default MotivationalQuote;
