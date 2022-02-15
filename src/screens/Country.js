import React, { Component } from "react";

import axios from 'axios';

import { Line } from 'react-chartjs-2';

class Country extends Component{

    constructor(props){
        super(props);

        this.state = {
            currData:{},
            statesData:[],
            positives:[],
            deaths:[],
            X_dates:[],
        };

        this.data = (labels, data,rgb, label_title)=>{

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
          
          this.options = {
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
    }

    componentDidMount(){
        axios.get('https://api.covidtracking.com/v1/us/daily.json').then((res)=>{
            

            var newState = {currData:res.data[0]};

            var data = res.data.map(data=>{
                return data.positive
            });
            newState.positives = data.reverse();
            data = res.data.map(data=>{
                return data.recovered
            });
            newState.recovered = data.reverse();
            data = res.data.map(data=>{
                return data.death
            });
            newState.deaths = data.reverse();
            data = res.data.map(data=>{
                return data.date
            })
            newState.X_dates = data.reverse();

            this.setState(newState);


            axios.get('https://api.covidtracking.com/v1/states/current.json').then((res)=>{
            console.log(res.data[0]);
            this.setState({statesData:res.data});
        });
        });
        
        console.log(this.props);
        
    }

    render(){

        const {currData, statesData, positives, deaths, recovered, X_dates} = this.state;
        console.log(recovered)

        return(
            <div>
                <h1>USA Covid19 Stats</h1>
                <div className="main">

                    <div className="table">
                        <table className="content-table">
                            <thead>
                                <tr>
                                <th>State</th>
                                <th>Active Cases</th>
                                <th>Recovered</th>
                                <th>Deaths</th>
                                </tr>
                            </thead>
                            <tbody>

                                {statesData.map(stateData=>{
                                    return(
                                        <tr onClick={()=>{
                                            this.props.navigate('/usa/state/'+(stateData?.state), { replace: true });
                                            console.log("yo");
                                        }}>
                                            <td>{stateData?.state}</td>
                                            <td>{stateData?.positive}</td>
                                            <td>{stateData?.recovered===null?'-':stateData?.recovered}</td>
                                            <td>{stateData?.death}</td>
                                        </tr>
                                    )
                                })}
                        
                            </tbody>
                        </table>
                    </div>

                    <div className="side-content">
                        
                        <div className="info">
                            <div className="active-cases">
                                <div className="head">Active</div>
                                <br/>
                                <br/>
                                <div className="increase">+{currData.positiveIncrease}</div>
                                <div className="value">{currData.positive} </div>
                            </div>

                            <div className="death-cases">
                                <div className="head">Death</div>
                                <br/>
                                <br/>
                                <div className="increase" >+{currData.deathIncrease}</div>
                                <div className="value">{currData.death} </div>
                            </div>
                        </div>

                        <div className="plot">
                            <Line data={ this.data(X_dates, positives, "19, 100, 232", "Active Cases") } options={this.options}/>
                        </div>
                        <div className="plot">
                            <Line data={ this.data(X_dates, deaths, "222, 49, 77", "Deaths") } options={this.options}/>
                        </div>
                    </div>
                    
                </div>
            </div>
            
        );
    }
}

export default Country;