// UploadFile

import React, { useState } from 'react';
import WordFrequencyChart from '../WordFrequencyChart';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  // example, for testing visualizations
  // const resp_example = {"1":{"top_by_count_short":[["I",{"count":7,"duration":0.6}],["the",{"count":6,"duration":1.6}],["you",{"count":6,"duration":1.5}],["so",{"count":6,"duration":2.5999999999999996}],["to",{"count":6,"duration":2.2}],["June",{"count":5,"duration":3.1}],["14th",{"count":4,"duration":1}],["is",{"count":3,"duration":1}],["just",{"count":3,"duration":1.8}],["a",{"count":3,"duration":0.2}]],"top_by_duration_short":[["June",{"count":5,"duration":3.1}],["so",{"count":6,"duration":2.5999999999999996}],["to",{"count":6,"duration":2.2}],["just",{"count":3,"duration":1.8}],["the",{"count":6,"duration":1.6}],["you",{"count":6,"duration":1.5}],["for",{"count":2,"duration":1.5}],["yes",{"count":3,"duration":1.4}],["it",{"count":3,"duration":1.2000000000000002}],["time",{"count":2,"duration":1.1}]],"top_by_count_long":[["maybe",{"count":7,"duration":2.3}],["apologize",{"count":2,"duration":0.1}],["Monday",{"count":2,"duration":1.1}],["hello",{"count":1,"duration":0.3}],["Francisco",{"count":1,"duration":0.3}],["varium",{"count":1,"duration":0.3}],["expecting",{"count":1,"duration":0.7}],["quick",{"count":1,"duration":0.1}],["people",{"count":1,"duration":0.6}],["wanted",{"count":1,"duration":0.5}]],"top_by_duration_long":[["maybe",{"count":7,"duration":2.3}],["Monday",{"count":2,"duration":1.1}],["expecting",{"count":1,"duration":0.7}],["invitation",{"count":1,"duration":0.7}],["10:00",{"count":1,"duration":0.7}],["people",{"count":1,"duration":0.6}],["about",{"count":1,"duration":0.6}],["models",{"count":1,"duration":0.6}],["wanted",{"count":1,"duration":0.5}],["supply",{"count":1,"duration":0.5}]]},"2":{"top_by_count_short":[["you",{"count":11,"duration":3.9000000000000004}],["can",{"count":7,"duration":1.8}],["I",{"count":6,"duration":0.7}],["okay",{"count":6,"duration":2.7}],["is",{"count":5,"duration":1.4}],["the",{"count":4,"duration":1.4000000000000001}],["a",{"count":4,"duration":0.6000000000000001}],["so",{"count":4,"duration":0.5}],["we",{"count":4,"duration":1}],["very",{"count":3,"duration":1.7}]],"top_by_duration_short":[["you",{"count":11,"duration":3.9000000000000004}],["okay",{"count":6,"duration":2.7}],["can",{"count":7,"duration":1.8}],["very",{"count":3,"duration":1.7}],["the",{"count":4,"duration":1.4000000000000001}],["is",{"count":5,"duration":1.4}],["much",{"count":2,"duration":1.2000000000000002}],["at",{"count":2,"duration":1.2}],["send",{"count":3,"duration":1.2}],["that",{"count":3,"duration":1.1}]],"top_by_count_long":[["don't",{"count":3,"duration":1}],["thank",{"count":3,"duration":0.7}],["disturbed",{"count":2,"duration":0.7}],["worry",{"count":2,"duration":1}],["sorry",{"count":1,"duration":0.7}],["unfortunately",{"count":1,"duration":0.6}],["because",{"count":1,"duration":0.1}],["since",{"count":1,"duration":0.6}],["today",{"count":1,"duration":0.4}],["national",{"count":1,"duration":0.3}]],"top_by_duration_long":[["don't",{"count":3,"duration":1}],["worry",{"count":2,"duration":1}],["sorry",{"count":1,"duration":0.7}],["disturbed",{"count":2,"duration":0.7}],["cannot",{"count":1,"duration":0.7}],["thank",{"count":3,"duration":0.7}],["coming",{"count":1,"duration":0.7}],["unfortunately",{"count":1,"duration":0.6}],["since",{"count":1,"duration":0.6}],["outside",{"count":1,"duration":0.6}]]},"3":{"top_by_count_short":[["so",{"count":2,"duration":1.1}],["you",{"count":2,"duration":0.1}],["okay",{"count":2,"duration":0.4}],["yes",{"count":1,"ount_long":[["hello",{"count":1,"duration":0.1}],["Cisco",{"count":1,"duration":0.6}],["prefer",{"count":1,"duration":0.7}],["don't",{"count":1,"duration":0.2}],["clearly",{"count":1,"duration":0.5}]],"top_by_duration_long":[["prefer",{"count":1,"duration":0.7}],["Cisco",{"count":1,"duration":0.6}],["clearly",{"count":1,"duration":0.5}],["don't",{"count":1,"duration":0.2}],["hello",{"count":1,"duration":0.1}]]}};

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUpload = async () => {
    try {
      if (!file || !email) {
        console.error('Please provide both file and email');
        return;
      }
      
      setLoading(true); // Set loading to true when the submission begins

      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      // Replace 'YOUR_NODEJS_API_ENDPOINT' with the actual endpoint of your Node.js API
      const response = await fetch('/process_audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        const jsonResponse = await response.json();
        // Access the JSON properties and log or display them as needed
        console.log('Server Response:', jsonResponse);
        console.log('Message:', jsonResponse.message);
        console.log('Email:', jsonResponse.email);
        console.log('Stats:', jsonResponse.stats);
        var stats = JSON.parse(jsonResponse.stats);
        var chart1 = null;
        var chart2 = null;
        if (stats.hasOwnProperty("1"))
           chart1 = stats["1"]["top_by_count_long"];
        if (stats.hasOwnProperty("2"))
           chart2 = stats["2"]["top_by_count_long"];
        console.log("chart1", chart1);
        console.log("chart2", chart2);    
        // example chart1: 
        // arr = [["I",{"count":7,"duration":0.6}],["so",{"count":7,"duration":3.3}],["the",{"count":6,"duration":1.6}],["you",{"count":6,"duration":1.5}],["to",{"count":6,"duration":2.2}],["June",{"count":5,"duration":3.1}],["yes",{"count":4,"duration":1.5}],["14th",{"count":4,"duration":1}],["is",{"count":3,"duration":1}],["just",{"count":3,"duration":1.8}]]
        // arr2 = arr.map(([word, { count }]) => ({word,count   }));
        // can change 1 to 2,  and count/duration   short/long
        const chartData = chart1.map(([word, { count }]) => ({
          word,
          count
        }));
        console.log("parsed input to ", chartData);
        setChartData(chartData);
        console.log('Plotted graph.');
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error in audio upload/process/show - ', error);
    } finally {
      setLoading(false); // Set loading back to false, regardless of success or failure
    }
  };

  var data = 
  [
    {
      "country": "AD",
      "hot dog": 124,
      "hot dogColor": "hsl(287, 70%, 50%)",
      "burger": 63,
      "burgerColor": "hsl(21, 70%, 50%)",
      "sandwich": 160,
      "sandwichColor": "hsl(116, 70%, 50%)",
      "kebab": 54,
      "kebabColor": "hsl(161, 70%, 50%)",
      "fries": 167,
      "friesColor": "hsl(232, 70%, 50%)",
      "donut": 142,
      "donutColor": "hsl(15, 70%, 50%)"
    },
    {
      "country": "AE",
      "hot dog": 181,
      "hot dogColor": "hsl(154, 70%, 50%)",
      "burger": 27,
      "burgerColor": "hsl(225, 70%, 50%)",
      "sandwich": 17,
      "sandwichColor": "hsl(326, 70%, 50%)",
      "kebab": 162,
      "kebabColor": "hsl(23, 70%, 50%)",
      "fries": 53,
      "friesColor": "hsl(243, 70%, 50%)",
      "donut": 173,
      "donutColor": "hsl(83, 70%, 50%)"
    },
    {
      "country": "AF",
      "hot dog": 146,
      "hot dogColor": "hsl(334, 70%, 50%)",
      "burger": 153,
      "burgerColor": "hsl(303, 70%, 50%)",
      "sandwich": 180,
      "sandwichColor": "hsl(1, 70%, 50%)",
      "kebab": 107,
      "kebabColor": "hsl(292, 70%, 50%)",
      "fries": 7,
      "friesColor": "hsl(277, 70%, 50%)",
      "donut": 51,
      "donutColor": "hsl(226, 70%, 50%)"
    },
    {
      "country": "AG",
      "hot dog": 138,
      "hot dogColor": "hsl(238, 70%, 50%)",
      "burger": 167,
      "burgerColor": "hsl(342, 70%, 50%)",
      "sandwich": 150,
      "sandwichColor": "hsl(213, 70%, 50%)",
      "kebab": 117,
      "kebabColor": "hsl(87, 70%, 50%)",
      "fries": 163,
      "friesColor": "hsl(149, 70%, 50%)",
      "donut": 29,
      "donutColor": "hsl(246, 70%, 50%)"
    },
    {
      "country": "AI",
      "hot dog": 46,
      "hot dogColor": "hsl(323, 70%, 50%)",
      "burger": 73,
      "burgerColor": "hsl(194, 70%, 50%)",
      "sandwich": 193,
      "sandwichColor": "hsl(50, 70%, 50%)",
      "kebab": 5,
      "kebabColor": "hsl(248, 70%, 50%)",
      "fries": 132,
      "friesColor": "hsl(79, 70%, 50%)",
      "donut": 14,
      "donutColor": "hsl(217, 70%, 50%)"
    },
    {
      "country": "AL",
      "hot dog": 107,
      "hot dogColor": "hsl(279, 70%, 50%)",
      "burger": 16,
      "burgerColor": "hsl(36, 70%, 50%)",
      "sandwich": 97,
      "sandwichColor": "hsl(240, 70%, 50%)",
      "kebab": 92,
      "kebabColor": "hsl(212, 70%, 50%)",
      "fries": 135,
      "friesColor": "hsl(189, 70%, 50%)",
      "donut": 172,
      "donutColor": "hsl(70, 70%, 50%)"
    },
    {
      "country": "AM",
      "hot dog": 177,
      "hot dogColor": "hsl(59, 70%, 50%)",
      "burger": 53,
      "burgerColor": "hsl(269, 70%, 50%)",
      "sandwich": 160,
      "sandwichColor": "hsl(138, 70%, 50%)",
      "kebab": 142,
      "kebabColor": "hsl(306, 70%, 50%)",
      "fries": 186,
      "friesColor": "hsl(239, 70%, 50%)",
      "donut": 34,
      "donutColor": "hsl(237, 70%, 50%)"
    }
  ];
  
  return (
    <div>
        <div>Upload a call audio file to receive instant conversational report.</div>
      <form>
        <div>
          <label>Email:</label>
          <input type="text" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <label>File (WAV only):</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="button" onClick={handleUpload} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>      
      <WordFrequencyChart data={data}></WordFrequencyChart>
    </div>
  );
};

/*{chartData && <WordFrequencyChart data={chartData} />} */

export default UploadFile;
