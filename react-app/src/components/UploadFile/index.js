// UploadFile

import React, { useState } from 'react';
import WordFrequencyChart from '../WordFrequencyChart';
import { Paper, Button } from "@mui/material";

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

        // can change short to long to take longer words. 
        // long is 5+ characters. 
        // short is 1-4 characters.
        if (stats.hasOwnProperty("1"))
           chart1 = stats["1"]["top_by_count_long"];
        if (stats.hasOwnProperty("2"))
           chart2 = stats["2"]["top_by_count_long"];
        
        var chart1_data = chart1.map(([word, { count, duration }]) => ({
          "word" : word,
          "count": count,
          "duration" : Math.round(duration),          
          "countColor": "hsl(116, 70%, 50%)",
          "durationColor": "hsl(116, 70%, 50%)"
        }));

        var chart2_data = chart1.map(([word, { count, duration }]) => ({
          "word" : word,
          "count": count,
          "duration" : Math.round(duration),
          "countColor": "hsl(116, 70%, 50%)",
          "durationColor": "hsl(116, 70%, 50%)"
        }));
        
        const chartData = {
          "1": chart1_data,
          "2": chart2_data
        };

        console.log("parsed input to ", chartData);

        // make good chartdata
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

/*   example - for testing
  var plot_count_data = 
  [
    {
      "word": "Jojo",
      "count": 30,
      "countColor": "hsl(116, 70%, 50%)"
    },
    {
      "word": "Jojos",
      "count": 160,
      "countColor": "hsl(116, 70%, 50%)"
    }
  ];

  var plot_duration_data = 
  [
    {
      "word": "Jojo durrrr",
      "duration": 190,
      "durationColor": "hsl(116, 70%, 50%)"
    },
    {
      "word": "Jojos dur",
      "duration": 160,
      "durationColor": "hsl(116, 70%, 50%)"
    }
  ];

  var plot_count_keys = ['count'];
  var plot_duration_keys = ['duration'];
*/

  return (
    <div>
        <div>Upload a call audio file to receive instant conversational report.</div>
      <form>
        <br></br>
        <Paper
            elevation={9}
            sx={{
              width: "300px",
              padding: (theme) => theme.spacing(3, 5),
            }}
          >
        <div>
          <label>Email:</label>
          <br></br>
          <input type="text" value={email} onChange={handleEmailChange} />
          <br></br><br></br>
        </div>
        <div>
          <label>File (WAV only):</label><br></br>
          <input type="file" onChange={handleFileChange} />
        </div>
        </Paper>
        <br></br>
        <Button variant="contained" type="button" onClick={handleUpload} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
        </form>              
      {chartData && /* show only if we are after Submission ended and result received */
        <div>
            <WordFrequencyChart data={{ title: "Speaker 1 - Word Counts", plot_data: chartData["1"], plot_keys: ["count"] }}></WordFrequencyChart>
            <WordFrequencyChart data={{ title: "Speaker 1 - Total Duration of Word (sec)", plot_data: chartData["1"], plot_keys: ["duration"] }}></WordFrequencyChart>
            <WordFrequencyChart data={{ title: "Speaker 2 - Word Counts", plot_data: chartData["2"], plot_keys: ["count"] }}></WordFrequencyChart>
            <WordFrequencyChart data={{ title: "Speaker 2 - Total Duration of Word (sec)", plot_data: chartData["2"], plot_keys: ["duration"] }}></WordFrequencyChart>
        </div>}
    </div>
  );
};

export default UploadFile;
