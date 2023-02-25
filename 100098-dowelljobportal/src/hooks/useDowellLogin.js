import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getUserInfoFromLoginAPI,
  getUserInfoFromPortfolioAPI,
} from "../services/authServices";
import { dowellLoginUrl } from "../services/axios";
import { getSettingUserProfileInfo } from "../services/settingServices";

export default function useDowellLogin(
  updateCurrentUserState,
  updatePageLoading
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLocalSessionId = sessionStorage.getItem("session_id");
  const currentLocalPortfolioId = sessionStorage.getItem("id");

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const portfolio_id = searchParams.get("id");

    // remove session_id and id from url
    window.history.replaceState({}, document.title, "/");

    if (!session_id && !portfolio_id) {
      if (currentLocalSessionId && currentLocalPortfolioId) {
        getUserInfoFromPortfolioAPI({ session_id: currentLocalSessionId })
          .then(async (res) => {
            const currentUserDetails = res.data;
            try {
              const settingsResponse = await getSettingUserProfileInfo();
              const settingForCurrentUserOrg = settingsResponse.data
                .reverse()
                .filter(
                  (setting) =>
                    setting.company_id ===
                    currentUserDetails.portfolio_info[0].org_id
                );

              //CHECK IF USER HAS ROLE CONFIGURED
              const userHasRoleConfigured = settingForCurrentUserOrg.find(
                (setting) => setting.portfolio_info[0].portfolio_title
              );

              //USER DOES NOT HAVE ROLE CONFIGURED
              if (!userHasRoleConfigured) {
                updateCurrentUserState(currentUserDetails);
                updatePageLoading(false);

                return;
              } else {
                //USER HAS ROLE CONFIGURED
                updateCurrentUserState({
                  ...currentUserDetails,
                  settings_for_profile_info: userHasRoleConfigured,
                });
                updatePageLoading(false);
              }
            } catch (error) {
              updateCurrentUserState(currentUserDetails);
              updatePageLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            updatePageLoading(false);
          });
        return;
      }

      if (currentLocalSessionId && !currentLocalPortfolioId) {
        getUserInfoFromLoginAPI({ session_id: currentLocalSessionId })
          .then(async (res) => {
            const currentUserDetails = res.data;
            try {
              const settingsResponse = await getSettingUserProfileInfo();
              const settingForCurrentUserOrg = settingsResponse.data
                .reverse()
                .filter(
                  (setting) =>
                    setting.company_id ===
                    currentUserDetails.portfolio_info[0].org_id
                );

              //CHECK IF USER HAS ROLE CONFIGURED
              const userHasRoleConfigured = settingForCurrentUserOrg.find(
                (setting) => setting.portfolio_info[0].portfolio_title
              );

              //User Does not have role configured
              if (!userHasRoleConfigured) {
                updateCurrentUserState(currentUserDetails);
                updatePageLoading(false);

                return;
              } else {
                //User has role configured
                updateCurrentUserState({
                  ...currentUserDetails,
                  settings_for_profile_info: userHasRoleConfigured,
                });
                updatePageLoading(false);
              }
            } catch (error) {
              updateCurrentUserState(currentUserDetails);
              updatePageLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            updatePageLoading(false);
          });
        return;
      }

      return (window.location.href = dowellLoginUrl);
    }

    sessionStorage.setItem("session_id", session_id);

    if (session_id && !portfolio_id) {
      getUserInfoFromLoginAPI({ session_id: session_id })
        .then(async (res) => {
          const currentUserDetails = res.data;
          try {
            const settingsResponse = await getSettingUserProfileInfo();
            const settingForCurrentUserOrg = settingsResponse.data
              .reverse()
              .filter(
                (setting) =>
                  setting.company_id ===
                  currentUserDetails.portfolio_info[0].org_id
              );

            //CHECK IF USER HAS ROLE CONFIGURED
            const userHasRoleConfigured = settingForCurrentUserOrg.find(
              (setting) => setting.portfolio_info[0].portfolio_title
            );

            //User Does not have role configured
            if (!userHasRoleConfigured) {
              updateCurrentUserState(currentUserDetails);
              updatePageLoading(false);

              return;
            } else {
              //User has role configured
              updateCurrentUserState({
                ...currentUserDetails,
                settings_for_profile_info: userHasRoleConfigured,
              });
              updatePageLoading(false);
            }
          } catch (error) {
            updateCurrentUserState(currentUserDetails);
            updatePageLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          updatePageLoading(false);
        });
      return;
    }

    sessionStorage.setItem("portfolio_id", portfolio_id);

    getUserInfoFromPortfolioAPI({ session_id: session_id })
      .then(async (res) => {
        const currentUserDetails = res.data;
        try {
          const settingsResponse = await getSettingUserProfileInfo();
          const settingForCurrentUserOrg = settingsResponse.data
            .reverse()
            .filter(
              (setting) =>
                setting.company_id ===
                currentUserDetails.portfolio_info[0].org_id
            );

          //CHECK IF USER HAS ROLE CONFIGURED
          const userHasRoleConfigured = settingForCurrentUserOrg.find(
            (setting) => setting.portfolio_info[0].portfolio_title
          );

          //User Does not have role configured
          if (!userHasRoleConfigured) {
            updateCurrentUserState(currentUserDetails);
            updatePageLoading(false);

            return;
          } else {
            //User has role configured
            updateCurrentUserState({
              ...currentUserDetails,
              settings_for_profile_info: userHasRoleConfigured,
            });
            updatePageLoading(false);
          }
        } catch (error) {
          updateCurrentUserState(currentUserDetails);
          updatePageLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        updatePageLoading(false);
      });
  }, []);
}
