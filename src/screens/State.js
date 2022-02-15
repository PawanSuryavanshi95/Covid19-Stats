import React, { Component, useEffect, useState } from "react";

import axios from 'axios';

import {
    useParams 
  } from "react-router-dom";

import { Line } from 'react-chartjs-2';

const State = ()=>{

    const { state_code } = useParams();

    const [covidData, setCovidData] = useState([]);
    const [positives, setPositives] = useState([]);
    const [recovered, setRecovered] = useState([]);
    const [deaths, setDeaths] = useState([]);
    const [X_dates, setDates] = useState([]);
    const [metaData, setMetaData] = useState({});

    const data = (labels, data,rgb, label_title)=>{

        return {
        labels: labels,
        datasets: [
          {
            label: label_title,
            data: data,
            fill: true,
            backgroundColor:`rgba(${rgb}, 0.3)`,
            pointBorderColor:`rgba(${rgb}, 0.8)`,
            pointBorderWidth:1,
            pointRadius:0.5,
            tension: 0.4
          },
        ],
      }};
      
      const options = {
        plugins:{legend:{display:false}},
        layout:{padding:{bottom:100}},
        tooltips: {
            mode: 'index',
         },
         hover: {
            mode: 'index',
            intersect: false
         },
        scales: {
            x: {
                display: false
            },
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }   
            }]
        },
      };

    useEffect(()=>{
        axios.get(`https://api.covidtracking.com/v1/states/${state_code.toLowerCase()}/info.json`).then((res)=>{
            //console.log(res.data);
            setMetaData(res.data);
        });
        axios.get(`https://api.covidtracking.com/v1/states/${state_code.toLowerCase()}/daily.json`).then((res)=>{
            //console.log(res.data);
            setCovidData(res.data);
            var data = res.data.map(data=>{
                return data.positive
            });
            setPositives(data.reverse());
            data = res.data.map(data=>{
                return data.recovered
            });
            setRecovered(data.reverse());
            data = res.data.map(data=>{
                return data.death
            });
            setDeaths(data.reverse());
            data = res.data.map(data=>{
                return data.date
            })
            setDates(data.reverse());
        });
        
    },[])
    
    return(
        <div>
            <div className="meta">
                <div className="state-name">{metaData.name} - {state_code}</div>
                <div><a href={metaData.covid19Site}><i className="fa-solid fa-house fa-3x"></i></a></div>
                <div><a href={"https://twitter.com/"+metaData?.twitter?.substring(1,metaData.twitter?.length)} class="fa fa-twitter"></a></div>
            </div>


            <div className="states-content">
                <div className="states-info">
                    <div className="active-cases">
                        <div className="head">Active</div>
                        <br/>
                        <br/>
                        <div className="increase">+{covidData[0]?.positiveIncrease}</div>
                        <div className="value">{covidData[0]?.positive} </div>
                    </div>

                    <div className="recovered-cases">
                        <div className="head">Recovered</div>
                        <br/>
                        <br/>
                        <div className="increase"></div>
                        <div className="value">{covidData[0]?.recovered} </div>
                    </div>

                    <div className="death-cases">
                        <div className="head">Death</div>
                        <br/>
                        <br/>
                        <div className="increase" >+{covidData[0]?.deathIncrease}</div>
                        <div className="value">{covidData[0]?.death} </div>
                    </div>
                </div>

                <div className="side-content">
                    <div className="plot">
                        <h2>Active Cases</h2>
                        <Line data={ data(X_dates, positives, "19, 100, 232", "Active Cases") } options={options}/>
                    </div>
                    <div className="plot">
                        <h2>Recovered</h2>
                        <Line data={ data(X_dates, recovered, "28, 173, 49", "Recovered") } options={options}/>
                    </div>
                    <div className="plot">
                        <h2>Deaths</h2>
                        <Line data={ data(X_dates, deaths, "222, 49, 77", "Deaths") } options={options}/>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default State;