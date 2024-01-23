// WordFrequencyChart - show a chart with the frequency of the words
// in the transcribed call audio.
import React from 'react';
import { Paper} from "@mui/material";
import { ResponsiveBar } from '@nivo/bar'


// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const MyResponsiveBar = ({ data /* see data tab */ }) => (
    <ResponsiveBar
        data={data}
        keys={[
            'hot dog',
            'burger',
            'sandwich',
            'kebab',
            'fries',
            'donut'
        ]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
    ></ResponsiveBar>
)



const WordFrequencyChart = ({ data }) => {
  /* example input data in arr2:
   arr = [["I",{"count":7,"duration":0.6}],["so",{"count":7,"duration":3.3}],["the",{"count":6,"duration":1.6}],["you",{"count":6,"duration":1.5}],["to",{"count":6,"duration":2.2}],["June",{"count":5,"duration":3.1}],["yes",{"count":4,"duration":1.5}],["14th",{"count":4,"duration":1}],["is",{"count":3,"duration":1}],["just",{"count":3,"duration":1.8}]]
   arr2 = arr.map(([word, { count }]) => ({word,count   }));
  */
  console.log("init WordFrequencyChart with ", data)

  // Extract words and counts from the response JSON
  //const labels = data.map(item => item.word);
  //const counts = data.map(item => item.count);

  //console.log("labels ", labels);
  //console.log("counts ", counts);

  const containerStyle = {
    height: '400px',
    // You can add other styles as needed
  };
  
  return (
    <div>
      <h3>Word Frequency Chart</h3>      
        <div style={containerStyle}>
        <MyResponsiveBar data={data}></MyResponsiveBar>
        </div>        
    </div>    
  );
};

export default WordFrequencyChart;
