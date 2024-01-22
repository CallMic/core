const express = require("express");
const path = require("path");
const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1; // version needed for mp3

/******** speech to text function ******* */
/************************************* */
async function speech_to_text(gcsUri)
{  
    // Creates a client for the google API 
    const client = new speech.SpeechClient();
    //const fileName = 'c:/Shaul/Nicola Zannoni ConserveItalia accept.mp3';
    //   const gcsUri = "path to GCS audio file e.g. `gs:/bucket/audio.wav`"    
    //const gcsUri = "gs://speech-analytics-bucket-sd/ConserveItalia.mp3"
    //const gcsUri = "gs://speech-analytics-bucket-sd/Isagro.wav"

    // for mp3
    const config = {      
      encoding: 'LINEAR16',      
      sampleRateHertz: 8000,      
      languageCode: 'en-US',
      enableSpeakerDiarization: true,
      //diarizationSpeakerCount: 2,
      minSpeakerCount: 2,
      maxSpeakerCount: 2,      
      model: 'video' // I think this is for "long". seems to work well      
    };

    const audio = {
      uri: gcsUri,
    };

    const request = {
      config: config,
      audio: audio
    };

    //console.log("starting long running recognition job");
    const [operation] = await client.longRunningRecognize(request);
    //console.log("getting response after job ends");
    const [response] = await operation.promise();
    results = response.results;    
    console.log(response);
    //console.log(JSON.stringify(response.results));    
    const result = response.results[response.results.length - 1];
    const wordsInfo = result.alternatives[0].words;    
    return wordsInfo;
}
/************************************* */

// update with data for the word entry from the speech
function set_entry(stats, word, speaker, duration_sec)
{
  // make sure we have speaker map
  if (!stats.hasOwnProperty(speaker))
    stats[speaker] = {}

  var speakerMap = stats[speaker];

  if (!speakerMap.hasOwnProperty(word))
  {
    speakerMap[word] = {
      count: 0,
      duration: 0
    }
  }

  speakerMap[word].count++;
  speakerMap[word].duration += duration_sec;
}


function get_top_entries(jsonData, sort_by, min_length, max_length) {
  // Convert the JSON object into an array of key-value pairs
  const entries = Object.entries(jsonData);

  // Filter out entries with keys shorter than 4 letters
  const filteredEntries = entries.filter(([key, value]) => 
    (key.length >= min_length) && (key.length <= max_length));

  // Sort the array based on the "count" property in descending order
  filteredEntries.sort((a, b) => b[1][sort_by] - a[1][sort_by]);

  // Take the top 10 entries
  const topEntries = filteredEntries.slice(0, 10);
  return topEntries;
}

async function get_speech_analytics(gcsUri)
{
    var wordsInfo = await speech_to_text(gcsUri);
    // show the words array, for debugging.
    //console.log(wordsInfo);  
    speech_stats = {}
    wordsInfo.forEach(a => {      
          word = a.word;
          speaker = a.speakerTag + ""; // make it string
          // I put abs because there seems to be a bug that sometimes startTime
          // is after endTime
          duration_sec = Math.abs(a.endTime.nanos - a.startTime.nanos) /1000000000; //nanosec to sec
          set_entry(speech_stats, word, speaker, duration_sec);          
      }      
    );  

    var speech_analytics = {}
    for (const key of Object.keys(speech_stats))
    {
      val = speech_stats[key];    
      speaker = key;
      words = val;
      top_by_count_short = get_top_entries(words, "count", 0, 4);
      top_by_duration_short = get_top_entries(words, "duration", 0, 4);
      top_by_count_long = get_top_entries(words, "count", 5, 25);
      top_by_duration_long = get_top_entries(words, "duration", 5, 25);
      speech_analytics[speaker] =  // set for specific speaker
        {
          top_by_count_short: top_by_count_short,
          top_by_duration_short: top_by_duration_short,
          top_by_count_long: top_by_count_long,
          top_by_duration_long: top_by_duration_long
        }
    }
    
    console.log(JSON.stringify(speech_analytics, null, 4));    
    return speech_analytics;
}

//get_speech_analytics("gs://speech-analytics-bucket-sd/Isagro.wav");

const app = express();
const port = process.env.PORT || 8080;

//Serve website
app.use(express.static(path.join(__dirname, "..", "public")));

//Get all products
//app.get("/service/products", (req, res) => res.json(products));

//Get products by ID
//app.get("/service/products/:id", (req, res) =>
//  res.json(products.find((product) => product.id === req.params.id))
//);

//Get all orders
//app.get("/service/orders", (req, res) => res.json(orders));

//Get orders by ID
//app.get("/service/orders/:id", (req, res) =>
//  res.json(orders.find((order) => order.id === req.params.id))
//);

//Client side routing fix on page refresh or direct browsing to non-root directory
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

//Start the server
app.listen(port, () => console.log(`CallMic listening on port ${port}!`));
