// server for backend processing of the audio file and getting analytics & insights from it
const express = require("express");
const path = require("path");
const fs = require('fs');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

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
    
    // for testing locally
    //console.log(JSON.stringify(speech_analytics, null, 4));    
    return speech_analytics;
}

// test locally
//get_speech_analytics("gs://speech-analytics-bucket-sd/Isagro.wav");


/* Server setup ************************************************************** */
const app = express();
const port = process.env.PORT || 8080;

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Replace 'GCP_PROJECT_ID' and 'YOUR_GCS_BUCKET_NAME' with your GCP project ID and GCS bucket name
const storageClient = new Storage({ projectId: 'speech-analytics-sd' });
const bucket = storageClient.bucket('speech-analytics-bucket-sd');

app.post('/process_audio', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const email = req.body.email;
    console.log(`Processing audio. email is: ${email} file length is ${file.length}`);

    if (!file || !email) {
      console.error('Both file and email are required');
      res.status(400).send('Bad Request');
      return;
    }

    // Generate a unique filename
    const fileName = `${Date.now()}_${path.basename(file.originalname)}`;

    console.log(`uploading file to ${fileName}`)

    // Upload the file to GCS
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error('Error uploading audio to GCS:', err);
      res.status(500).send('Internal Server Error on upload to GCS');
    });

    stream.on('finish', async () => {
      console.log('Audio File uploaded to GCS successfully');
      var gcsUri = "gs://speech-analytics-bucket-sd/"+fileName;
      console.log(`starting audio analysis of ${gcsUri}`);
      stats = await get_speech_analytics(gcsUri);
      console.log(stats);
      res.status(200).send('OK');
    });

    stream.end(file.buffer);
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).send('Internal Server Error in file upload');
  }
});

//Serve website
app.use(express.static(path.join(__dirname, "..", "public")));

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

/*************************************************************** */

// unused code
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
