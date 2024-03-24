import React, { useState, useEffect } from "react";
import styles from "../TimeDetails/styles.module.css";
import Select from "react-select";
import { useGithubContext } from "../../../../../../contexts/GithubReportContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CommitDetails({
  title,
  projectTimeDetail,
  Repository,
}) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const { githubReports, githubReportsLoaded } = useGithubContext();
  const [pushersData, setPushersData] = useState([]);

  const generateOption = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 2; i++) {
      years.push({
        label: currentYear - i,
        value: (currentYear - i).toString(),
      });
    }
    return years;
  };

  const options = generateOption();

  function getFullYearFromDate(dateString) {
    const date = new Date(dateString);
    return date.getFullYear();
  }

  useEffect(() => {
    if (!githubReportsLoaded) return;
    const filteredData = githubReports.find(
      (repo) => repo.repository_name === projectTimeDetail.repository_name
    );

    if (!filteredData) return;

    // console.log(filteredData);

    const commits = filteredData?.metadata?.filter(
      (item) => {
        if (item?.pusher === 'github-actions[bot]') return false;
        if (selectedMonth.length < 1) return getFullYearFromDate(item.data) === selectedYear.label
        return getFullYearFromDate(item.data) === selectedYear.label && new Date(item.data).getMonth() === Number(selectedMonth?.value);
      }
    );

    const uniquePushers = [...new Set(commits.map((item) => item.pusher))];

    const pushersWithCommitCounts = uniquePushers.map((pusher) => {
      const commitCount = commits.filter(
        (item) => item.pusher === pusher
      ).length;
      return { pusher, number_of_commits: commitCount };
    });

    console.log(pushersWithCommitCounts);
    setPushersData(pushersWithCommitCounts);
  }, [githubReports, githubReportsLoaded, selectedYear, selectedMonth]);

  return (
    <div className={styles.commit__Detail}>
      <p className={styles.commit_detail_head}>
        Repository: <span>{projectTimeDetail.repository_name}</span>
      </p>
      <div className={styles.commit__Detail__title}>
        <h3 style={{ fontSize: "0.9rem" }}>{title}</h3>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Select
            options={options}
            onChange={(selectedOption) => {
              setSelectedYear(selectedOption);
            }}
            className={styles.invoice__select__year}
            placeholder="Select year"
          />
          <Select
            value={
              selectedMonth.length < 1 ? 
                []
              :
              [
                selectedMonth
              ]
            }
            options={[
              { label: "January", value: "01" },
              { label: "February", value: "02" },
              { label: "March", value: "03" },
              { label: "April", value: "04" },
              { label: "May", value: "05" },
              { label: "June", value: "06" },
              { label: "July", value: "07" },
              { label: "August", value: "08" },
              { label: "September", value: "09" },
              { label: "October", value: "10" },
              { label: "November", value: "11" },
              { label: "December", value: "12" },
            ]}
            onChange={(selectedOption) => {
              if (selectedOption.length < 1) return setSelectedMonth('');
              setSelectedMonth(selectedOption?.slice(-1)[0]);
            }}
            isDisabled={selectedYear.length < 1}
            className={styles.invoice__select__year}
            placeholder="Select month"
            isMulti={true}
          />
        </div>
        
      </div>
      {selectedYear && (
        <div style={{ width: 450, height: 450, margin: '0 auto' }}>
          <Pie
            data={{
              labels: pushersData.map((item) => item.pusher),
              datasets: [
                {
                  label: "Number of commits",
                  data: pushersData.map((item) => item.number_of_commits),
                  backgroundColor: [
                    "#005734",
                    "red",
                    "blue",
                    "yellow",
                    "purple",
                    "pink",
                    "black",
                    "orange",
                    "green",
                    "blueviolet",
                    "brown",
                  ],
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}
