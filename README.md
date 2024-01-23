# CallMic speech-to-analytics webapp

## Introduction

### CallMic is a website where you can upload a voice file and get analytics regarding the usage of words, phrases, sentiment (TBD) in the file. The code splits the file to two speakers based on their voice. It provides analytics for both of the speakers. Utilizes tools from GCP - Google Cloud Platform.

## Google Cloud Tools in Use:

### This project makes use of the following cloud tools:

- Google Cloud Run - to run server in scalable Kubernetes containers, pay-as-you-go model

- Google Cloud Storage - Object storage to store the audio files and analysis results

- Google Speech-to-Text API - used for converting the audio file to text, with extra data

### Project architecture

This is a simple & standard architecture:

#### ReactJS client:
- utilizing Material-UI for the UI components (Google-like UI) and Nivo Charts (supports server-side rendering) for charting the results.
#### NodeJS server:
- Audio files and results are saved to object storage (on GCP)
- Simple REST API for uploading the file and receiving the results

### TODO

- Add a summary of the call using the OpenAI ChatGPT API or even Google AI Summarization (also based on ChatGPT)
- Add more complex algorithm flow to analyze the call text - can think of many ideas

## Try it online now

https://callmic.com

## Installation & Setup

### **NOTE:** Make sure you have a newer version of NodeJS (16.13.0) or newer (in Cloud Shell you can run `nvm install --lts`)

```bash
git clone https://github.com/CallMic/CallMic-Opensource
cd monolith-to-microservices
./setup.sh
```

## Monolith

### To run the monolith project use the following commands from the top level directory

```bash
cd monolith
npm start
```

You should see output similar to the following

```text
Monolith listening on port 8080!
```

#### That's it! You now have a perfectly functioning monolith running on your machine

### Docker - Monolith

#### To create a Docker image for the monolith, execute the following commands

```bash
cd monolith
docker build -t monolith:1.0.0 .
```

To run the Docker image, execute the following commands

```bash
docker run --rm -p 8080:8080 monolith:1.0.0
```

## Microservices

### Docker - Microservices

### To create a Docker image for the microservices, you will have to create a Docker image for each service. Execute the following commands for each folder under the microservices folder

To run the Docker image, execute the following commands

```bash
docker run -d --rm -p 8080:8080 monolith:1.0.0
```

#### To stop the containers, you will need to find the CONTAINER ID for each and stop them individually. See the steps below

```bash
docker ps -a

CONTAINER ID        IMAGE                        COMMAND                CREATED
4c01db0b339c        frontend:1.0.0               bash                   17 seconds ago
d7886598dbe2        orders:1.0.0                 bash                   17 seconds ago
d85756f57265        products:1.0.0               bash                   17 seconds ago

docker stop 4c01db0b339c
docker stop d7886598dbe2
docker stop d85756f57265
```

## React App

### The react-app folder contains a React application created from `create-react-app`. You can modify this fronted, but afterwards, you will need to build and move the static files to the monolith and microservices project. You can do this by running the standard create-react-app build command below

```bash
npm run build
```

#### This will run the build script to create the static files two times. The first will build with relative URLs and copy the static files to the monolith/public folder. The second run will build with the standard microservices URLs and copy the static files to the microservices/src/frontend/public folder
