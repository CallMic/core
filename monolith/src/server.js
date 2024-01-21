const express = require("express");
const path = require("path");

const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1; // version needed for mp3
//const speech = require('@google-cloud/speech');

/******** speech to text function ******* */
/************************************* */
async function speech_to_text()
{  
    // Creates a client for the google API 
    const client = new speech.SpeechClient();

    //const fileName = 'c:/Shaul/Nicola Zannoni ConserveItalia accept.mp3';
    //   const gcsUri = "path to GCS audio file e.g. `gs:/bucket/audio.wav`"
    //const gcsUri = "gs://speech-analytics-bucket-sd/Isagro.mp3"
    const gcsUri = "gs://speech-analytics-bucket-sd/Isagro.wav"

    const config = {
      //encoding: 'FLAC', //'MP3', //'LINEAR16',
      //encoding: 'MP3', //'LINEAR16',
      encoding: 'LINEAR16', // wav file is linear16
      sampleRateHertz: 8000,
      //sampleRateHertz: 16000, // 16k for linear16. must
      languageCode: 'en-US',
      audioChannelCount: 1  // must be 1 for linear16 wav
      //enableSpeakerDiarization: true,
      //minSpeakerCount: 2,
      //maxSpeakerCount: 2//,
      //model: 'phone_call',
    };

    //const audio = {
    //   content: fs.readFileSync(fileName).toString('base64'),
    //};

    const audio = {
      uri: gcsUri,
    };

    const request = {
      config: config,
      audio: audio
    };

    const [response] = //await client.recognize(request);
                       await client.longRunningRecognize(request);
    //results = response.results;
    console.log(response);
    console.log(response.results);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
    console.log('Speaker Diarization:');
    const result = response.results[response.results.length - 1];
    const wordsInfo = result.alternatives[0].words;
    // Note: The transcript within each result is separate and sequential per result.
    // However, the words list within an alternative includes all the words
    // from all the results thus far. Thus, to get all the words with speaker
    // tags, you only have to take the words list from the last result:
    wordsInfo.forEach(a =>
      console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`)
    );
}
/************************************* */

speech_to_text();
/*
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
*/