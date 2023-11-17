import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  generateAuthToken,
  getUserInfoFromLoginAPI,
  getUserInfoFromPortfolioAPI,
} from "../services/authServices";
import { dowellLoginUrl } from "../services/axios";
import { getSettingUserProfileInfo } from "../services/settingServices";
import { teamManagementProductName } from "../utils/utils";

export default function useDowellLogin(
  updateCurrentUserState,
  updatePageLoading,
  updatePublicUserState,
  updateDetailsForPublicUser,
  updateNoUserDetailFound,
  updateProductUserState,
  updateDetailsForProductUser,
  updateReportsUserState,
  updateDetailsForReportsUser,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLocalSessionId = sessionStorage.getItem("session_id");
  const currentLocalPortfolioId = sessionStorage.getItem("portfolio_id");
  const currentLocalUserDetails = sessionStorage.getItem("user");
  const currentPublicSession = sessionStorage.getItem("public_user_session");
  const currentPublicUserDetails = sessionStorage.getItem("public_user");
  const currentProductSession = sessionStorage.getItem("product_user_session");
  const currentProductUserDetails = sessionStorage.getItem("product_user");
  const currentReportsSession = sessionStorage.getItem("reports_user_session");
  const currentReportsUserDetails = sessionStorage.getItem("reports_user");
  const navigate = useNavigate();

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const portfolio_id = searchParams.get("id");
    const publicView = searchParams.get("view");
    const jobToView = searchParams.get("job_id");
    const jobCompanyId = searchParams.get("job_company_id");
    const jobCompanyDataType = searchParams.get("company_data_type");
    const publicUserQrId = searchParams.get("qr_id");
    const masterLinkId = searchParams.get("link_id");
    const companyId = searchParams.get("company_id");
    const jobCategory = searchParams.get("job_category");
    const reportsType = searchParams.get("report_type");
    const threshold = searchParams.get("threshold");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const redirectUrl = searchParams.get("redirect_url");

    // FOR LOGGED IN PUBLIC USERS
    if (currentPublicSession && currentPublicUserDetails) {
      updatePageLoading(false);
      updatePublicUserState(true);
      updateDetailsForPublicUser(JSON.parse(currentPublicUserDetails));

      return
    }

    // FOR LOGGED IN PRODUCT USERS
    if (currentProductSession && currentProductUserDetails) {
      updatePageLoading(false);
      updateProductUserState(true);
      updateDetailsForProductUser(JSON.parse(currentProductUserDetails));

      return
    }

    // FOR LOGGED IN REPORT USERS
    if (currentReportsSession && currentReportsUserDetails) {
      updatePageLoading(false);
      updateReportsUserState(true);
      updateDetailsForReportsUser(JSON.parse(currentReportsUserDetails));

      return
    }


    // INITIAL LOAD FOR PUBLIC USER
    if (publicView && publicView === 'public' && jobToView && jobCompanyId && jobCompanyDataType) {
      updatePageLoading(false);
      updatePublicUserState(true);

      const publicUserDetails = {
        company_id: jobCompanyId,
        job: jobToView,
        data_type: jobCompanyDataType,
        qr_id: publicUserQrId,
        masterLinkId: masterLinkId,
      };

      updateDetailsForPublicUser(publicUserDetails)

      sessionStorage.setItem('public_user_session', true);
      sessionStorage.setItem('public_user', JSON.stringify(publicUserDetails));

      navigate(`/apply/job/${jobToView}`)
      return
    }

    
    // INITIAL LOAD FOR PRODUCT USER
    if (publicView && publicView === 'product' && companyId && jobCompanyDataType) {
      updatePageLoading(false);
      updateProductUserState(true);

      const productUserDetails = {
        company_id: companyId,
        data_type: jobCompanyDataType,
        qr_id: publicUserQrId,
        masterLinkId: masterLinkId,
      };

      if (jobCategory) {
        productUserDetails.onlySingleJobCategoryPermitted = true;
        productUserDetails.categoryPassed = jobCategory;
        productUserDetails.categoryAllowed = jobCategory === 'Internship' ? 'intern' : jobCategory.toLocaleLowerCase();
      }


      updateDetailsForProductUser(productUserDetails)

      sessionStorage.setItem('product_user_session', true);
      sessionStorage.setItem('product_user', JSON.stringify(productUserDetails));

      // if (jobCategory) navigate(`c/${productUserDetails.categoryAllowed}`);
      if (jobCategory) navigate(`/jobs?jobCategory=${jobCategory}`);
      return
    }

    // INITIAL LOAD FOR REPORTS USER
    if (publicView && publicView === 'report' && companyId && jobCompanyDataType && reportsType) {
      updatePageLoading(false);
      updateReportsUserState(true);

      const reportsUserDetails = {
        company_id: companyId,
        data_type: jobCompanyDataType,
        qr_id: publicUserQrId,
        masterLinkId: masterLinkId,
        reportsViewPermitted: reportsType,
      };

      if (threshold) reportsUserDetails.reportThreshold = threshold;

      if (startDate) reportsUserDetails.reportStartDate = startDate;

      if (endDate) reportsUserDetails.reportEndDate = endDate;

      updateDetailsForReportsUser(reportsUserDetails)

      sessionStorage.setItem('reports_user_session', true);
      sessionStorage.setItem('reports_user', JSON.stringify(reportsUserDetails));

      navigate('/');
      return
    }
  

    // FOR LOGGED IN USERS
    if (!session_id && !portfolio_id) {
      if (currentLocalSessionId && currentLocalPortfolioId) {
        if (currentLocalUserDetails) {
          const parsedUserDetails = JSON.parse(currentLocalUserDetails);

          updateCurrentUserState(parsedUserDetails);
          updatePageLoading(false);
          return
        }
        getUserInfoFromPortfolioAPI({ session_id: currentLocalSessionId })
          .then(async (res) => {
            const currentUserDetails = res.data;

            if (currentUserDetails.message || currentUserDetails.msg) {
              updateNoUserDetailFound(true);
              updatePageLoading(false);

              return;
            }

            // NEW IMPLEMENTATION WITH TOKEN
            try {
              const { access_token } = (await generateAuthToken({
                "username": currentUserDetails?.userinfo?.username,
                "portfolio": currentUserDetails?.portfolio_info[0]?.portfolio_name,
                "data_type": currentUserDetails?.portfolio_info[0]?.data_type,
                "company_id": currentUserDetails?.portfolio_info[0]?.org_id,
              })).data;
              
              sessionStorage.setItem('token', access_token);
              
              try {
                const settingsResponse = await getSettingUserProfileInfo();
                const settingForCurrentUserOrg = settingsResponse?.data
                  .reverse()
                  .filter(
                    (setting) =>
                      setting.company_id ===
                      currentUserDetails.portfolio_info[0].org_id
                  )
                  .filter(
                    (setting) => 
                      setting.data_type === 
                      currentUserDetails.portfolio_info[0].data_type
                  );

                //CHECK IF USER HAS ROLE CONFIGURED
                const userHasRoleConfigured = settingForCurrentUserOrg.find(
                  (setting) =>
                    setting.profile_info[setting.profile_info.length - 1].profile_title ===
                    currentUserDetails.portfolio_info[0].portfolio_name
                );

                //USER DOES NOT HAVE ROLE CONFIGURED
                if (!userHasRoleConfigured) {
                  sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
                  updateCurrentUserState(currentUserDetails);
                  updatePageLoading(false);

                  if (redirectUrl) navigate(redirectUrl.replaceAll('~', '&'));

                  return;
                } else {
                  //USER HAS ROLE CONFIGURED
                  sessionStorage.setItem('user', JSON.stringify({...currentUserDetails, settings_for_profile_info: userHasRoleConfigured }));
                  updateCurrentUserState({
                    ...currentUserDetails,
                    settings_for_profile_info: userHasRoleConfigured,
                  });
                  updatePageLoading(false);

                  if (redirectUrl) navigate(redirectUrl.replaceAll('~', '&'));

                  return
                }
              } catch (error) {
                console.log('fetch seetings error: ', error);
                sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
                updateCurrentUserState(currentUserDetails);
                updatePageLoading(false);
              }
              
            } catch (error) {
              console.log('fetch token error: ', error);
              sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
              updateCurrentUserState(currentUserDetails);
              updatePageLoading(false);
            }

            // // PREVIOUS IMPLEMENTATION WITHOUT TOKEN
            // try {
            //   const settingsResponse = await getSettingUserProfileInfo();
            //   const settingForCurrentUserOrg = settingsResponse.data
            //     .reverse()
            //     .filter(
            //       (setting) =>
            //         setting.company_id ===
            //         currentUserDetails.portfolio_info[0].org_id
            //     )
            //     .filter(
            //       (setting) => 
            //         setting.data_type === 
            //         currentUserDetails.portfolio_info[0].data_type
            //     );

            //   //CHECK IF USER HAS ROLE CONFIGURED
            //   const userHasRoleConfigured = settingForCurrentUserOrg.find(
            //     (setting) =>
            //       setting.profile_info[setting.profile_info.length - 1].profile_title ===
            //       currentUserDetails.portfolio_info[0].portfolio_name
            //   );

            //   //USER DOES NOT HAVE ROLE CONFIGURED
            //   if (!userHasRoleConfigured) {
            //     sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
            //     updateCurrentUserState(currentUserDetails);
            //     updatePageLoading(false);

            //     return;
            //   } else {
            //     //USER HAS ROLE CONFIGURED
            //     sessionStorage.setItem('user', JSON.stringify({...currentUserDetails, settings_for_profile_info: userHasRoleConfigured }));
            //     updateCurrentUserState({
            //       ...currentUserDetails,
            //       settings_for_profile_info: userHasRoleConfigured,
            //     });
            //     updatePageLoading(false);
            //   }
            // } catch (error) {
            //   sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
            //   updateCurrentUserState(currentUserDetails);
            //   updatePageLoading(false);
            // }
          })
          .catch((err) => {
            console.log(err);
            updatePageLoading(false);
          });
        return;
      }

      if (currentLocalSessionId && !currentLocalPortfolioId) {
        if (currentLocalUserDetails) {
          const parsedUserDetails = JSON.parse(currentLocalUserDetails);

          updateCurrentUserState(parsedUserDetails);
          updatePageLoading(false);
          return
        }
        getUserInfoFromLoginAPI({ session_id: currentLocalSessionId })
          .then(async (res) => {
            const currentUserDetails = res.data;
            
            if (currentUserDetails.message || currentUserDetails.msg) {
              updateNoUserDetailFound(true);
              updatePageLoading(true);

              return;
            }

            const foundTeamManagementProductInPortfolio = currentUserDetails?.portfolio_info?.find(
              (item) => item.product === teamManagementProductName &&
                item.member_type === 'owner'
            )

            generateAuthToken({
              "username": currentUserDetails?.userinfo?.username,
              "portfolio": foundTeamManagementProductInPortfolio?.portfolio_name,
              "data_type": foundTeamManagementProductInPortfolio?.data_type,
              "company_id": foundTeamManagementProductInPortfolio?.org_id,
            }).then(res => {
              sessionStorage.setItem('token', res?.data?.access_token);
              
              sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
              updateCurrentUserState(currentUserDetails);
              updatePageLoading(false);

              if (redirectUrl) navigate(redirectUrl.replaceAll('~', '&'));

            }).catch(err => {
              console.log('Failed to get token', err);
              sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
              updateCurrentUserState(currentUserDetails);
              updatePageLoading(false);
            })
          })
          .catch((err) => {
            console.log(err);
            updatePageLoading(false);
          });
        return;
      }

      return (window.location.replace(dowellLoginUrl));
    }

    sessionStorage.setItem("session_id", session_id);

    if (session_id && !portfolio_id) {
      // remove session_id from url
      // window.history.replaceState(
      //   {},
      //   document.title,
      //   "/100098-DowellJobPortal/"
      // );

      if (currentLocalUserDetails) {
        const parsedUserDetails = JSON.parse(currentLocalUserDetails);

        updateCurrentUserState(parsedUserDetails);
        updatePageLoading(false);
        return
      }

      getUserInfoFromLoginAPI({ session_id: session_id })
        .then(async (res) => {
          const currentUserDetails = res.data;

          if (currentUserDetails.message || currentUserDetails.msg) {
            updateNoUserDetailFound(true);
            updatePageLoading(false);

            return;
          }

          const foundTeamManagementProductInPortfolio = currentUserDetails?.portfolio_info?.find(
            (item) => item.product === teamManagementProductName &&
              item.member_type === 'owner'
          )

          generateAuthToken({
            "username": currentUserDetails?.userinfo?.username,
            "portfolio": foundTeamManagementProductInPortfolio?.portfolio_name,
            "data_type": foundTeamManagementProductInPortfolio?.data_type,
            "company_id": foundTeamManagementProductInPortfolio?.org_id,
          }).then(res => {
            sessionStorage.setItem('token', res?.data?.access_token);

            sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
            updateCurrentUserState(currentUserDetails);
            updatePageLoading(false);

            if (redirectUrl) navigate(redirectUrl.replaceAll('~', '&'));

          }).catch(err => {
            console.log('Failed to get token', err);
            sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
            updateCurrentUserState(currentUserDetails);
            updatePageLoading(false);
          })
        })
        .catch((err) => {
          console.log(err);
          updatePageLoading(false);
        });
      return;
    }

    // remove session_id and id from url
    // window.history.replaceState({}, document.title, "/100098-DowellJobPortal/");

    sessionStorage.setItem("portfolio_id", portfolio_id);

    if (currentLocalUserDetails) {
      const parsedUserDetails = JSON.parse(currentLocalUserDetails);

      updateCurrentUserState(parsedUserDetails);
      updatePageLoading(false);
      return
    }

    getUserInfoFromPortfolioAPI({ session_id: session_id })
      .then(async (res) => {
        const currentUserDetails = res.data;

        if (currentUserDetails.message || currentUserDetails.msg) {
          updateNoUserDetailFound(true);
          updatePageLoading(false);

          return;
        }
        
        // NEW IMPLEMENTATION WITH TOKEN
        try {
          const { access_token } = (await generateAuthToken({
            "username": currentUserDetails?.userinfo?.username,
            "portfolio": currentUserDetails?.portfolio_info[0]?.portfolio_name,
            "data_type": currentUserDetails?.portfolio_info[0]?.data_type,
            "company_id": currentUserDetails?.portfolio_info[0]?.org_id,
          })).data;
          
          sessionStorage.setItem('token', access_token);
          
          try {
            const settingsResponse = await getSettingUserProfileInfo();
            const settingForCurrentUserOrg = settingsResponse?.data
              .reverse()
              .filter(
                (setting) =>
                  setting.company_id ===
                  currentUserDetails.portfolio_info[0].org_id
              )
              .filter(
                (setting) => 
                  setting.data_type === 
                  currentUserDetails.portfolio_info[0].data_type
              );

            //CHECK IF USER HAS ROLE CONFIGURED
            const userHasRoleConfigured = settingForCurrentUserOrg.find(
              (setting) =>
                setting.profile_info[setting.profile_info.length - 1].profile_title ===
                currentUserDetails.portfolio_info[0].portfolio_name
            );

            //User Does not have role configured
            if (!userHasRoleConfigured) {
              sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
              updateCurrentUserState(currentUserDetails);
              updatePageLoading(false);

              if (redirectUrl) navigate(redirectUrl.replaceAll('~', '&'));

              return;
            } else {
              //User has role configured
              sessionStorage.setItem('user', JSON.stringify({...currentUserDetails, settings_for_profile_info: userHasRoleConfigured}));
              updateCurrentUserState({
                ...currentUserDetails,
                settings_for_profile_info: userHasRoleConfigured,
              });
              updatePageLoading(false);

              if (redirectUrl) navigate(redirectUrl.replaceAll('~', '&'));

              return
            }
          } catch (error) {
            console.log('fetch settings error: ', error);
            sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
            updateCurrentUserState(currentUserDetails);
            updatePageLoading(false);
          }
          
        } catch (error) {
          console.log('fetch token error: ', error);
          sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
          updateCurrentUserState(currentUserDetails);
          updatePageLoading(false);
        }

        // // PREVIOUS IMPLEMENTATION WITHOUT TOKEN
        // try {
        //   const settingsResponse = await getSettingUserProfileInfo();
        //   const settingForCurrentUserOrg = settingsResponse.data
        //     .reverse()
        //     .filter(
        //       (setting) =>
        //         setting.company_id ===
        //         currentUserDetails.portfolio_info[0].org_id
        //     )
        //     .filter(
        //       (setting) => 
        //         setting.data_type === 
        //         currentUserDetails.portfolio_info[0].data_type
        //     );

        //   //CHECK IF USER HAS ROLE CONFIGURED
        //   const userHasRoleConfigured = settingForCurrentUserOrg.find(
        //     (setting) =>
        //       setting.profile_info[setting.profile_info.length - 1].profile_title ===
        //       currentUserDetails.portfolio_info[0].portfolio_name
        //   );

        //   //User Does not have role configured
        //   if (!userHasRoleConfigured) {
        //     sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
        //     updateCurrentUserState(currentUserDetails);
        //     updatePageLoading(false);

        //     return;
        //   } else {
        //     //User has role configured
        //     sessionStorage.setItem('user', JSON.stringify({...currentUserDetails, settings_for_profile_info: userHasRoleConfigured}));
        //     updateCurrentUserState({
        //       ...currentUserDetails,
        //       settings_for_profile_info: userHasRoleConfigured,
        //     });
        //     updatePageLoading(false);
        //   }
        // } catch (error) {
        //   sessionStorage.setItem('user', JSON.stringify(currentUserDetails));
        //   updateCurrentUserState(currentUserDetails);
        //   updatePageLoading(false);
        // }
      })
      .catch((err) => {
        console.log(err);
        updatePageLoading(false);
      });
  }, []);
}
