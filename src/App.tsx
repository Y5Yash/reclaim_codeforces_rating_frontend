import React, { useState, ChangeEvent, FormEvent } from 'react';
import './App.css';
import QRCode from 'qrcode.react';
import { get } from 'http';
import { error } from 'console';
// import reclaim_logo from './reclaim_logo.png'

const reclaim_logo = require('./reclaim_logo.png');

interface ApiResponse {
  template_url: string;
}

interface PData{
  [key: string]: string;
}

const App: React.FC = () => {
  const [rating, setRating] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proofData, setProofData] = useState<PData>({});
  const backendBase = 'http://localhost:3000'
  const backendUrl = `${backendBase}/prove-rating`
  const backendProofUrl = `${backendBase}/get-proof`

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Make API request to the backend server
    try {
      console.log(`${backendUrl}/${rating}`)
      const response = await fetch(`${backendUrl}/${rating}`);
      // console.log(await response.json());

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setResult(data.template_url);
        console.log(data.template_url)
      } else {
        setResult('Error: Unable to fetch result');
      }
    } catch (error) {
      setResult('Error: Something went wrong');
      console.log(error);
    }
  };

  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRating(e.target.value);
  };


  const getLastProof = async () => {
    setIsLoading(true);

    try {
      // const response = await fetch(`${backendProofUrl}`); // Replace with your backend API endpoint
      // const jsonData = await response.json();
      // console.log(jsonData);
      // setProofData(jsonData);
      fetch(backendProofUrl)
        .then(response => response.json())
        .then(data => {console.log(data); setProofData(data);})
        .catch(error => {console.error('Error: ', error);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className='container'>
      <img src={reclaim_logo} alt="Logo" />
      <h1>
        RecAnon:
      </h1>
      <h2>Anonymous Recruitement Platform by proving your codeforces rating!</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            onChange={handleRatingChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {result && (
        <div>
        <p>Result: {result}</p>
        <QRCode value={result} />
      </div>
      )}

      <h1>Last Proof submitted:</h1>
        <button onClick={getLastProof} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch the latest Proof submitted on RecAnon'}
        </button>
        {Object.keys(proofData).length > 0 && (
        <ul>
          {Object.entries(proofData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {Object.entries(value[0]).map(([key1, val1]) => 
                <li key={key1}>
                  <strong>{key1}:</strong> {String(val1)}
                </li>
              )}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
};

export default App;
