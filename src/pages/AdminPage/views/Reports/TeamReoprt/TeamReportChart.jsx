import React from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

const TeamReportChart = ({ data }) => {
    console.log(data);
    // Data for the three metrics
    const teamTask = data.team_tasks;
    const teamTaskCompleted = data.team_tasks_completed;
    const teamTaskCompletedOnTime = data.team_tasks_completed_on_time;

    // Chart data and options
    const chartData = {
        labels: ['Team Tasks', 'Team Tasks Completed', 'Team Task Completed On Time'],
        datasets: [
            {
                label: 'Team Report',
                data: [teamTask, teamTaskCompleted, teamTaskCompletedOnTime],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
                maxBarThickness: 40,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const Wrapper = styled.div`
        width: 50%;
        margin: auto;
        height: 60%;
    `

    return (
        <Wrapper>
            {/* <h2>Team Report</h2> */}
            {
                Object.keys(data || {}).length < 1 ? <></> :
                <>
                    <p style={{ margin: '25px 0 10px', textAlign: 'center' }}><b>Bar chart showing teams tasks and team tasks completion rate</b></p>
                    <Bar data={chartData} options={chartOptions} />            
                </>
            }
        </Wrapper>
    );
};

export default TeamReportChart;
