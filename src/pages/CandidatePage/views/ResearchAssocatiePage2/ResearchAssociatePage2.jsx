import React, { useRef, useEffect, useState } from "react";
import styles from "./styles.module.css";
import JobLandingLayout from "../../../../layouts/CandidateJobLandingLayout/LandingLayout";
import { useCurrentUserContext } from "../../../../contexts/CurrentUserContext";
import FusionCharts from "fusioncharts";
import Maps from "fusioncharts/fusioncharts.maps";
import World from "fusioncharts/maps/fusioncharts.world";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";
import { getRegionalAssociateJobs } from "../../../../services/adminServices";

ReactFC.fcRoot(FusionCharts, Maps, World, FusionTheme);

const ResearchAssociatePage2 = () => {
  const { currentUser } = useCurrentUserContext();
  const [regionalJobs, setRegionalJobs] = useState([]);

  useEffect(() => {
    const regionalAssociateJobs = async () => {
      const res = await getRegionalAssociateJobs(
        currentUser?.portfolio_info[0].org_id
      );
      console.log(res.data);
    };

    regionalAssociateJobs();
  }, []);

  const myDataSource = {
    chart: {
      caption: "",
      subcaption: "",
      numbersuffix: "",
      includevalueinlabels: "1",
      labelsepchar: ": ",
      entityFillHoverColor: "#80ab9a",
      theme: "fusion",
    },
    colorrange: {
      minvalue: "0",
      code: "#4d8971",
      gradient: "1",
      color: [
        {
          minvalue: "0.5",
          maxvalue: "1.0",
          color: "#669a85",
        },
        {
          minvalue: "1.0",
          maxvalue: "2.0",
          color: "#33795d",
        },
        {
          minvalue: "2.0",
          maxvalue: "3.0",
          color: "#005734",
        },
      ],
    },
    data: [
      {
        id: "NA",
        value: ".82",
        showLabel: "1",
      },
      {
        id: "SA",
        value: "2.04",
        showLabel: "1",
      },
      {
        id: "AS",
        value: "1.78",
        showLabel: "1",
      },
      {
        id: "EU",
        value: ".40",
        showLabel: "1",
      },
      {
        id: "AF",
        value: "2.58",
        showLabel: "1",
      },
      {
        id: "AU",
        value: "1.30",
        showLabel: "1",
      },
    ],
  };

  const chartConfigs = {
    type: "world",
    width: 600,
    height: 400,
    dataFormat: "json",
    dataSource: myDataSource,
  };
  return (
    <>
      <JobLandingLayout user={currentUser} hideSearch={true}>
        <div className={styles.candidate__Jobs__Screen__Container}>
          <h1 className={styles.job__Screen__Title}>
            <b>Join Dowell Team as a Research Associate</b>
          </h1>
          <div className={styles.job__Chart__Container}>
            <ReactFC {...chartConfigs} />
          </div>
        </div>
      </JobLandingLayout>
    </>
  );
};

export default ResearchAssociatePage2;
