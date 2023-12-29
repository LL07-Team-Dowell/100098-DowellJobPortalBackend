import { useEffect } from "react";
import { getWorklogDetailInOrganization } from "../../../../../services/adminServices";

export default function useLoadLogOverviewData(
    userDetail,
    currentLogOverviewFilter,
    updateLogOverviewDataloading,
    dashboardLogDataForToday,
    updateDashboardLogDataForToday,
    dashboardLogDataForMonth,
    updateDashboardLogLogDataForMonth,
) {
    useEffect(() => {
        if (currentLogOverviewFilter === 'today') {
            if (dashboardLogDataForToday?.labels?.length < 1) {
                updateLogOverviewDataloading(true);

                getWorklogDetailInOrganization('logs_for_today', userDetail?.portfolio_info[0]?.org_id).then(res => {
                    updateLogOverviewDataloading(false);
                    
                    const [ 
                        projectLabelsForToday,
                        projectCountForToday,
                    ] = [
                        Object.keys(res?.data?.logs_for_today || {}),
                        Object.values(res?.data?.logs_for_today || {}),
                    ];

                    updateDashboardLogDataForToday({
                        labels: projectLabelsForToday,
                        datasets: [
                            {
                                label: 'Logs Count',
                                data: projectCountForToday,
                                backgroundColor: '#005734',
                                maxBarThickness: 40,
                                borderRadius: 5,
                            },
                        ]
                    });

                }).catch(err => {
                    updateLogOverviewDataloading(false);
                })
            }
        }

        if (currentLogOverviewFilter === 'this month') {
            if (dashboardLogDataForMonth?.labels?.length < 1) {
                updateLogOverviewDataloading(true);

                getWorklogDetailInOrganization('logs_for_month', userDetail?.portfolio_info[0]?.org_id).then(res => {
                    updateLogOverviewDataloading(false);

                    const [ 
                        projectLabelsForMonth,
                        projectCountForMonth,
                    ] = [
                        Object.keys(res?.data?.logs_for_month || {}),
                        Object.values(res?.data?.logs_for_month || {}),
                    ];

                    updateDashboardLogLogDataForMonth({
                        labels: projectLabelsForMonth,
                        datasets: [
                            {
                                label: 'Logs Count',
                                data: projectCountForMonth,
                                backgroundColor: '#005734',
                                maxBarThickness: 40,
                                borderRadius: 5,
                            },
                        ]
                    });

                }).catch(err => {
                    updateLogOverviewDataloading(false);
                })
            }
        }

    }, [currentLogOverviewFilter])
}